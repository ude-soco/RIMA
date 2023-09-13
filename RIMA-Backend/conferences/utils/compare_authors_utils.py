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
    """
    The function `get_authors_publications_count_all_confs` takes a list of author IDs, retrieves their publications, counts the number of publications for each conference, and returns the data in a specific format.
    
    :param author_list: The parameter `author_list` is a list of author IDs
    :return: the final data, which is a list of dictionaries. Each dictionary contains the name of an author and their corresponding publication counts for each conference.
    """
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
    """
    The function `get_series_categories` takes in a list of authors' data and returns a dictionary containing the categories and series data for each author.
    
    :param authors_data: The parameter `authors_data` is a list of dictionaries. Each dictionary represents an author and contains two keys: "name" and "data"
    :return: a list containing a dictionary. The dictionary has two keys: "categories" and "series". The value of "categories" is a list of strings representing the names of the categories. The value of "series" is a list of dictionaries, where each dictionary represents a series. Each series dictionary has two keys: "name" and "data". The value of "name"
    """
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
    """
    The function `get_authors_publications_count_conf_based` retrieves the publication counts for a list of authors based on a list of conference abbreviations.
    
    :param author_list: A list of author IDs or names
    :param conf_list: A list of conference names or abbreviations
    :return: the final data, which is a list of dictionaries containing the name of the author and their publication counts for each conference in the given conference list.
    """
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
    """
    The function `get_publication_counts_each_conf` takes a list of author publications and returns a list of dictionaries, where each dictionary contains the name of a conference and the count of publications in that conference.
    
    :param author_pubs: A list of publication objects for a specific author. Each publication object has a "published_in_Confs" attribute which is a list of conference objects that the publication was published in. Each conference object has a "conference_name_abbr" attribute which is the abbreviated name of the conference
    :return: a list of dictionaries, where each dictionary represents a conference and its corresponding publication count.
    """
    conf_counts = defaultdict(int)

    for pub in author_pubs:
        conf_counts[pub.published_in_Confs[0].conference_name_abbr] += 1

    publications_confs = [{"name": conf, "count": count}
                          for conf, count in conf_counts.items()]

    return publications_confs


def get_authors_citations(confs, author_list):
    """
    The function `get_authors_citations` retrieves the citations of authors for a given list of conferences.
    
    :param confs: The "confs" parameter is a list of conference names or abbreviations. It is used to filter the publications of the authors based on the conferences they were published in. Only publications that were published in one of the conferences specified in the "confs" list will be considered
    :param author_list: A list of author IDs
    :return: a list containing a dictionary. The dictionary has two keys: "categories" and "citations". "categories" is a list of author names, and "citations" is a list of dictionaries containing the author name and their corresponding citation data.
    """
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
    """
    The function `get_coauthor_evolutions` retrieves the co-author count for a list of authors and merges the data.
    
    :param author_list: The `author_list` parameter is a list of author IDs. Each author ID represents a unique identifier for an author in the Semantic Scholar database
    :return: the merged data of co-author evolutions for the given list of authors.
    """
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
    """
    The function `get_authors_pubs_evolutions` retrieves the publication evolution data for a list of authors in selected conferences.
    
    :param selected_confs: The parameter "selected_confs" is a list of conference names or abbreviations. It represents the conferences for which we want to retrieve the publications
    :param author_list: A list of author IDs. These IDs are used to retrieve information about the authors from the database
    :return: the merged data of authors' publication evolutions.
    """
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
    """
    The function `get_publications_count` takes an author node and a list of author publications, extracts the publication counts by year, and returns the data in a specific format.
    
    :param author_node: The `author_node` parameter is an object representing an author. It likely contains information about the author such as their name, ID, and other relevant details
    :param author_pubs: A list of publication objects for a specific author
    :return: a dictionary named "final_data" which contains the following keys:
    - "publicationsCounts": a list containing a single dictionary with keys "name" and "data". "name" is the name of the author and "data" is a list of publication counts.
    - "categories": a list of categories (presumably years) extracted from the publications.
    - "conferences
    """
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
    """
    The function `get_coauthor_count` takes an author node and their publications as input, and returns data about the co-author counts for each year, the author's name, the publication categories, and the conferences they have published in.
    
    :param author_node: The `author_node` parameter is an object representing an author. It likely contains information such as the author's name, ID, and other relevant details
    :param author_pubs: A list of publication objects associated with the author_node. Each publication object has the following attributes:
    :return: a dictionary named "final_data" which contains the following keys:
    - "coauthors": a list containing a single dictionary with keys "name" and "data". The value of "name" is the author's name, and the value of "data" is a list of co-author counts.
    - "categories": a list of years.
    - "conferences": a set
    """
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
    """
    The function `merge_authors_data` takes in a list of author data, merges the categories from all authors, and creates a new data structure with the merged categories and corresponding author data.
    
    :param data: The parameter `data` is a list of dictionaries. Each dictionary represents an author and contains the following keys:
    :return: a list containing a dictionary. The dictionary has two keys: "data" and "categories". The value of the "data" key is a list of dictionaries, each representing an author's data. Each author's data dictionary has two keys: "series" and "conferences". The value of the "series" key is a dictionary with two keys: "name" and
    """
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
    """
    The function takes in a list of author data and merges it into a single data structure for productivity analysis.
    
    :param data: The parameter "data" is a list of dictionaries. Each dictionary represents an author and contains the following keys:
    :return: a list containing a dictionary. The dictionary has two keys: "data" and "categories". The value of the "data" key is a list of dictionaries, each containing the "series" and "conferences" keys. The "series" key has a nested dictionary with the keys "name" and "data". The "name" key contains the author's name,
    """
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
    """
    The function `get_shared_interests_between_authors` retrieves the shared interests (keywords) between authors based on their publications in specified conferences.
    
    :param confs: The parameter "confs" is a list of conference names or abbreviations. It is used to filter the publications of the authors based on the conferences they were published in. Only publications that were published in one of the conferences specified in the "confs" list will be considered
    :param author_list: The `author_list` parameter is a list of author IDs. These IDs are used to retrieve author nodes from a database
    :return: a list of dictionaries. Each dictionary contains the name of an author and a list of keywords that represent the shared interests between the author and the specified conferences.
    """
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
    """
    The function `get_shared_publication_between_authors` retrieves the shared publications between a list of authors based on specified conferences.
    
    :param confs: The parameter "confs" is a list of conference names or the string "All Conferences". It represents the conferences for which we want to find shared publications between authors
    :param author_list: The `author_list` parameter is a list of author IDs
    :return: a list of dictionaries. Each dictionary contains the name of an author and a list of their shared publications with other authors in the given conference(s).
    """
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
    """
    The function `get_intersection` takes a list of lists as input and returns a list of elements that are common to all the lists.
    
    :param data: The parameter `data` is a list of lists. Each inner list represents a set of elements. The function `get_intersection` finds the intersection of all the sets in the `data` list and returns a list of the common elements
    :return: a list of the common elements that are present in all the lists within the input data.
    """
    intersection = set((data[0]))
    for lst in data[1:]:
        intersection.intersection_update(set(lst))

    intersection_list = list(intersection)

    return intersection_list


