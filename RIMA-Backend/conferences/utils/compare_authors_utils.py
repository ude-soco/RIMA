from conferences.models.graph_db_entities import *
from conferences.utils import author_insights_utils as authorInsightsUtil
from conferences.utils import compare_conferences_utils as compConfUtils
from collections import defaultdict
from collections import OrderedDict
from collections import Counter
import pandas as pd
import ast
import re


def get_authors_publications_count_all_confs(author_list):
    final_data = []
    authors_data = []
    for author_id in author_list:
        author_node = Author.nodes.get(
            semantic_scolar_author_id=author_id.strip())
        author_pubs = author_node.published.all()

        publications_confs = get_publication_counts_each_conf(author_pubs)

        authors_data.append({
            "name": author_node.author_name,
            "data": publications_confs
        })
    final_data = get_series_categories(authors_data)
    return final_data


def get_series_categories(authors_data):
    final_data = []
    author_total_cond_count = []
    for author in authors_data:
        name_count_dict = defaultdict(int)
        for d in author["data"]:
            name_count_dict[d["name"]] += d["count"]
        author_total_cond_count.append({
            "name": author["name"],
            "data": (dict(name_count_dict))
        })
    categories = [item["name"] for item in author_total_cond_count]
    series_data = defaultdict(list)

    series_names = set()
    for item in author_total_cond_count:
        for series_name in item['data'].keys():
            series_names.add(series_name)

    for series_name in series_names:
        for item in author_total_cond_count:
            series_data[series_name].append(item['data'].get(series_name, 0))

    series = [{'name': name, 'data': counts}
              for name, counts in series_data.items()]

    final_data.append({
        "categories": categories,
        "series": series
    })
    return final_data


def get_authors_publications_count_conf_based(author_list, conf_list):
    authors_data = []
    final_data = []
    for author_id in author_list:
        author_node = Author.nodes.get(
            semantic_scolar_author_id=author_id.strip())
        author_pubs = [pub for pub in author_node.published.all(
        ) if pub.published_in_Confs[0].conference_name_abbr in conf_list]

        publications_confs = get_publication_counts_each_conf(author_pubs)

        authors_data.append({
            "name": author_node.author_name,
            "data": publications_confs
        })
    final_data = get_series_categories(authors_data)
    return final_data


def get_publication_counts_each_conf(author_pubs):
    conf_counts = defaultdict(int)

    for pub in author_pubs:
        conf_counts[pub.published_in_Confs[0].conference_name_abbr] += 1

    publications_confs = [{"name": conf, "count": count}
                          for conf, count in conf_counts.items()]

    return publications_confs


def get_authors_citations(confs, author_list):
    data = []
    total_citation = []
    categoreis = []
    final_data = []
    for author_id in author_list:
        author_node = Author.nodes.get(
            semantic_scolar_author_id=author_id)
        author_pubs = author_node.published.all()
        author_pubs = [
            pub for pub in author_pubs
            if pub.published_in_Confs[0].conference_name_abbr in confs]
        citations = 0
        for pub in author_pubs:
            citationsString = pub.citiations
            citations = citations + len(ast.literal_eval(citationsString))

        pubs_in_confs = [
            pub.published_in_Confs[0].conference_name_abbr for pub in author_pubs]

        categoreis.append(author_node.author_name)
        total_citation.append({
            "name": author_node.author_name,
            "data": [citations]
        })
        data.append({
            "name": author_node.author_name,
            "data": citations,
            "conferences": pubs_in_confs,
            "pubs_count": len(author_pubs)
        })
    final_data.append({
        "categories": categoreis,
        "citations": total_citation
    })

    return final_data


def get_coauthor_evolutions(author_list):
    data = []
    for author_id in author_list:
        author_node = Author.nodes.get(
            semantic_scolar_author_id=author_id.strip())
        author_pubs = author_node.published.all()
        data.append({"name": author_node.author_name,
                     "data": get_coauthor_count(author_node, author_pubs)})

    data_merged = merge_authors_data(data)
    return data_merged


