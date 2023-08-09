import json
from ..semantic_scholar import SemanticScholarAPI
from collections import Counter
import random
import wikipediaapi



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

        #print(interest, page)
    return pageData

def getRefCitAuthorsPapers(authorId, method):
    results={"listAllAuthors":[]}
    dictAuthorsNames={}

    api=SemanticScholarAPI()
    if method in ["citations", "references"]:
        data=api.citations_references(id=authorId, method=method)
    else:
        print("expected method to be either citations or references")


    for paper in data:
        for m in paper[method]:
            if len(m["authors"]) != 0:
                if authorId not in m["authors"]:
                    for author in m["authors"]:
                        if author["authorId"]!=None:
                            if author["authorId"]!=authorId:
                                listAuthors=results["listAllAuthors"]
                                listAuthors.append(author["authorId"])
                                results["listAllAuthors"]=listAuthors
                                if author["authorId"] in results:
                                    papers=[]
                                    papers=results[author["authorId"]]
                                    papers.append(m["paperId"])

                                    results[author["authorId"]]=papers
                                else:
                                    results[author["authorId"]]=[m["paperId"]]
                                    dictAuthorsNames[author["authorId"]]=[author["name"]]





    results["authorsNames"]=dictAuthorsNames

    return results

def getMostCitedReferenced(authorId, method, n, filter):  #n = Number of Authors, filter = List of filterd Authors
    
    allCitsRefs=getRefCitAuthorsPapers(authorId=authorId, method=method)
    listAuthors=allCitsRefs["listAllAuthors"]
    dictAuthorsName=allCitsRefs["authorsNames"]
     
    for i in filter:                                      #Filter known Authors, the User selected
        while i in listAuthors:
            listAuthors.remove(i)

    topN=list(Counter(listAuthors).most_common(n))
    #print(topN)


    api=SemanticScholarAPI()

    allAuthors=[]
    dictPapers={}

    for i in topN:
        author = i[0]
        papersAuthor=allCitsRefs[author]
        allPapers=[]
        for j in set(papersAuthor):
            if j in dictPapers:
                allPapers.append(dictPapers[j])
            else:
                if j != None:
                    paper=api.paper(j)
                    authors=""
                    for a in paper["authors"]:
                        authors=a["name"]+","+authors
                    if paper["abstract"] == None:
                        abstract="No abstract available"
                    else:
                        abstract=paper["abstract"]
                    paperData={
                        "id":1,
                        "paper_id":j,
                        "authors":authors,
                        "url":paper["url"],
                        "title":paper["title"],
                        "abstract":abstract,
                        #"abstract":"abstract",
                        "year":paper["year"],
                        "updated_on":"2022",
                        "created_on":"2022"
                    }
                    allPapers.append(paperData)
                    dictPapers[j]=paperData
        interests=getInterests(j)
        authorData={
            "name":dictAuthorsName[author][0],
            "paper":allPapers,
            "interests":interests,
            "score":len(allPapers),
            "id": author,                                   #added the autor Id for better filter
        }

        allAuthors.append(authorData)

    return allAuthors

def getInterests(authorId):
    interests=["user modeling", "educational technology","lifelong learning", "artificial intelligence",
               "learning technologies", "gamification", "higher education", "open educational resources", "anti-phishing",
               "serious games", "cybersecurity", "xAPI"]


    return interests

def getConnectData(id):

    authorId=id["data"]
    noa = int(id["noa"])      #Number of Authors                  
    fetchPapers = bool(id["papers"]) #fetch papers not directly
    #print(fetchPapers)
    selectedNames = id["selectedNames"] #Authors which get filterd
    #print(selectedNames)
    #print("------------------------------Noa: " + str(noa) + "----------------------------------------------")
    if(fetchPapers):
        print("get most authors who cited me the most")
        authorsCitedMe= getMostCitedReferenced(authorId=authorId, method="citations", n = noa, filter = selectedNames) #*1
        print("get authors Who I cited the most")
        authorsReferences=getMostCitedReferenced(authorId=authorId, method="references", n = noa, filter = selectedNames)
        x = (authorsFilter(authorId=authorId, method="citations", filter = selectedNames))
        #print("first")
        #print(x)
        x.update(authorsFilter(authorId=authorId, method="references", filter = selectedNames))
        #print("second")
        #print(x)
        
    else:
        authorsReferences = authorsCitedMe = [{"name": "Author 1", "paper": [], "intrests": [],"score": "Number of Citations", "id": "1" },     #Author dummies with Explanations
                                              {"name": "Author 2", "paper": [], "intrests": [],"score": "Number of Citations", "id": "1" },
                                              {"name": "Author 3", "paper": [], "intrests": [],"score": "Number of Citations", "id": "1" }]
        x = (authorsFilter(authorId=authorId, method="citations", filter = selectedNames))
        x.update(authorsFilter(authorId=authorId, method="references", filter = selectedNames))
        
        
    #Read sample Data in and out for faster loading times, authorsReferences and authorsCitedMe has to be outcommented (*1)
    """ 
    with open("authorsReferences2.json", "w") as myfile:
            json.dump(authorsReferences, myfile)
    with open("authorsCitedMe2.json", "w") as myfile:
            json.dump(authorsCitedMe, myfile)
    
    with open("authorsReferences2.json", "r") as myfile:
           authorsReferences = json.load(myfile)
    with open("authorsCitedMe2.json", "r") as myfile:
           authorsCitedMe = json.load(myfile)
    """
    #print(x)
    data={"citations":authorsCitedMe, "references":authorsReferences, "filter": x, "selectedNames": selectedNames, "noa": noa}
    return data
 
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


#get the Top 10+x Authors the User could know, before the whole Data is fetched
def authorsFilter(authorId, method, filter):
    allCitsRefs = getRefCitAuthorsPapers(authorId=authorId, method=method)
    listAuthors = allCitsRefs["listAllAuthors"]
    dictAuthorsName = allCitsRefs["authorsNames"]
    while authorId in listAuthors:
        listAuthors.remove(str(authorId))    
    topN = [tupel[0] for tupel in (list(Counter(listAuthors).most_common(10+len(filter))))]
    #print(len(topN))
    x = {id: dictAuthorsName.get(id, 'Unknown') for id in topN} #Id is importend to trace the authors back
    print(x)
    return x
