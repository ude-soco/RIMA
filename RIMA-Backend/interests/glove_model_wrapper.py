
from interests.Semantic_Similarity.Word_Embedding.data_models import GetVector
 


def GetGloveVector(keyword):
    if True:
        data= GetVector(keyword)
        if len(data)==0:
            raise KeyError()
        return data 
