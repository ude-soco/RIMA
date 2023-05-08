import json
import tensorflow as tf
import math
from collections import defaultdict
from django.db.models import (Q, Count)
from accounts.models import User
from interests.models import (
    Tweet,
    Paper,
    Keyword,
    ShortTermInterest,
    LongTermInterest,
    Category,
    BlacklistedKeyword,
    Keyword_Paper,
    Author,
    AuthorsInterests,
)
import numpy as np
from interests.Keyword_Extractor.extractor import getKeyword
from interests.wikipedia_utils import wikicategory, wikifilter
from interests.update_interests import update_interest_models, normalize

from interests.Keyword_Extractor.Algorithms.embedding_based.sifrank.dbpedia.dbpedia_utils import (
    DBpediaSpotlight,
)
from interests.Semantic_Similarity.Word_Embedding.Embedding_Methods import (
    calculate_vector_embedding,
)
from interests.Semantic_Similarity.Word_Embedding.IMsim import (
    calculate_similarity,
    calculate_weighted_vectors_similarity,
    calculate_weighted_vectors_similarity_single_word,
)
from interests.Semantic_Similarity.WikiLink_Measure.Wiki import wikisim


def generate_long_term_model(user_id):
    user = User.objects.get(id=user_id)
    print("updating long term model for {}".format(user_id))
    short_term_model = ShortTermInterest.objects.filter(
        user_id=user_id, used_in_calc=False
    )

    # getting short term model data and average the weight value when the keyword is repeated
    # storing the short term data in a list first to keep the duplicated values
    keywords_list = []
    for item in short_term_model:
        keywords_list.append([item.keyword.name, item.weight])

    short_term_data = _convert_short_term_model_to_dict(keywords_list)

    # Here the short term data is stored in a (key, value) pair but the dictionary does not support
    # duplicated keys so when we have repeated keyword only the last value will be saved #LK  (done)
    # short_term_data = {
    #     item.keyword.name: item.weight
    #     for item in short_term_model
    # }
    # print("short_term_data in generate_long_term_model",short_term_data) # LK
    long_term_data = {
        item.keyword.name: item.weight
        for item in LongTermInterest.objects.filter(user_id=user_id)
    }
    # print("long_term_data in generate_long_term_model",long_term_data) # LK
    if not short_term_data:
        return
    new_data = update_interest_models(short_term_data, long_term_data)
    # print("new_data variable in generate_long_term_model", new_data) #LK
    LongTermInterest.objects.filter(user_id=user_id).delete()
    short_term_model.update(used_in_calc=True)

    for keyword, weight in new_data.items():
        # print("keyword and weight of new_data var in generate_long_term_model func",keyword, weight) #lamees
        keyword_instance, created = Keyword.objects.get_or_create(name=keyword.lower())
        if created:
            # print("getting wiki categories")
            categories = wikicategory(keyword)
            for category in categories:
                category_instance, _ = Category.objects.get_or_create(name=category)
                keyword_instance.categories.add(category_instance)
            keyword_instance.save()
        # else:
        #     print("Keyword found in db")
        # print("keyword obtained")

        long_term_model = LongTermInterest.objects.create(
            **{"user_id": user_id, "keyword": keyword_instance, "weight": weight}
        )

        originalinterests = json.loads(keyword_instance.original_keywords)
        # print("original interset variable ",originalinterests)# by lamees
        tweet_list = []
        paper_list = []

        for interest in originalinterests:
            # print("one interset of original interests variable ", interest)  # by lamees
            tweets = [
                tweet
                for tweet in Tweet.objects.filter(
                    user_id=user_id, full_text__icontains=interest.lower()
                )
            ]
            tweet_list += tweets

            papers = user.papers.filter(
                Q(abstract__icontains=interest.lower())
                | Q(title__icontains=interest.lower())
            )

            print(papers)
            paper_list += papers
            # print("paper_list ",paper_list[0]) #by lamees

        # tweet_list = [
        #     tweet
        #     for tweet in Tweet.objects.filter(
        #         user_id=user_id, full_text__icontains=keyword.lower()
        #     )
        # ]
        # paper_list = [
        #     paper
        #     for paper in Paper.objects.filter(
        #         Q(user_id=user_id) & (Q(abstract__icontains=keyword.lower()) | Q(title__icontains=keyword.lower()))
        #     )
        # ]
        if tweet_list:
            long_term_model.tweets.add(*tweet_list)
            long_term_model.source = ShortTermInterest.TWITTER
        if paper_list:
            long_term_model.papers.add(*paper_list)
            long_term_model.source = ShortTermInterest.SCHOLAR
        if tweet_list and paper_list:
            long_term_model.source = (
                f"{ShortTermInterest.SCHOLAR} & {ShortTermInterest.TWITTER}"
            )
        long_term_model.save()


