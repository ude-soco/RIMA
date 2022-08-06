
from interests.Semantic_Similarity.Word_Embedding.data_models import GetVector,EnsureGloveInit
 


def GetGloveVector(keyword):
    """Return the keyword's vector"""
    # If set the condition expresse to True, it used the cash
    if False:
        data= GetVector(keyword)
        if len(data)==0:
            raise KeyError()
        return data 
    # If True, it used directly the Glovemodel and ignore the cashing 
    if True:
        glove_model=EnsureGloveInit()
        return glove_model[keyword] 
