import json
from accounts.models import User
from interests.models import (
    Keyword,
    ShortTermInterest,
    LongTermInterest,
    Category,
    BlacklistedKeyword,
    KeywordPaper,
)
import numpy as np
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory
from interests.update_interests import normalize

from interests.Keyword_Extractor.Algorithms.embedding_based.sifrank.dbpedia.dbpedia_utils import (
    DBpediaSpotlight,
)

#Osama
def regenerate_long_term_model(user_id):
    """
    Regenerates the long term interest model after a user orders to regenerate by a user command.
    It should be triggered when the user commands only and not for the periodic update of the long term model
    It updated the weights of the non manual interests to match the weight in theshort-term model
    and deletes the interests that belong to no paper except the manual ones
    
    Parameters
    ----------
    user_id : int
        The id of the user object in the database

    Prerequest
    ----------
    The short term interest model should have the correct interests and weights (updated)
    """
    
    user = User.objects.get(id=user_id)
    long_term_interests= LongTermInterest.objects.filter(user_id= user_id, source__in=[LongTermInterest.SCHOLAR, LongTermInterest.TWITTER])
    short_term_interests = ShortTermInterest.objects.filter(user_id = user_id)
    blacklisted_keywords = list(
    BlacklistedKeyword.objects.filter(user_id=user_id).values_list(
        "keyword__name", flat=True
    ))
    long_term_interests.filter(user_id=user_id).exclude(papers__in=user.papers.all()).delete()
    for interest in short_term_interests:
        if interest.keyword.name in blacklisted_keywords:
            continue
        if LongTermInterest.objects.filter(user_id=user_id, keyword=interest.keyword, source=LongTermInterest.MANUAL).exists():
            #If the interest was found to be manual in the long term interest (updated manually), don't update it and don't create a new one.
            continue
        long_term_interest,_= LongTermInterest.objects.update_or_create(
            user_id= user_id,
            keyword = interest.keyword,
            defaults= {
            "weight": interest.weight,
            "updated_on": interest.updated_on,
            "source": interest.source
            }
        )
        long_term_interest.papers.set(interest.papers.all())
    return


def fetch_papers_keywords(papers):
    # Modified the function of lames. 
    """
    Fetches and stores the keywords of papers, a relationship to store the weight of the keyword in the paper,
    and the categories of the keywords
    
    Parameters
    ----------
    papers : paper objects
        The papers that the keywords should get extracted from
    """
    dbpedia = DBpediaSpotlight()
    paper_candidates = papers.filter(used_in_calc= False)
    for paper in paper_candidates:
        text = (paper.title if paper.title else "") + " " + (paper.abstract if paper.abstract else "")
        try:
            keywords = getKeyword(text, model="SifRank", num=15)
        except:
            continue
        if not len(keywords.keys()):
            # print("No keywords found")
            paper.used_in_calc=True
            paper.save()
            continue
        (
            wiki_keyword_redirect_mapping,
            keyword_weight_mapping,
        ) = dbpedia.annotate(keywords)     
        if not len(keyword_weight_mapping.keys()):
            paper.used_in_calc=True
            paper.save()
            continue
        keywords = normalize(
            keyword_weight_mapping
        )  # normalize the weights to range of 5 to 1

        # find the category for each keyword seperatly and store the keyword in database as a row
        for keyword, weight in keywords.items():
            original_keyword_name = wiki_keyword_redirect_mapping.get(
                keyword, keyword
            )
            keyword = keyword.lower()
            keyword_instance, created = Keyword.objects.get_or_create(
                name=keyword.lower()
            )
            if created:
                
                categories = wikicategory(
                    keyword
                )  
                for category in categories:
                    category_instance, _ = Category.objects.get_or_create(
                        name=category
                    )
                    keyword_instance.categories.add(category_instance)
                keyword_instance.save()
            try:
                original_keywords = json.loads(
                    keyword_instance.original_keywords
                )

                original_keywords_with_weights = json.loads(
                    keyword_instance.original_keywords_with_weights
                )
            except:
                original_keywords = []
                original_keywords_with_weights = []
            original_keywords.append(original_keyword_name.lower())
            keyword_instance.original_keywords = json.dumps(
                list(set(original_keywords))
            )

            # for original keyword with weights column
            original_keywords_with_weights.append(
                {original_keyword_name.lower(): weight}
            )
            keyword_instance.original_keywords_with_weights = json.dumps(
                original_keywords_with_weights
            )

            keyword_instance.save()
            # store a relationship between the paper and the keyword
            KeywordPaper.objects.create(
                paper = paper,
                keyword = keyword_instance,
                weight = weight
            )
            paper.used_in_calc=True
            paper.save()
    return