def generate_short_term_model(user_id, source):
    blacklisted_keywords = list(
        BlacklistedKeyword.objects.filter(user_id=user_id).values_list(
            "keyword__name", flat=True
        )
    )

    if source == ShortTermInterest.TWITTER:
        tweet_candidates = Tweet.objects.filter(user_id=user_id, used_in_calc=False)
        month_wise_text = {}

        for tweet in tweet_candidates:
            key = f"{tweet.created_at.month}_{tweet.created_at.year}"
            if key not in month_wise_text:
                month_wise_text[key] = ""
            month_wise_text[key] = f"{month_wise_text[key]} {tweet.full_text}"

        for key, text in month_wise_text.items():
            month, year = key.split("_")
            try:
                keywords = getKeyword(text or "", model="Yake", num=20)
            except:
                # silencing errors like
                # interests/Keyword_Extractor/utils/datarepresentation.py:106: RuntimeWarning: Mean of empty slice
                continue
            print(f"got keywords {keywords}")
            if not len(keywords.keys()):
                print("No keywords found")
                continue
            wiki_keyword_redirect_mapping, keyword_weight_mapping = wikifilter(keywords)
            print(keyword_weight_mapping)
            if not len(keyword_weight_mapping.keys()):
                print("No keywords found in weight mapping")
                continue
            keywords = normalize(keyword_weight_mapping)
            for keyword, weight in keywords.items():
                original_keyword_name = wiki_keyword_redirect_mapping.get(
                    keyword, keyword
                )
                keyword = keyword.lower()
                if keyword in blacklisted_keywords:
                    print("Skipping {} as its blacklisted".format(keyword))
                    continue
                (
                    keyword_instance,
                    created,
                ) = Keyword.objects.get_or_create(  # search for keyword in the keyword model based on the name column and wether it is existed or creatred newly
                    name=keyword.lower()
                )
                if created:  # check if the keyword exist or it is being created
                    print("getting wiki categories")
                    categories = wikicategory(keyword)
                    for category in categories:
                        category_instance, _ = Category.objects.get_or_create(
                            name=category
                        )
                        keyword_instance.categories.add(category_instance)
                    keyword_instance.save()
                try:
                    original_keywords = json.loads(keyword_instance.original_keywords)
                except:
                    original_keywords = []
                original_keywords.append(original_keyword_name.lower())
                keyword_instance.original_keywords = json.dumps(
                    list(set(original_keywords))
                )
                keyword_instance.save()

                s_interest, _ = ShortTermInterest.objects.update_or_create(
                    user_id=user_id,
                    keyword=keyword_instance,
                    model_month=month,
                    model_year=year,
                    defaults={"source": source, "weight": weight},
                )
                for t in tweet_candidates.filter(full_text__icontains=keyword):
                    s_interest.tweets.add(t)
        tweet_candidates.update(used_in_calc=True)

    if source == ShortTermInterest.SCHOLAR:
        generate_user_short_term_interests(user_id)

#Osama
def regenerate_long_term_model(user_id):
    #    
    #   regenerates the long term interest model after a user orders to regenerate
    #   @param user id (The primary key of the user object)
    #   @pre-request: none
    #   Discription: 
    #  The function gets all the NOT MANUALLY ADDED interests in the long-term model, deletes any of them that doesn't have a paper 
    #  (or have all its papers blacklisted for the user), and updates the weights of the rest of the automatic generated interests 
    #  to match the ones in the short term interests model
    #   
    #   @author Osama Elsafty
    #
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
            #If a manual interest was found for the same keyword, don't update it and don't create a new one.
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
    #modified the function from lames. This function is going with the approach that the paper is uniqe and can be stored once
    # The same paper always have the same keywords and weights
    # The paper is linked to a user in a many to many relationship. it doesn't have one author id, but many authors can have the same paper
    # This function is storing no interests. It just fetches the keywords from the papers and stores a relationship between the paper and the keyword
    # The relationship specifies the weight of the keyword in that paper as well
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
            Keyword_Paper.objects.create(
                paper = paper,
                keyword = keyword_instance,
                weight = weight
            )
            paper.used_in_calc=True
            paper.save()
        
