import wikipediaapi

import wikipediaapi
import requests
import json
from pattern.text.en import singularize


def wikifilter(keyword):
    wiki_wiki = wikipediaapi.Wikipedia('en')
    candidate = {}
    for key in keyword.keys():
        page_py = wiki_wiki.page(key)
        if page_py.exists() == True:
            candidate[key] = keyword[key]
        elif page_py.exists() == False:
            singles = singularize(key)
            page_py = wiki_wiki.page(singles)
            if page_py.exists() == True:
                candidate[singles] = keyword[key]
    print('candidate: ',candidate)

    final = {}
    redirect = {}
    relation = {}

    for ca in candidate:
        query = requests.get(
            r'https://en.wikipedia.org/w/api.php?action=query&titles={}&&redirects&format=json'
            .format(ca))
        data = json.loads(query.text)
        PAGES = data["query"]["pages"]
        for v in PAGES.values():
            redirect[ca] = v["title"]
            relation[v["title"]] = ca
            final[v["title"]] = 0

    for ca in redirect.keys():
        final[redirect[ca]] = candidate[ca]
    print('final',final)

    return relation, final


def wikicategory(interest):
    symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '(', ')', ',']
    stoplist = ['of', 'by', 'lists', 'from', 'articles', 'terms']
    wiki = wikipediaapi.Wikipedia('en')
    categorie = []
    noise = []
    l = wiki.page(interest)
    a = wiki.categories(l, clshow='!hidden')

    for k in a.keys():
        cat = k.replace("Category:", "")
        if len(cat.split()) <= 4 and cat != 'Disambiguation pages':
            categorie.append(cat)

    for s in symbols:
        for c in categorie:
            if s in c.lower():
                noise.append(c)

    for c in categorie:
        for s in stoplist:
            if s in c.lower().split():
                noise.append(c)

    noise = list(set(noise))

    for n in noise:
        categorie.remove(n)

    return categorie