#Osama
# def generate_user_short_term_interests(user_id):
#     """
#     Genrates the short term interest model with the weight of the
#     interest equals to the NEWEST WEIGHT of the keyword (only papers are considered and not tweets).
    
#     Parameters
#     ----------
#     user_id : int
#         The id of the user object in the database
#     """
#     user = User.objects.get(id=user_id)
#     paper_candidates = user.papers.all().order_by('year')
#     for paper in paper_candidates:
#         # get the keywords and weights for every paper
#         paper_keywords_with_weight = paper.paper_keywords.all()
#         for keyword_with_weight in paper_keywords_with_weight:
#             #create/ update an interest for every keyword
#             interest, created = ShortTermInterest.objects.get_or_create(
#                 user_id=user_id,
#                 keyword=keyword_with_weight.keyword,
#                 model_month=1,
#                 model_year=paper.year,
#                 defaults={"source": ShortTermInterest.SCHOLAR, "weight": keyword_with_weight.weight}, 
#                 )
#             if not created:
#                 #if the interest was there already (from an older paper), change its weight
#                 interest.weight = keyword_with_weight.weight
#                 interest.save()
#             #link the interest to the paper
#             interest.papers.add(paper) 
#     return

#Osama
def generate_user_short_term_interests(user_id):
    """
    Genrates the short term interest model with the weight of the
    interest equals to the its average weight in all papers (only papers are considered and not tweets).
    
    Parameters
    ----------
    user_id : int
        The id of the user object in the database
    """
    user = User.objects.get(id=user_id)
    # Delete all interests that are not linked to any of the user's papers
    user.short_term_interests.filter(user_id=user_id).exclude(papers__in=user.papers.all()).delete()
    paper_candidates = user.papers.all().order_by('year')
    
    for paper in paper_candidates:
        # get the keywords and weights for every paper
        paper_keywords_with_weight = paper.paper_keywords.all()
        for keyword_with_weight in paper_keywords_with_weight:
            #create/ update an interest for every keyword
            average_weight = keyword_with_weight.weight/paper_candidates.count()
            interest, created = ShortTermInterest.objects.update_or_create(
                user_id=user_id,
                keyword=keyword_with_weight.keyword,
                defaults={"source": ShortTermInterest.SCHOLAR, "model_year": paper.year, "model_month": 1}, 
                )
            if created:
                interest.weight = average_weight
            else:
                #if the interest was there already (from an older paper), add the weight to what was existing
                interest.weight += average_weight
            interest.save()
            #link the interest to the paper
            interest.papers.add(paper) 
    #normalize weights to put on scale from 1 to 5
    interests = user.short_term_interests.all().order_by("-weight")
    dataSet = list(interests.values_list('weight', flat=True))
    std_dev = np.std(dataSet)
    mean_value = np.mean(dataSet)
    # exclude outliers accourding to empirical rule
    highestWeightLimit = mean_value + std_dev * 3
    lowestWeightLimit = mean_value - std_dev * 3
    if(std_dev != 0):
        #If standard deviation is 0, it means all the interests have the same weight and no need for normalization and only scaling up might be needed
        #Normalizing with this method while havein the std_dev = 0 leads to a division by zero error
        for interest in interests:
            if(interest.weight > highestWeightLimit) :
                interest.weight = 5
            elif(interest.weight < lowestWeightLimit):
                interest.weight = 1
            else:
                interest.weight = round(((interest.weight - lowestWeightLimit) / (highestWeightLimit - lowestWeightLimit)) * 4 + 1, 1)
            # interest.weight = round(interest.weight * 2) / 2 # can be uncommented to make the step size 0.5 instead of 0.1
            interest.save()
    # now we need to scale up so that the highest is always 5
    interests = user.short_term_interests.all().order_by("-weight")
    if interests.exists() and 0 < interests.first().weight < 5:
        scale = 5 / interests.first().weight
        for interest in interests:
            interest.weight *= scale
            interest.weight = round(interest.weight,1)
            # interest.weight = round(interest.weight * 2) / 2 # can be uncommented to make the step size 0.5 instead of 0.1
            interest.save()
    return
