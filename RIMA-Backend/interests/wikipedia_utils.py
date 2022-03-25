

import wikipediaapi
import requests
import json
from pattern.text.en import singularize


def wikifilter(keyword):
   
   # this part create candidate dictionary of keyword and weight from the extracted keywords 
   # that has articles in wikipedia
   
    wiki_wiki = wikipediaapi.Wikipedia('en')
    candidate = {}
    for key in keyword.keys():
        page_py = wiki_wiki.page(key)
        if page_py.exists() == True:
            candidate[key] = keyword[key]
        elif page_py.exists() == False:
            #convert keywords into single form and check for existing article in wikipedia--> patterns become pattern
            singles = singularize(key)
            page_py = wiki_wiki.page(singles)
            if page_py.exists() == True:
                candidate[singles] = keyword[key]
        print(candidate) #by lamees
        # candidates {'learning analytics': 9, 'open assessment': 1, 'learning environment': 5, 'peer assessment': 9}
    #--------------------------------------------------------------------------
    final = {}
    redirect = {}
    relation = {}
    # the below code checks if there is multiple pages for the same keyword in wikipedia it removes all repeated keywords 
    # for example LA and learnig analytics redirects to page Learning analytics then only one of them will remain in relation and final variables
    for ca in candidate:
        query = requests.get(
            r'https://en.wikipedia.org/w/api.php?action=query&titles={}&&redirects&format=json'
            .format(ca))
        #print("wiki_filter function -> query var", query.text)# lamees
        data = json.loads(query.text) # data {'batchcomplete': '', 'query': {'normalized': [{'from': 'learning analytics', 'to': 'Learning analytics'}], 'pages': {'28486111': {'pageid': 28486111, 'ns': 0, 'title': 'Learning analytics'}}}}
        PAGES = data["query"]["pages"] # PAGES {'28486111': {'pageid': 28486111, 'ns': 0, 'title': 'Learning analytics'}}
        for v in PAGES.values():
            redirect[ca] = v["title"]
            relation[v["title"]] = ca
            final[v["title"]] = 0

        #redirect = {'learning analytics': 'Learning analytics', 'open assessment': 'Open assessment', 'learning environment': 'Learning environment', 'peer assessment': 'Peer assessment'}

        #relation = {'Learning analytics': 'learning analytics', 'Open assessment': 'open assessment', 'Learning environment': 'learning environment', 'Peer assessment': 'peer assessment'}

        #final = {'Learning analytics': 0, 'Open assessment': 0, 'Learning environment': 0, 'Peer assessment': 0}

    for ca in redirect.keys():
        final[redirect[ca]] = candidate[ca]
        # final {'Learning analytics': 9, 'Open assessment': 1, 'Learning environment': 5, 'Peer assessment': 9}

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