def get_authors_pubs_evolutions(selected_confs, author_list):
    data = []
    for author_id in author_list:
        author_node = Author.nodes.get(
            semantic_scolar_author_id=author_id.strip())
        author_pubs = [pub for pub in author_node.published.all()
                       if pub.published_in_Confs[0].conference_name_abbr in selected_confs]

        data.append({"name": author_node.author_name,
                     "data": get_publications_count(author_node, author_pubs)})

    data_merged = merge_authors_data_for_productivity(data)

    return data_merged


def get_publications_count(author_node, author_pubs):
    events_pubs1 = [authorInsightsUtil.extract_year(pub.published_in[0].conference_event_name_abbr)
                    for pub in author_pubs]
    counts = Counter(events_pubs1)
    sorted_countes = OrderedDict(sorted(counts.items()))
    publications = list(sorted_countes.values())

    author_publications = {"name": author_node.author_name,
                           "data": publications}
    categories = list(sorted_countes.keys())

    publicationsConfs = [
        pub.published_in_Confs[0].conference_name_abbr for pub in author_pubs]
    author_pubs = [pub for pub in author_pubs]

    publicationsConfs = set(publicationsConfs)

    final_data = {
        "publicationsCounts": [author_publications],
        "categories": categories,
        "conferences": publicationsConfs
    }

    return final_data


def get_coauthor_count(author_node, author_pubs):
    events_pubs = [{"year":  authorInsightsUtil.extract_year(pub.published_in[0].conference_event_name_abbr),
                    "coauthorCounts": len(set([author.semantic_scolar_author_id for author in pub.authors.all()]))-1}
                   for pub in author_pubs]

    event_publication_counts = defaultdict(int)
    for item in events_pubs:
        event_publication_counts[item['year']] += item['coauthorCounts']

    result = [{'year': event, 'coauthorCounts': count}
              for event, count in event_publication_counts.items()]

    data = sorted(result,
                  key=lambda x: x["year"], reverse=False)

    categories = [obj["year"] for obj in data]
    coauthor_count = [obj["coauthorCounts"] for obj in data]

    coauthors = {"name": author_node.author_name,
                 "data": coauthor_count}

    publicationsConfs = [
        pub.published_in_Confs[0].conference_name_abbr for pub in author_pubs]
    author_pubs = [pub for pub in author_pubs]

    publicationsConfs = set(publicationsConfs)

    final_data = {
        "coauthors": [coauthors],
        "categories": categories,
        "conferences": publicationsConfs
    }

    return final_data


def merge_authors_data(data):
    final_categoreies = []
    fina_data = []
    data2 = []
    for author in data:
        final_categoreies.extend(author["data"]["categories"])
        final_categoreies = list(set(final_categoreies))
        final_categoreies.sort()

    for author in data:
        author_category = author["data"]["categories"]
        author_data = author["data"]["coauthors"][0]["data"]
        values_map = {k: v for k, v in zip(author_category, author_data)}
        final_author_data = [values_map.get(k, 0) for k in final_categoreies]
        data2.append({
            "series": {
                "name": author["name"],
                "data": final_author_data
            },
            "conferences": author["data"]["conferences"]
        })
    fina_data.append({
        "data": data2,
        "categories": final_categoreies
    })

    return fina_data


def merge_authors_data_for_productivity(data):
    final_categoreies = []
    fina_data = []
    data2 = []
    for author in data:
        final_categoreies.extend(author["data"]["categories"])
        final_categoreies = list(set(final_categoreies))
        final_categoreies.sort()

    for author in data:
        author_category = author["data"]["categories"]
        author_data = author["data"]["publicationsCounts"][0]["data"]
        values_map = {k: v for k, v in zip(author_category, author_data)}
        final_author_data = [values_map.get(k, 0) for k in final_categoreies]
        data2.append({
            "series": {
                "name": author["name"],
                "data": final_author_data
            },
            "conferences": author["data"]["conferences"]
        })
    fina_data.append({
        "data": data2,
        "categories": final_categoreies
    })

    return fina_data