#Osama
def generate_authors_interests(user_id):
#    
#   Genrates the interests of an author connected to a certain user
#   @param user id (The primary key of the user object)
#   @pre-request: The papers of the authors have their keywords already fetched (used_in_calc = true)
#   Discription: 
#   - All the authors that are connected to the user and have not have their interests generated yet are fetched. 
#   - The interests of authors are generated where the weight of the interest equals the average weight of its keyword in the autho connected papers
#   - More details about the weight calculations and the normalization process are written in the discription of the function generate_user_short_term_interests
#   - This function is follwoing the exact same approach but only for the authors connected to the user object instead of the user object itself
#   
#   @author Osama Elsafty
#
    user = User.objects.get(id=user_id)
    userConnectedAuthors = Author.objects.filter(
    author_citations__user=user,
    interests_generated = False
)
    for author in userConnectedAuthors:
        # Get all AuthorsPaper linked to the author sorted by year (old to new)
        authors_papers = Paper.objects.filter(
        author=author).order_by('year')
        for paper in authors_papers:
            for paper in authors_papers:
                # get the keywords and weights for every paper
                paper_keywords_with_weight = paper.paper_keywords.all()
                for keyword_with_weight in paper_keywords_with_weight:
                    #create/ update an interest for every keyword
                    average_weight = round(keyword_with_weight.weight/authors_papers.count(),1)
                    author_interest, created = AuthorsInterests.objects.get_or_create(
                    Keyword=keyword_with_weight.keyword,
                    author=author, 
                    defaults={'weight': keyword_with_weight.weight})
                    if created:
                        author_interest.weight = average_weight
                    else:
                        #if the interest was there already (from an older paper), add the weight to what was existing
                        author_interest.weight += average_weight
                    author_interest.save()
                    #link the interest to the paper
                    author_interest.papers.add(paper) 
        # end of papers for loop
        #normalize weights
        AuthorInterests = author.authors_interests.all().order_by("-weight")
        dataSet = list(AuthorInterests.values_list('weight', flat=True))
        std_dev = np.std(dataSet)
        mean_value = np.mean(dataSet)
        highestWeightLimit = mean_value + std_dev * 3
        lowestWeightLimit = mean_value - std_dev * 3
        if(std_dev != 0):
            for AuthorInterest in AuthorInterests:
                if(AuthorInterest.weight > highestWeightLimit) :
                    AuthorInterest.weight = 5
                elif(AuthorInterest.weight < lowestWeightLimit):
                    AuthorInterest.weight = 1
                else:
                    AuthorInterest.weight = round(((AuthorInterest.weight - lowestWeightLimit) / (highestWeightLimit - lowestWeightLimit)) * 4 + 1, 1)
                # AuthorInterest.weight = round(interest.weight * 2) / 2 # can be uncommented to make the step size 0.5 instead of 0.1
                AuthorInterest.save()
            # now we need to scale up so that the highest is always 5
        AuthorInterests = author.authors_interests.all().order_by("-weight")
        if AuthorInterests.exists() and 0 < AuthorInterests.first().weight < 5:
            scale = 5 / AuthorInterests.first().weight
            for AuthorInterest in AuthorInterests:
                AuthorInterest.weight *= scale
                AuthorInterest.weight = round(AuthorInterest.weight,1)
                # AuthorInterest.weight = round(interest.weight * 2) / 2 # can be uncommented to make the step size 0.5 instead of 0.1
                AuthorInterest.save()
        author.interests_generated= True
        author.save() 
    return