def get_shared_keyword_basd_on_combs(authors_keywords, all_combs):
    """
    The function `get_shared_keyword_basd_on_combs` takes in a list of authors' keywords and all possible combinations of authors, and returns a list of shared keywords and the corresponding authors' names.
    
    :param authors_keywords: A list of dictionaries where each dictionary represents an author and their associated keywords. Each dictionary has two keys: "name" (representing the author's name) and "keywords" (representing a list of keywords associated with that author)
    :param all_combs: A list of lists, where each inner list represents a combination of author names
    :return: The function `get_shared_keyword_basd_on_combs` returns a list containing two elements. The first element is a list of dictionaries representing the shared keyword combinations. Each dictionary in the list has the keys "sets", "value", and "name". The second element is a list of dictionaries representing the authors' names and their corresponding keywords. Each dictionary in the list has the keys "name"
    """
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
    """
    The function `get_shared_pubs_basd_on_combs` takes in a list of authors' publications and a list of combinations of author names, and returns a list of shared publications between each combination of authors along with the names of the authors involved.
    
    :param authors_publications: The parameter "authors_publications" is a list of dictionaries. Each dictionary represents a publication and contains information about the publication, such as the author's name, publication title, and conference name
    :param all_combs: The parameter "all_combs" is a list of lists. Each inner list represents a combination of author names. For example, if there are three authors named "A", "B", and "C", the "all_combs" parameter could be [[A, B], [A, C
    :return: a list containing two elements. The first element is a list of dictionaries representing shared publications between combinations of authors. Each dictionary in the list contains the names of the authors involved in the combination, the number of shared publications, and the combined name of the authors. The second element is a list of dictionaries representing the names of the combinations of authors and the titles of their shared publications.
    """
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
    """
    The function `get_shared_publications_combs` takes in a list of authors and their publications, and returns a list of dictionaries containing the author names, the number of shared publications, and the titles of those shared publications.
    
    :param shared_based: The parameter "shared_based" is a string that specifies the attribute of the "authors_pubs" objects that will be used to determine shared publications
    :param authors_pubs: The parameter "authors_pubs" is a list of lists. Each inner list represents a single author and contains dictionaries representing their publications. Each dictionary has a key "name" which represents the author's name, and a key "shared_based" which represents the shared attribute based on which the common publications
    :return: a list of dictionaries. Each dictionary contains the name of the authors, the number of common publications they have, and the titles of those common publications.
    """
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
    """
    The function `get_shared_keywords_combs` takes in a shared keyword and a list of authors' publications, and returns a list of dictionaries containing the authors' names, the number of common publications, and the common keywords.
    
    :param shared_based: The parameter "shared_based" is a string that represents the key in the "authors_pubs" dictionary that contains the keywords to be compared
    :param authors_pubs: The parameter "authors_pubs" is a list of dictionaries. Each dictionary represents an author and their publications. The "authors_pubs" list contains multiple dictionaries, each representing a different author. Each author dictionary contains a "name" key and a "shared_based" key. The "name"
    :return: a list containing a dictionary. The dictionary has three key-value pairs: "name" which is a list of author names, "data" which is the number of common publications, and "keywords" which is a list of the common keywords.
    """
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
