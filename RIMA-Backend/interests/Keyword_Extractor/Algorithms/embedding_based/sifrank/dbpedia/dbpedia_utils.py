import requests
from SPARQLWrapper import SPARQLWrapper, JSON
from itertools import product
import math
import networkx as nx
from wikipediaapi import Wikipedia
# from sentence_traansformers import util, SentenceTransformer
from ..utils import get_POSTagger
import numpy as np
import re

import logging
from ...log import LOG

logger = LOG(name=__name__, level=logging.DEBUG)


class DBpediaSpotlight:
    """
    """

    def __init__(self, lang='en'):
        self.url = "https://api.dbpedia-spotlight.org/%s/annotate" % lang
        self.sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        #self.sparql = SPARQLWrapper("http://localhost:8890/sparql")
        self.sparql.setTimeout(60)
        self.wiki_api = Wikipedia('en')

    def annotate(self, keyphrases):
        """
        """
        annotations = []
        final_dict = {}
        relation_dict = {}
        try:

            for key, value in keyphrases.items():
                params = {"text": key}
                headers = {"Accept": "application/json"}
                r = requests.get(self.url, headers=headers,
                                 params=params, verify=False).json()

                if 'Resources' in r:
                    resources = r['Resources']

                    for resource in resources:
                        annotation = {
                            "id": abs(hash(resource['@URI'])),
                            "label": resource['@surfaceForm'],
                            "uri": resource['@URI'],
                            "sim_score": resource['@similarityScore'],
                            "type": "annotation",
                        }
                        label = self._get_label(resource['@URI'])
                        if label != "":
                            annotation["original_name"] = key
                            annotation["name"] = label
                            annotation["weight"] = value
                        if not self._exists(annotation, annotations):
                            annotations.append(annotation)

        except Exception as e:
            logger.error("Failed to annotate %s - %s" % (keyphrases, e))

        # convert annotations to dictionary of name: weight
        print('annotations: ', annotations)
        for concept in annotations:
            if "name" in concept.keys():
                final_dict.update({concept['name']: concept['weight']})
                relation_dict.update(
                    {concept['name']: concept['original_name']})
        print('\nfinal_dict: ', final_dict)
        print('\nrelation_dict: ', relation_dict)
        return relation_dict, final_dict

    def _get_label(self, uri):
        """
        """
        label = ""
        try:
            # Getting rdfs:label from @URI object from dbpedia annotate API
            query = """
                SELECT ?label
                FROM <http://dbpedia.org>
                WHERE {
                    <%s> rdfs:label ?label .
                    FILTER (lang(?label) = 'en')
                }
            """ % uri

            self.sparql.setQuery(query)
            self.sparql.setReturnFormat(JSON)
            results = self.sparql.query().convert()
            label = results["results"]["bindings"][0]["label"]["value"]

        except Exception:
            # logger.error("Failed to get label for '%s' - %s" % (uri, e))
            pass
        return label

    def _exists(self, node, nodes):
        return any(node['id'] == _node['id'] for _node in nodes)