def get_shared_interests_between_authors(confs, author_list):
    data = []
    for author_id in author_list:
        author_node = Author.nodes.get(semantic_scolar_author_id=author_id)
        author_pubs = [pub for pub in author_node.published.all()
                       if pub.published_in_Confs[0].conference_name_abbr in confs]
        author_pubs_keyword = [
            keyword.keyword for pub in author_pubs for keyword in pub.keywords.all()]
        author_pubs_keyword = list(set(author_pubs_keyword))

        data.append({
            "name": author_node.author_name,
            "keywords": author_pubs_keyword
        })

    return data


def get_shared_publication_between_authors(confs, author_list):
    data = []
    for author_id in author_list:
        author_node = Author.nodes.get(semantic_scolar_author_id=author_id)
        if "All Conferences" in confs:
            author_pubs = [pub.paper_id for pub in author_node.published.all()]
            data.append({
                "name": author_node.author_name,
                "publications": author_pubs
            })
        else:
            author_pubs = [pub.paper_id for pub in author_node.published.all()
                           if pub.published_in_Confs[0].conference_name_abbr in confs]
            data.append({
                "name": author_node.author_name,
                "publications": author_pubs
            })

    return data


def get_intersection(data):
    intersection = set((data[0]))
    for lst in data[1:]:
        intersection.intersection_update(set(lst))

    intersection_list = list(intersection)

    return intersection_list


def get_shared_keyword_basd_on_combs(authors_keywords, all_combs):
    result = []
    final_sets = []
    authors_name = []
    one_comb_keywords = []
    for comb in all_combs:
        sets = []
        one_comb_keywords = []
        for author_name in comb:

            comb_keywords = [
                item for item in authors_keywords if item["name"] == author_name]
            one_comb_keywords.append(comb_keywords)

        shared_keywords_combs = get_shared_keywords_combs(
            "keywords", one_comb_keywords)

        names = sorted(shared_keywords_combs[0]["name"])
        value = shared_keywords_combs[0]["data"]
        if value != 0:
            sets.append({
                "sets": names,
                "value": value,
                "name": " and ".join(names)
            })
            final_sets.extend(
                sets
            )
            authors_name.append({
                "name": " and ".join(names),
                "keywords": shared_keywords_combs[0]["keywords"]
            })

    result.append(final_sets)
    result.append(authors_name)

    return result


def get_shared_pubs_basd_on_combs(authors_publications, all_combs):
    result = []
    final_sets = []
    authors_name = []
    relevant_confs = []
    for comb in all_combs:
        sets = []
        relevant_confs = []
        for author_name in comb:

            comb_pubications = [
                item for item in authors_publications if item["name"] == author_name]
            relevant_confs.append(comb_pubications)

        shared_pubs_combs = get_shared_publications_combs(
            "publications", relevant_confs)

        names = sorted(shared_pubs_combs[0]["name"])
        value = shared_pubs_combs[0]["data"]
        if value != 0:
            sets.append({
                "sets": names,
                "value": value,
                "name": " and ".join(names)
            })
            final_sets.extend(
                sets
            )
            authors_name.append({
                "name": " and ".join(names),
                "pubs_titles": shared_pubs_combs[0]["pubs_titles"]
            })

    result.append(final_sets)
    result.append(authors_name)

    return result


def get_shared_publications_combs(shared_based, authors_pubs):
    final = []
    authors_name = []
    authors_pubs_list = []
    for author in authors_pubs:
        for obj in author:
            authors_name.append((obj["name"]))
            authors_pubs_list.append(obj[shared_based])
    common_publications = compConfUtils.common_elements_in_set(
        authors_pubs_list)

    author_pubss = []
    for pub in common_publications:
        publication_node = Publication.nodes.get(paper_id=pub)
        publication_title = publication_node.title
        author_pubss.append(publication_title)

    final.append({
        "name": authors_name,
        "data": len(common_publications),
        "pubs_titles": author_pubss
    })
    return final


def get_shared_keywords_combs(shared_based, authors_pubs):
    final = []
    authors_name = []
    authors_keywords_list = []
    for author in authors_pubs:
        for obj in author:
            authors_name.append((obj["name"]))
            authors_keywords_list.append(obj[shared_based])

    common_publications = compConfUtils.common_elements_in_set(
        authors_keywords_list)

    final.append({
        "name": authors_name,
        "data": len(common_publications),
        "keywords": common_publications
    })
    return final
