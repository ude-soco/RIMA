from stringprep import in_table_b1


def normalize(dic):
    '''
    This function is used to map the weight of the interests to [1,5]
    '''
    # dict = {'analytics': 9, 'peer assessment': 5, 'personalization': 1, 'theory': 6, 'recommender system': 9}

    maxnum = sorted(dic.items(), key=lambda items: items[1], # key of sorting is the second element in dic which is the numbers(weights) of each keyword
                    reverse=True)[:1][0][1]
    
    for k, v in dic.items():
        f = v / maxnum * 5 
        dic[k] = round(f, 1)
        if dic[k] < 1:
            dic[k] = 1

    return dic

# def general_normalize(dic, out_min =1, out_max=5):
#     '''
#     general normalization function that maps any range to any desired range
#     '''
#     #formula (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
#     #output = output_start + ((output_end - output_start) / (input_end - input_start)) * (input - input_start)
    
#     # in_min = sorted(dic.items(), key=lambda items: items[1], # key of sorting is the second element in dic which is the numbers(weights) of each keyword
#     #                 reverse=False)[:1][0][1]
#     in_min =0
#     # in_max = sorted(dic.items(), key=lambda items: items[1], # key of sorting is the second element in dic which is the numbers(weights) of each keyword
#     #                 reverse=True)[:1][0][1] # all sorted list e.x: [('analytics', 5.0), ('recommender system', 5.0), ('theory', 3.6), ('peer assessment', 3.1), ('personalization', 1.0)]
#     in_max = 1
#     for key, value in dic.items():
#         if (in_max - in_min) == 0:
#             num = out_min # discuss with shoeb
#         else:
#             num = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
#         dic[key] = round(num, 1)
#     return dic

def update_interest_models(x, y): # x -> short_term_data, y -> long_term_data
    '''
    This function is used to update the new short-term interest model with the
    old long-term interest model after a certain time period to get the new
    long-term interest model

    '''
    # divide the short term weight by 2 to apply the forget function # LK
    for k in x.keys():
        x[k] = x[k] / 2

    # If the keyword in the short-term already exists in long-term then the weight will be added to the previous weight
    # and if it is not exist then it will be added to the long-term set
    for k, v in x.items():
        if k in y.keys():
            y[k] += v
        else:
            y[k] = v
    # print(y)

    interest_tuples = sorted(y.items(), key=lambda item: item[1],
                             reverse=True)[:15]
    updated = {}
    for tuples in interest_tuples:
        updated[tuples[0]] = tuples[1]

    # print(updated)

    updated_interest_model = normalize(updated)

    return updated_interest_model


def interest_aggregator(x, y):
    '''
    This function is used to aggregate the paper interests and tweet interests
    '''

    for k in x.keys():
        x[k] = x[k] * 0.6

    for k in y.keys():
        y[k] = y[k] * 0.4

    for k, v in x.items():
        if k in y.keys():
            y[k] += v
        else:
            y[k] = v

    final_interest_model = normalize(y)

    return final_interest_model