#Osama
# def generate_user_short_term_interests_newest_weights(user_id):
# #    
# #   Genrates the short term interest model (only papers are considered and not tweets). The newest weight of the keyword is considered as the weight of the interest
# #   @param user id (The primary key of the user object)
# #   @pre-request: The papers of the user have their keywords already fetched (used_in_calc = true)
# #   Discription: 
# #   - The users are interested in all the keywords that are fetched from all papers in their profile
# #   - We loop through all the papers of the user (old to new), find the keywords of the paper, and create an interest for each keyword (or get it if already exists) 
# #   - The weight of the interest = the newest weight of the keyword
# #   - If another newer paper comes later that has the same keyword, it will override the value of the weight of the interest so that the interest has the newest weight
# #   
# #   @author Osama Elsafty
# #   The function is commented since we are using the average weight instead of the newest weight.
# #   In Case of returning back to the newest weight approach, this is function is compatible with the new database design 

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
#    
#   Genrates the short term interest model (only papers are considered and not tweets). The average weight of the keyword is considered as the weight of the interest
#   @param user id (The primary key of the user object)
#   @pre-request: The papers of the user have their keywords already fetched (used_in_calc = true)
#   Discription: 
#   - We start by cleaning all the interests of the user that are not linked to any of his papers (manually added interests stay, and twitter interests are not considered here)
#   - The users are interested in all the keywords that are fetched from all papers in their profile
#   - We loop through all the papers of the user and find the keywords of the paper, and create an interest for each keyword (or get it if already exists) 
#   - The weight of a created interest = the weight of the keyword in the paper / numper of papers (w/sum)
#   - The weight of an updated interest = (w1 + w2 + ....)/ sum = w1/sum + w2/sum +.... = w1/sum + existing weight
#   - The interest is then linked to the paper and saved and next step is to normalize the weights to be on a scale of 1 to 5
#   - dataSet is a list of all interests weights. The mean value and the standard diveation are calculated
#   - The outliers are calculated according to the empirical rule. The high and low limits are set to exclude the outlirs from the scale
#   - The outliers are getting a value of 1 (for the too low outliers) or 5 (for the too high outliers) without the normalization equation
#   - The other numbers are getting normalized 
#   - In some cases, there are no outliers and all the numbers are arround the mean value. That will cause us not to have any 5 weighted interests
#   - since the weighting is rational and the 5 weighted interests are only the ones that are the user is mostly interested in regardeless of how much they were mentioned,
#      we scale up all the interests by multiplying all the weights by the number that makes the highest weight = 5 (only if we didn't have any 5 wighted ones)
#   
#   @author Osama Elsafty
#  
    user = User.objects.get(id=user_id)
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
    #normalize weights
    interests = user.short_term_interests.all().order_by("-weight")
    dataSet = list(interests.values_list('weight', flat=True))
    std_dev = np.std(dataSet)
    mean_value = np.mean(dataSet)
    highestWeightLimit = mean_value + std_dev * 3
    lowestWeightLimit = mean_value - std_dev * 3
    if(std_dev != 0):
        #if standard deviation is 0, it means all the interests have the same weight and no need for normalization and only scaling up might be needed
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

