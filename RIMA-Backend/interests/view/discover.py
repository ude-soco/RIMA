from ..wikipedia_utils import wikicategory
import wikipediaapi
import random


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
    for i in range(0,3):
        page=random.choice(pages)
        currPages.append(page)
        pages.pop(pages.index(page))

    return currPages

def getPageData(interest):
    print(interest, "interests")
    interest=interest.capitalize()
    try:
        wiki = wikipediaapi.Wikipedia('en')
        page=wiki.page(interest)
        summary=page.summary
        url=page.fullurl
        title=page.title
        failure=False
    except:
        summary="No wikipedia page found with this interest"
        url="en.wikipedia.org"
        title=interest
        failure=True
    pageData={
        "title":title,
        "summary":summary,
        "url":url,
        "interest":interest,
        "failure":failure
    }
    return pageData

def getWikiInfo(interestsData):
    #print(interest, "get wiki info")
    interests=interestsData["interest"]
    #data={}
    #for i in interests:
    #    pageData=getPageData(i)
    #  data[i]=pageData
    pageData=getPageData(interests)


    #answer={"test":"test", "page":page, "dataInterst":dataInterest, "data":data}

    return pageData


def getDataDiscoverInterest(interest):
    categories=wikicategory(interest)
    data=[]
    for c in categories:
        listPageData=[]
        allPages=getPagesInCategory(c)
        try:
            pages=getRandPages(allPages,3)
        except:
            pages=[]

        for page in pages:

            pageData=getPageData(page)
            if pageData == "error":
                continue
            else:
                listPageData.append(pageData)
        dataCat = {
            "topic":c,
            "color": "#397367",
            "allPages":allPages,
            "relatedTopics":listPageData
        }
        data.append(dataCat)
    return data

def getDataDiscover(interests):
    data={}
    for i in interests:
        data[i]=getDataDiscoverInterest(i.capitalize())
    return data

def changeDataDiscover(data):

    interests=data["interests"]
    oldData=data["data"]
    newData={}
    oldInterests= oldData.keys()
    for i in interests:
        if i not in oldData:

            newData[i]=getDataDiscoverInterest(i.capitalize())


        else:
            newData[i]=oldData[i]
    #print("old ",oldInterests)
    #for i in oldInterests:
    #   if i not in interests:
    #       del oldData[i]
    return newData











