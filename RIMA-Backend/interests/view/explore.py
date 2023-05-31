import wikipediaapi
import random
import time

def getPagesInCategory(cat):
    wiki= wikipediaapi.Wikipedia("en")
    allPagesCat=wiki.page("Category:"+cat)
    allPagesCat=allPagesCat.categorymembers
    allPages=[]
    subCat=[]
    for i in allPagesCat:
        catOrPage=i.split(":")
        if len(catOrPage) !=1:
            subCat.append(catOrPage)
        else:
            allPages.append(catOrPage[0])
    return(allPages)


def getRandPages(pages, n):
    pages=list(set(pages))
    currPages=[]
    try:
        for i in range(0,n):
            page=random.choice(pages)
            currPages.append(page)
            pages.pop(pages.index(page))
    except:

        print("no categories\n\n\n")

    return currPages

def getPageData(interest):
    wiki = wikipediaapi.Wikipedia('en')
    page=wiki.page(interest)
    try:
        summary=page.summary
        url=page.fullurl
        title=page.title
        pageData={
            "title":title,
            "summary":summary,
            "url":url,
            "interest":interest
        }

    except:
        pageData={
            "title":interest,
            "summary":"",
            "url":"",
            "interest":""
        }

       # print(interest, page)
    return pageData



#start functions for explore.py
def getLinksTextInPage(interest):
    wiki=wikipediaapi.Wikipedia('en')
    page=wiki.page(interest)

    links=page.links
    text=page.text


    return links, text

def getCountLinks(links, text, topN=3):
    linksWithNum=[]
    for link in links.keys():
        count = text.count(link)
        linksWithNum.append((link,count))
    linksWithNum.sort(key=lambda tup:tup[1], reverse=True)
    return linksWithNum[:topN]

def getDataNewInterestExplore(interest):
   # print(interest, "test test")
    links, text = getLinksTextInPage(interest.capitalize())
    top3Interests=getCountLinks(links, text)

    relatedTopics=[]
    for i in top3Interests:
        currLinks, currText=getLinksTextInPage(i[0])
        currTop3Interests=getCountLinks(currLinks, currText)
        currRelatedTopics=[]


        for j in currTop3Interests:
            currPage2=getPageData(j[0])
            currRelatedTopics.append(currPage2)


        currPage=getPageData(i[0])

        currPage["relatedTopics"]=currRelatedTopics
        relatedTopics.append(currPage)

    data=getPageData(interest)
    data["relatedTopics"]=relatedTopics


    return data

def getDataExplore(interests):
    data=[]
    for i in interests:
        #print("\n\n\n",i, "new interests")
        currData=getDataNewInterestExplore(i)
        time.sleep(1)
        data.append(currData)
        #print(data, "data interest")
    return data

