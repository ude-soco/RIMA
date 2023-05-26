from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request

import requests
import json
from neomodel.match import NodeSet
# from bertopic import BERTopic
from .models import *
# import djangno settings
from django.conf import settings
from neo4j import GraphDatabase

from sklearn.metrics.pairwise import cosine_similarity
import torch
from sentence_transformers import SentenceTransformer

from .get_topics import extract_topics, preprocess
from bertopic import BERTopic

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f'You are using {device} for bertopioc')
sentence_model = SentenceTransformer("paraphrase-MiniLM-L6-v2", device=device)
# sentence_model = SentenceTransformer("paraphrase-MiniLM-L12-v2", device=device)
# sentence_model = SentenceTransformer("all-mpnet-base-v2", device=device)
topic_model = BERTopic(embedding_model=sentence_model)


def similarity_score(x, y):
    return cosine_similarity([x], [y])[0][0]


@api_view(['GET'])
def search_paper(request: Request):
    params = request.query_params
    search_key = params.get('key')
    if not search_key:
        return Response({'error': 'search_key is not provided'}, status=400)

    try:
        url = f"https://api.semanticscholar.org/graph/v1/paper/search?query={search_key}"
        res = requests.get(url)

        if res.status_code != 200:
            return Response({"error": "Error occurred while fetching paper information"}, status=400)

        return Response(res.json())
    except Exception as e:
        print(e)
        return {'error': str(e)}


one_paper_fields = ['paperId', 'title', 'abstract', 'year', 'authors',
                    'referenceCount', 'citationCount', 'fieldsOfStudy',
                    'publicationTypes', 'embedding', 'tldr']

cite_ref_fields = ['paperId']

MAX_PAPER_PER_REQUEST = 100


def reset_database():
    bolt_url = settings.NEOMODEL_NEO4J_BOLT_URL
    username, password = bolt_url.split('//')[1].split('@')[0].split(':')
    raw_url = bolt_url.replace(f'{username}:{password}@', '')
    driver = GraphDatabase.driver(raw_url, auth=(username, password))

    # Get all StructuredNode subclasses from the models module
    structured_node_classes = [
        cls.__name__ for cls in globals().values()
        if isinstance(cls, type) and issubclass(cls, StructuredNode) and cls is not StructuredNode
    ]

    for cls in structured_node_classes:
        with driver.session() as session:
            session.run(f'MATCH (n:{cls}) DETACH DELETE n')

    print('Database reset successfully')
    return True


def paper_to_neo(data):
    # create new paper
    paper = Paper(paper_id=data['paperId'], title=data['title'],
                  abstract=data['abstract'], year=data['year'],
                  tldr=data['tldr']['text'] if data['tldr'] else None,
                  study_fields=data['fieldsOfStudy'],
                  specter_embeddings=data['embedding']['vector'],
                  citation_count=data['citationCount'],
                  reference_count=data['referenceCount']).save()

    # add authors
    for i, author in enumerate(data['authors']):
        try:
            author_node = Author.nodes.get_or_none(
                author_id=author['authorId'])
            if not author_node:
                author_node = Author(
                    name=author['name'], author_id=author['authorId']).save()
            paper.authors.connect(author_node, {'position': i})
        except Exception as e:
            print(e)

    # if paper.abstract is not None:
    #     topics = extract_topics(data['abstract'])
    #     paper.topics = topics
    #     paper.save()

    return paper


def serialize_paper(paper: Paper):
    data = {
        'paper_id': paper.paper_id,
        'title': paper.title,
        'abstract': paper.abstract,
        'year': paper.year,
        'tldr': paper.tldr,
        'study_fields': paper.study_fields,
        'reference_count': paper.reference_count,
        'citation_count': paper.citation_count,
        'authors': [{'name': author.name} for author in paper.authors.all()],
        'topics': paper.study_fields,
        'topic_group': -1,
        'citations': [{'paper_id': citation.paper_id, 'title': citation.title,
                       'reference_count': citation.reference_count,
                       'citation_count': citation.citation_count,
                       'similarity': paper.citations.relationship(citation).similarity,
                       'authors': [{'name': author.name} for author in citation.authors.all()],
                       'topics': citation.study_fields,
                       'topic_group': -1,
                       'year': citation.year,
                       'abstract': citation.abstract, } for citation in paper.get_citations()],
        'references': [{'paper_id': reference.paper_id, 'title': reference.title,
                        'reference_count': reference.reference_count,
                        'citation_count': reference.citation_count,
                        'similarity': paper.citations.relationship(reference).similarity,
                        'authors': [{'name': author.name} for author in reference.authors.all()],
                        'topics': reference.study_fields,
                        'topic_group': -1,
                        'year': reference.year,
                        'abstract': reference.abstract, } for reference in paper.get_references()]
    }
    abstracts = {}
    if paper.abstract:
        abstracts[paper.paper_id] = paper.abstract
    for citation in data['citations']:
        if citation['abstract']:
            abstracts[citation['paper_id']] = citation['abstract']
    for reference in data['references']:
        if reference['abstract']:
            abstracts[reference['paper_id']] = reference['abstract']

    docs = [preprocess(abstract) for abstract in abstracts.values()]
    if len(docs) > 0:
        print('extracting topics')
        topics, _ = topic_model.fit_transform(docs)
        print('done')
        topics = list(topics)

        topic_info = topic_model.get_topic_info()
        for i, paper_id , topic_group in zip(range(len(topics)), abstracts.keys(), topics):
            if paper.paper_id == paper_id:
                data['topics'] = topic_info.iloc[topic_group + 1]["Name"].split('_')[1:]
                data['topic_group'] = topic_group + 1

            for citation in data['citations']:
                if citation['paper_id'] == paper_id:
                    citation['topics'] = topic_info.iloc[topic_group + 1]["Name"].split('_')[1:]
                    citation['topic_group'] = topic_group + 1
            for reference in data['references']:
                if reference['paper_id'] == paper_id:
                    reference['topics'] = topic_info.iloc[topic_group + 1]["Name"].split('_')[1:]
                    reference['topic_group'] = topic_group + 1
            

        # # Customize HDBSCAN parameters
        # topic_model.hdbscan_model.min_cluster_size = 10
        # topic_model.hdbscan_model.min_samples = 2

        # # Refit the model with the new HDBSCAN parameters
        # topic_model.fit(docs)

        # # Transform the docs again
        # new_topics, _ = topic_model.transform(docs)

    data['citations'] = sorted(
        data['citations'], key=lambda x: x['similarity'], reverse=True)[: 5]
    data['references'] = sorted(
        data['references'], key=lambda x: x['similarity'], reverse=True)[: 5]
    return data