# LK
def generate_short_term_model_dbpedia(user_id, source):
    dbpedia = DBpediaSpotlight()
    blacklisted_keywords = list(
        BlacklistedKeyword.objects.filter(user_id=user_id).values_list(
            "keyword__name", flat=True
        )
    )

    if source == ShortTermInterest.TWITTER:
        tweet_candidates = Tweet.objects.filter(user_id=user_id, used_in_calc=False)
        month_wise_text = {}

        for tweet in tweet_candidates:
            key = f"{tweet.created_at.month}_{tweet.created_at.year}"
            if key not in month_wise_text:
                month_wise_text[key] = ""
            month_wise_text[key] = f"{month_wise_text[key]} {tweet.full_text}"

        for key, text in month_wise_text.items():
            month, year = key.split("_")
            try:
                keywords = getKeyword(text or "", model="Yake", num=20)
            except:
                # silencing errors like
                # interests/Keyword_Extractor/utils/datarepresentation.py:106: RuntimeWarning: Mean of empty slice
                continue
            # print(f"got keywords {keywords}")
            if not len(keywords.keys()):
                # print("No keywords found")
                continue
            wiki_keyword_redirect_mapping, keyword_weight_mapping = dbpedia.annotate(
                keywords
            )
            # print(keyword_weight_mapping)
            if not len(keyword_weight_mapping.keys()):
                # print("No keywords found in weight mapping")
                continue
            # normalize the weights to range of 5 to 1
            keywords = normalize(keyword_weight_mapping)

            # find the category for each keyword separately and store the keyword in database as a row
            for keyword, weight in keywords.items():
                original_keyword_name = wiki_keyword_redirect_mapping.get(
                    keyword, keyword
                )
                # print("\noriginal_keyword_name ", original_keyword_name)  # by lamees
                keyword = keyword.lower()
                if keyword in blacklisted_keywords:
                    print("Skipping {} as its blacklisted".format(keyword))
                    continue
                (
                    keyword_instance,
                    created,
                ) = Keyword.objects.get_or_create(  # search for keyword in the keyword model based on the name column and wether it is existed or creatred newly
                    name=keyword.lower()
                )
                if created:  # check if the keyword exist or it is being created
                    # print("getting wiki categories")
                    categories = wikicategory(
                        keyword
                    )  # ['Academic transfer', 'Education reform', 'Educational evaluation methods', 'Peer learning', 'Student assessment and evaluation']
                    for category in categories:
                        category_instance, _ = Category.objects.get_or_create(
                            name=category
                        )
                        keyword_instance.categories.add(category_instance)
                    keyword_instance.save()
                try:
                    original_keywords = json.loads(keyword_instance.original_keywords)
                    # print("original keywords variable", original_keywords)
                except:
                    original_keywords = []
                original_keywords.append(original_keyword_name.lower())
                keyword_instance.original_keywords = json.dumps(
                    list(set(original_keywords))
                )
                keyword_instance.save()

                s_interest, _ = ShortTermInterest.objects.update_or_create(
                    user_id=user_id,
                    keyword=keyword_instance,
                    model_month=month,
                    model_year=year,
                    defaults={"source": source, "weight": weight},
                )
                for t in tweet_candidates.filter(full_text__icontains=keyword):
                    s_interest.tweets.add(t)
        tweet_candidates.update(used_in_calc=True)

    if source == ShortTermInterest.SCHOLAR:
        generate_user_short_term_interests(user_id)
        # paper_candidates = Paper.objects.filter(user_id=user_id, used_in_calc=False)
        # # print("paper_candidates in generate_short_term_model in utils.py", paper_candidates) #by lamees
        # # TODO: only one paper per year is being stored possible solution:key year, value list of papers

        # year_wise_text = {}

        # for paper in paper_candidates:
        #     year_wise_text.update({paper.year: []})

        # # print("year_wise_text", year_wise_text)
        # for paper in paper_candidates:
        #     year_wise_text[paper.year].append(
        #         (paper.title if paper.title else "")
        #         + " "
        #         + (paper.abstract if paper.abstract else "")
        #     )

        # # print("\nyear_wise_text", year_wise_text)
        # for year, papers in year_wise_text.items():
        #     for text in papers:
        #         try:
        #             keywords = getKeyword(text, model="SifRank", num=15)
        #         except:
        #             # silencing errors like
        #             # interests/Keyword_Extractor/utils/datarepresentation.py:106: RuntimeWarning: Mean of empty slice
        #             continue
        #         # print(f"got keywords {keywords}")
        #         if not len(keywords.keys()):
        #             # print("No keywords found")
        #             continue
        #         (
        #             wiki_keyword_redirect_mapping,
        #             keyword_weight_mapping,
        #         ) = dbpedia.annotate(keywords)
        #         # wiki_keyword_redirect_mapping = {'Learning analytics': 'learning analytics', 'Open assessment': 'open assessment', 'Learning environment': 'learning environment', 'Peer assessment': 'peer assessment'}
        #         # keyword_weight_mapping = {'Learning analytics': 9, 'Open assessment': 1, 'Learning environment': 5, 'Peer assessment': 9}
        #         if not len(keyword_weight_mapping.keys()):
        #             # print("No keywords found in weight mapping")
        #             continue
        #         keywords = normalize(
        #             keyword_weight_mapping
        #         )  # normalize the weights to range of 5 to 1

        #         # find the category for each keyword seperatly and store the keyword in database as a row
        #         for keyword, weight in keywords.items():
        #             original_keyword_name = wiki_keyword_redirect_mapping.get(
        #                 keyword, keyword
        #             )
        #             # print("\noriginal_keyword_name ", original_keyword_name) # by lamees
        #             keyword = keyword.lower()
        #             if keyword in blacklisted_keywords:
        #                 # print("Skipping {} as its blacklisted".format(keyword))
        #                 continue
        #             keyword_instance, created = Keyword.objects.get_or_create(
        #                 name=keyword.lower()
        #             )
        #             if created:
        #                 # print("getting wiki categories")
        #                 categories = wikicategory(
        #                     keyword
        #                 )  # ['Academic transfer', 'Education reform', 'Educational evaluation methods', 'Peer learning', 'Student assessment and evaluation']
        #                 for category in categories:
        #                     category_instance, _ = Category.objects.get_or_create(
        #                         name=category
        #                     )
        #                     keyword_instance.categories.add(category_instance)
        #                 keyword_instance.save()
        #             try:
        #                 original_keywords = json.loads(
        #                     keyword_instance.original_keywords
        #                 )

        #                 original_keywords_with_weights = json.loads(
        #                     keyword_instance.original_keywords_with_weights
        #                 )
        #                 # print("original keywords variable", original_keywords)
        #             except:
        #                 original_keywords = []
        #                 original_keywords_with_weights = []
        #             original_keywords.append(original_keyword_name.lower())
        #             keyword_instance.original_keywords = json.dumps(
        #                 list(set(original_keywords))
        #             )

        #             # for original keyword with weights column
        #             original_keywords_with_weights.append(
        #                 {original_keyword_name.lower(): weight}
        #             )
        #             keyword_instance.original_keywords_with_weights = json.dumps(
        #                 original_keywords_with_weights
        #             )

        #             keyword_instance.save()
        #             # below a new row will be created if any of the values provided in (user_id, keyword, model_month and model_year) is different
        #             # or the existing row is updated with new source and weight
        #             s_interest, _ = ShortTermInterest.objects.update_or_create(
        #                 user_id=user_id,
        #                 keyword=keyword_instance,
        #                 model_month=1,
        #                 model_year=year,
        #                 defaults={"source": source, "weight": weight},
        #             )
        #             for p in paper_candidates.filter(
        #                 Q(title__icontains=original_keyword_name)
        #                 | Q(abstract__icontains=original_keyword_name)
        #             ):
        #                 s_interest.papers.add(p)
        # paper_candidates.update(used_in_calc=True)


