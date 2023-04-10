from neomodel import(StructuredNode,StringProperty)


class Publication(StructuredNode):
    abstract=StringProperty()
    citiations=StringProperty()
    paper_doi=StringProperty()
    paper_id=StringProperty()
    paper_venu=StringProperty()
    title=StringProperty()
    urls=StringProperty()
    years=StringProperty()
    
        


    
