def normalize(dic):
    '''
    This function is used to map the weight of the interests to [1,5]
    '''
    maxnum = sorted(dic.items(), key=lambda items: items[1],
                    reverse=True)[:1][0][1]
    for k, v in dic.items():
        f = v / maxnum * 5
        dic[k] = round(f, 1)
        if dic[k] < 1:
            dic[k] = 1
    return dic


def update_interest_models(x, y):
    '''
    This function is used to update the new short-term interest model with the
    old long-term interest model after a certain time period to get the new
    long-term interest model

    '''
    for k in x.keys():
        x[k] = x[k] / 2

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