def get_weighted_interest_similarity_score(
    keyword_list_1, keyword_list_2, weights_1, weights_2, algorithm="WordEmbedding"
):  # note add the new embedding here #LK
    # print("keyword_list_1",keyword_list_1)#LK
    if algorithm == "WordEmbedding":
        return calculate_weighted_vectors_similarity(
            keyword_list_1, keyword_list_2, weights_1, weights_2, embedding="Glove"
        )
    else:
        return wikisim(keyword_list_1, keyword_list_2)


def get_interest_similarity_score(
    keyword_list_1, keyword_list_2, algorithm="WordEmbedding"
):
    # print("keyword_list_1",keyword_list_1)#LK
    if algorithm == "WordEmbedding":
        return calculate_similarity(keyword_list_1, keyword_list_2, embedding="Glove")
    else:
        return wikisim(keyword_list_1, keyword_list_2)


# Jaleh
def get_single_interest_similarity_score(
    source_doc, target_doc, source_weight, target_weights, algorithm="WordEmbedding"
):  # note add the new embedding here #LK
    if algorithm == "WordEmbedding":
        return calculate_weighted_vectors_similarity_single_word(
            source_doc, target_doc, source_weight, target_weights, embedding="Glove"
        )
    else:
        return wikisim(source_doc, target_doc)


def get_heat_map_data(user_1_interests, user_2_interests):
    data = {}
    for u_1_interest in user_1_interests:
        data[u_1_interest] = {}
        for u_2_interest in user_2_interests:
            data[u_1_interest][u_2_interest] = round(
                get_interest_similarity_score([u_1_interest], [u_2_interest]) or 0, 2
            )
    return data