@ api_view(['POST'])
def add_new_paper(request: Request):
    data = json.loads(request.body)
    paper_id = data.get('paper_id')
    if not paper_id:
        return Response({"error": "Paper ID is required"}, status=400)

    url = f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields={','.join(one_paper_fields)}"
    # url = f"https://api.semanticscholar.org/v1/paper/{paper_id}"
    res = requests.get(url)
    if res.status_code != 200:
        return Response({"error": "Error occurred while fetching paper information"}, status=400)
    paper_data = res.json()

    nodes: NodeSet = Paper.nodes
    paper = nodes.get_or_none(paper_id=paper_id)
    if paper and paper.is_fetched:
        return Response(serialize_paper(paper))

    abstracts = {}
    # create new paper
    if not paper:
        paper = paper_to_neo(paper_data)
    if paper.abstract is not None:
        abstracts[paper_id] = paper.abstract

    # add citations
    citation_count = paper_data['citationCount']
    # for test
    citation_count = min(citation_count, 100)
    Citation_url = f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations"
    for i in range(citation_count//MAX_PAPER_PER_REQUEST + 1):
        res = requests.get(Citation_url, params={'offset': i*MAX_PAPER_PER_REQUEST,
                                                 'limit': MAX_PAPER_PER_REQUEST,
                                                 'fields': ','.join(cite_ref_fields)})
        if res.status_code != 200:
            return Response({"error": "Error occurred while fetching paper information"}, status=400)

        papers_ids = [paper['citingPaper']['paperId']
                      for paper in res.json().get('data', [])][0:25]
        batch_url = f"https://api.semanticscholar.org/graph/v1/paper/batch"
        res = requests.post(batch_url, params={'fields': ','.join(one_paper_fields)},
                            json={'ids': papers_ids})

        if res.status_code != 200:
            return Response({"error": "Error occurred while fetching paper information"}, status=400)
        citations = res.json()
        for citation in citations:
            if not citation:
                continue
            citation_node = Paper.nodes.get_or_none(
                paper_id=citation['paperId'])
            if not citation_node:
                citation_node = paper_to_neo(citation)
                if citation_node.abstract is not None:
                    abstracts[citation_node.paper_id] = citation_node.abstract
            similar_score = similarity_score(
                paper.specter_embeddings, citation_node.specter_embeddings)
            similar_score = round(similar_score, 3)
            paper.citations.connect(
                citation_node, {'relationship_type': 'citation', 'similarity': similar_score})

    # add references
    reference_count = paper_data['referenceCount']
    # for test
    reference_count = min(reference_count, 100)
    Reference_url = f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references"
    for i in range(reference_count//MAX_PAPER_PER_REQUEST + 1):
        res = requests.get(Reference_url, params={'offset': i*MAX_PAPER_PER_REQUEST,
                                                  'limit': MAX_PAPER_PER_REQUEST,
                                                  'fields': ','.join(cite_ref_fields)})
        if res.status_code != 200:
            return Response({"error": "Error occurred while fetching paper information"}, status=400)

        papers_ids = [paper['citedPaper']['paperId']
                      for paper in res.json().get('data', [])][0:25]
        batch_url = f"https://api.semanticscholar.org/graph/v1/paper/batch"
        res = requests.post(batch_url, params={'fields': ','.join(one_paper_fields)},
                            json={'ids': papers_ids})

        if res.status_code != 200:
            return Response({"error": "Error occurred while fetching paper information"}, status=400)
        references = res.json()
        for reference in references:
            if not reference:
                continue
            reference_node = Paper.nodes.get_or_none(
                paper_id=reference['paperId'])
            if not reference_node:
                reference_node = paper_to_neo(reference)
                if reference_node.abstract is not None:
                    abstracts[reference_node.paper_id] = reference_node.abstract
            similar_score = similarity_score(
                paper.specter_embeddings, reference_node.specter_embeddings)
            similar_score = round(similar_score, 3)
            paper.citations.connect(
                reference_node, {'relationship_type': 'reference', 'similarity': similar_score})

    paper.is_fetched = True
    paper.save()

    return Response(serialize_paper(paper))
