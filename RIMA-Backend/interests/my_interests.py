from .wikipedia_utils import wikicategory
import wikipediaapi
import requests
import json
import random
import nltk

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
    wiki = wikipediaapi.Wikipedia('en')
    page=wiki.page(interest)
    summary=page.summary
    url=page.fullurl
    title=page.title
    pageData={
        "title":title,
        "summary":summary,
        "url":url,
        "interest":interest
    }
    return pageData

def getDataDiscoverInterest(interest):
    categories=wikicategory(interest)
    data=[]
    for c in categories:
        listPageData=[]
        allPages=getPagesInCategory(c)
        pages=getRandPages(allPages,3)
        for page in pages:
            pageData=getPageData(page)
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



def getDataDiscoverInterest(interest):
    categories=wikicategory(interest)
    data=[]
    for c in categories:
        listPageData=[]
        allPages=getPagesInCategory(c)
        pages=getRandPages(allPages,3)
        for page in pages:
            pageData=getPageData(page)
            listPageData.append(pageData)
        dataCat = {
            "topic":c,
            "color": "#397367",
            "allPages":allPages,
            "relatedTopics":listPageData
        }
        data.append(dataCat)
    return data



#start functions for explore
def getLinksTextInPage(interest):
    wiki=wikipediaapi.Wikipedia('en')
    page=wiki.page(interest)

    links=page.links
    text=page.text


    return links, text

#taken from https://github.com/ude-soco/ELAS/blob/dev-j/backend/course_studyprogram_recommend/KG_building/links_count.py
def fail(sub_string):
    ans = [0] * (len(sub_string) + 1)

    for i in range(1, len(sub_string)):
        j = ans[i]

        while j > 0 and sub_string[i] != sub_string[j]:
            j = ans[j]
        if sub_string[i] == sub_string[j]:
            ans[i + 1] = j + 1
        else:
            ans[i + 1] = 0
    return ans

#taken from https://github.com/ude-soco/ELAS/blob/dev-j/backend/course_studyprogram_recommend/KG_building/links_count.py
def count_substring(string, sub_string):
    next = fail(sub_string)
    cnt = 0
    start = 0
    length = len(string) - len(sub_string)
    i = 0
    while i <= length:
        while start < len(sub_string) and string[i + start] == sub_string[start]:
            start = start + 1
        if start == len(sub_string):
            cnt = cnt + 1
        i = i + start - next[start]
        if next[start] == 0:
            i = i + 1
        start = next[start]
    return cnt

def getCountLinks(links, text):
    text=nltk.sent_tokenize(text)
    links_count=[]
    for link in links.keys():
        count = 0
        for sentence in text:
            count = count + count_substring(sentence, link)
        if count>0:
            links_count.append((count, link))
    sorted_links_count = sorted(links_count, reverse=True)
    return sorted_links_count

def getDataNewInterestExplore(interest):
    print(interest, "test test")
    links, text = getLinksTextInPage(interest.capitalize())
    top3Interests=getCountLinks(links, text)

    top3Interests=top3Interests[:3]

    relatedTopics=[]
    for i in top3Interests:
        currLinks, currText=getLinksTextInPage(i[1])
        currTop3Interests=getCountLinks(currLinks, currText)

        currTop3Interests=currTop3Interests[:3]

        currRelatedTopics=[]

        for j in currTop3Interests:
            currPage2=getPageData(j[1])
            currRelatedTopics.append(currPage2)


        currPage=getPageData(i[1])
        currPage["relatedTopics"]=currRelatedTopics
        relatedTopics.append(currPage)

    data=getPageData(interest)
    data["relatedTopics"]=relatedTopics

    return data

def getDataExplore(interests):
    data=[]
    for i in interests:
        currData=getDataNewInterestExplore(i)
        data.append(currData)
    return data