def get_venn_chart_data(user_1_interests, user_2_interests):
    heat_map_data = get_heat_map_data(user_1_interests, user_2_interests)
    similarity_threshold = 0.6
    exclusive_user_1_interests = set(user_1_interests)
    exclusive_user_2_interests = set(user_2_interests)
    similar_interests = {"user_1": {}, "user_2": {}}

    for user_1_interest, user_2_interest_set in heat_map_data.items():
        for user_2_interest, sim_score in user_2_interest_set.items():
            if sim_score >= similarity_threshold:
                if user_1_interest in exclusive_user_1_interests:
                    exclusive_user_1_interests.remove(user_1_interest)
                if user_2_interest in exclusive_user_2_interests:
                    exclusive_user_2_interests.remove(user_2_interest)

                if user_1_interest not in similar_interests["user_1"]:
                    similar_interests["user_1"][user_1_interest] = []

                if user_2_interest not in similar_interests["user_2"]:
                    similar_interests["user_2"][user_2_interest] = []

                similar_interests["user_1"][user_1_interest].append(user_2_interest)
                similar_interests["user_2"][user_2_interest].append(user_1_interest)
    return {
        "user_1_exclusive_interest": list(exclusive_user_1_interests),
        "user_2_exclusive_interest": list(exclusive_user_2_interests),
        "similar_interests": similar_interests,
    }


def get_radar_similarity_data(user_1_interests, user_2_interests):
    from interests.Semantic_Similarity.Word_Embedding.IMsim import glove_model

    vector_space = list(
        set(user_1_interests.keys()).union(set(user_2_interests.keys()))
    )
    user_1_data = {}
    user_2_data = {}
    get_vector = lambda x: glove_model[x]
    for keyword in vector_space:
        # user 1
        weight = user_1_interests.get(keyword, 0)
        if not weight:
            for user_1_interest in user_1_interests:
                try:
                    keyword_vector = 0
                    keyword_phrases = keyword.split()
                    if len(keyword_phrases) > 1:
                        for phrase in keyword_phrases:
                            keyword_vector += get_vector(phrase)
                        keyword_vector /= len(keyword_phrases)
                    else:
                        keyword_vector = get_vector(keyword)

                    user_interest_vector = 0
                    interest_phrases = user_1_interest.split()
                    if len(interest_phrases) > 1:
                        for phrase in interest_phrases:
                            user_interest_vector += get_vector(phrase)
                        user_interest_vector /= len(interest_phrases)
                    else:
                        keyword_vector = get_vector(user_1_interest)

                    weight += cosine_sim(keyword_vector, user_interest_vector)
                except:
                    pass
        user_1_data[keyword] = max(weight, 1)

        # user 2
        weight = user_2_interests.get(keyword, 0)
        if not weight:
            for user_2_interest in user_2_interests:
                try:
                    keyword_vector = 0
                    keyword_phrases = keyword.split()
                    if len(keyword_phrases) > 1:
                        for phrase in keyword_phrases:
                            keyword_vector += get_vector(phrase)
                        keyword_vector /= len(keyword_phrases)
                    else:
                        keyword_vector = get_vector(keyword)

                    user_interest_vector = 0
                    interest_phrases = user_2_interest.split()
                    if len(interest_phrases) > 1:
                        for phrase in interest_phrases:
                            user_interest_vector += get_vector(phrase)
                        user_interest_vector /= len(interest_phrases)
                    else:
                        keyword_vector = get_vector(user_2_interest)

                    weight += cosine_sim(keyword_vector, user_interest_vector)
                except:
                    pass
        user_2_data[keyword] = max(weight, 1)
    return {
        "user_1_data": user_1_data,
        "user_2_data": user_2_data,
    }


def get_top_short_term_interest_by_weight(user_id, count=10):
    paper_weight = 0.6
    paper_limit = int(count * paper_weight)
    tweet_limit = count - paper_limit

    date_filtered_qs = (
        ShortTermInterest.objects.filter(user_id=user_id)
        .prefetch_related("tweets", "papers", "keyword")
        .annotate(papers_count=Count("papers"))
        .order_by("-weight", "-papers_count", "-model_year", "-model_month")
    )

    keyword_id_map = {}

    tweet_based_model_count = 0
    for t_model in date_filtered_qs.filter(source=ShortTermInterest.TWITTER):
        if t_model.keyword.name not in keyword_id_map:
            keyword_id_map[t_model.keyword.name] = t_model.id
            tweet_based_model_count += 1
        if tweet_based_model_count >= tweet_limit:
            break

    paper_based_model_count = 0
    for p_model in date_filtered_qs.filter(source=ShortTermInterest.SCHOLAR):
        if p_model.keyword.name not in keyword_id_map:
            keyword_id_map[p_model.keyword.name] = p_model.id
            paper_based_model_count += 1
        if paper_based_model_count >= paper_limit:
            break

    current_keywords_count = len(keyword_id_map.keys())
    if current_keywords_count < count:
        for m in date_filtered_qs.exclude(id__in=list(keyword_id_map.values())):
            if m.keyword.name not in keyword_id_map:
                keyword_id_map[m.keyword.name] = m.id
                current_keywords_count += 1

            if current_keywords_count >= count:
                break

    return date_filtered_qs.filter(id__in=list(keyword_id_map.values()))


