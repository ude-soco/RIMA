import requests
from langdetect import detect


class SemanticScholarAPI:
    def __init__(self):
        self.API_URL = 'http://api.semanticscholar.org/v1'
        self.API_Search_URL = 'https://api.semanticscholar.org/graph/v1/paper/search' # API url for getting papers by keyword #LK

    def paper(self, id, include_unknown_references=False) -> dict:
        '''Paper lookup
        :param id: S2PaperId, DOI or ArXivId.
        :param include_unknown_references : bool, (optional) include non referenced paper.
        :returns: paper data or empty :class:`dict` if not found.
        :rtype: :class:`dict`
        '''

        data = self.__get_data('paper', id, include_unknown_references)

        return data

    def author(self, id) -> dict:
        '''Author lookup
        :param id: S2AuthorId.
        :returns: author data or empty :class:`dict` if not found.
        :rtype: :class:`dict`
        '''

        data = self.__get_data('author', id)

        return data

    def __get_data(self, method, id, include_unknown_references=False) -> dict:
        '''Get data from Semantic Scholar API
        :param method: 'paper' or 'author'.
        :param id: :class:`str`.
        :returns: data or empty :class:`dict` if not found.
        :rtype: :class:`dict`
        '''

        data = {}
        print("Getting {}".format(method))
        method_types = ['paper', 'author']
        if method not in method_types:
            raise ValueError('Invalid method type. Expected one of: {}'.format(
                method_types))

        url = '{}/{}/{}'.format(self.API_URL, method, id)
        if include_unknown_references:
            url += '?include_unknown_references=true'
        print("semantic scholar url:", url)
        print("making request")
        r = requests.get(url)
        print("response received")

        if r.status_code == 200:
            data = r.json()
            if len(data) == 1 and 'error' in data:
                data = {}
        elif r.status_code == 429:
            raise ConnectionRefusedError('HTTP status 429 Too Many Requests.')
        print("data variable in __get_data function", data) # LK
        # here the data is json of user with aliases, authorid, dblpid, influentialCitationCount, name, papers which include  paperid, title, url and year for all papers
        # or json for papers with abstract, 
        return data

    # function to get papers by keyword #LK
    def search_papers_by_keyword(self, query, limit, include_unknown_references=False) -> dict:
        '''
        Get papers from Semantic Scholar API by keywords
        :param query: user interest
        :param limit: max number of retrieved papers
        :returns: data or empty :class:`dict` if not found.
        :rtype: :class:`dict`
        '''
        seprator = ','
        query_fields= seprator.join(query) 

        data = {}
        # url = https://api.semanticscholar.org/graph/v1/paper/search?query='peer assessment'+'user model'&fields=url,title,abstract,authors
        url = '{}?query={}&fields=url,title,abstract,authors&limit={}'.format(self.API_Search_URL, query_fields, limit)
        if include_unknown_references:
            url += '?include_unknown_references=true'
        print("semantic scholar url:", url)
        print("making request")
        r = requests.get(url)
        print("response received")
        
        if r.status_code == 200:
            data = r.json()
            if len(data) == 1 and 'error' in data:
                data = {}
        elif r.status_code == 429:
            raise ConnectionRefusedError('HTTP status 429 Too Many Requests.')
        #print("data variable in __get_data function", data) # LK
        
        # data = json for papers with paper id, url, author, title, abstract....
        return data

    def get_user_papers(self, user, start_year, end_year):
        if not user.author_id:
            print("No Author id present for user {}".format(user.author_id))
            return
        author = self.author(user.author_id)
        papers = author["papers"]
        print("papers variable in get_user_papers function", papers) # LK
        collectedpapers = []
        for paper in papers:
            if not paper["year"]:
                continue
            if start_year <= paper["year"] <= end_year: # Getting only papers for last 5 years
                paper_api_response = self.paper(paper["paperId"])
                abstract = paper_api_response.get("abstract", "")
                paper["authors"] = paper_api_response.get("authors", [])
                try:
                    lan = detect(abstract)
                    if lan == 'en':
                        paper["abstract"] = abstract
                        collectedpapers.append(paper)
                except TypeError:
                    collectedpapers.append(paper)
        print("return result from get_user_papers function", collectedpapers) # by lamees
        return collectedpapers



# a=ob.get_paper(1724546, 2018, 2019)
