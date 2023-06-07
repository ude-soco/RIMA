from accounts.models import User
from interests.models import (
    Paper,
    Author,
    AuthorsInterests,
)
import numpy as np


#Osama
def generate_authors_interests(user_id):
    """
    Genrates the interests of an author connected to a certain user

    Parameters
    ----------
    user_id : int
        The id of the user object in the database
    
    prerequest
    ----------
    The papers of the authors have their keywords already fetched (used_in_calc = true)
    """
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