def get_top_long_term_interest_by_weight(user_id, count=10):
    paper_weight = 0.6
    paper_limit = int(count * paper_weight)
    tweet_limit = count - paper_limit

    date_filtered_qs = (
        LongTermInterest.objects.filter(user_id=user_id)
        .prefetch_related("tweets", "papers", "keyword")
        .order_by("-weight")
    )

    tweet_model_ids = set(
        date_filtered_qs.filter(
            source__icontains=ShortTermInterest.TWITTER
        ).values_list("id", flat=True)
    )
    paper_model_ids = set(
        date_filtered_qs.filter(
            source__icontains=ShortTermInterest.SCHOLAR
        ).values_list("id", flat=True)
    )

    final_model_ids = set()
    final_model_ids = final_model_ids.union(
        set(list(paper_model_ids)[:paper_limit])
    ).union(set(list(tweet_model_ids)[:tweet_limit]))

    if len(final_model_ids) < count:
        # Add more papers
        new_paper_ids = list(paper_model_ids.difference(final_model_ids))
        final_model_ids = final_model_ids.union(
            set(new_paper_ids[: count - len(final_model_ids)])
        )

    if len(final_model_ids) < count:
        # Add more tweets
        new_tweet_ids = list(tweet_model_ids.difference(final_model_ids))
        final_model_ids = final_model_ids.union(
            set(new_tweet_ids[: count - len(final_model_ids)])
        )

    # add manual keyword
    final_model_ids = final_model_ids.union(
        set(
            list(
                date_filtered_qs.filter(source=LongTermInterest.MANUAL).values_list(
                    "id", flat=True
                )
            )
        )
    )

    return date_filtered_qs.filter(id__in=final_model_ids)


# This part is done by LK


def get_vector_representation(data_type, data, embedding):
    """function to get vector representation of title and abstrcat for the paper or representation of user model"""
    return calculate_vector_embedding(data_type, data, embedding)


def get_interest_paper_similarity_score(interest_vec, doc_vec, embedding):
    """function to calculate cosine similarity between interest vector and doc vector"""
    return cosine_sim(interest_vec, doc_vec, embedding)
    # return(ts_ss_similarity(interest_vec, doc_vec, method=3))


def cosine_sim(vecA, vecB, embedding):
    """Find the cosine similarity distance between two vectors."""
    if embedding == "USE":
        cosine_similarities = tf.reduce_sum(tf.multiply(vecA, vecB), axis=1)
        # calculate angular cos similarity (recommended in USE paper)
        clip_cosine_similarities = tf.clip_by_value(cosine_similarities, -1.0, 1.0)
        csim = 1.0 - tf.acos(clip_cosine_similarities) / math.pi
        return csim.numpy()
    else:
        csim = np.dot(vecA, vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))
        if np.isnan(np.sum(csim)):
            return 0
        return csim


def _convert_short_term_model_to_dict(keywords_list):
    """
    This function reads the short term model and check if the interest is stored multiple times
    then the average of weights will be calculated
    """
    # seperate the list of lists in two lists for keywords and weights
    keywords = []
    weights = []
    dup_index = {}
    for key, value in keywords_list:
        keywords.append(key)
        weights.append(value)

    dup_index = defaultdict(list)
    for i, item in enumerate(keywords):
        dup_index[item].append(i)
    # print("dup_index",dup_index)
    short_term_data = {}
    for k, v in dup_index.items():
        accessed_mapping = map(weights.__getitem__, v)
        accessed_list = list(accessed_mapping)
        short_term_data[k] = round(sum(accessed_list) / float(len(accessed_list)), 1)
        # print(accessed_list)
    return short_term_data


# --------------------------------------------------------------------


def normalize_data(data):
    """function to do  Normalization between 0 and 1"""
    return (data - np.min(data)) / (np.max(data) - np.min(data))
