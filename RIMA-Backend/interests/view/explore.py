import wikipediaapi
import time


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

        print(interest, page)
    return pageData




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
    print(interest, "test test")
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
        print("\n\n\n",i, "new interests")
        currData=getDataNewInterestExplore(i)
        time.sleep(1)
        data.append(currData)
        print(data, "data interest")
    return data

