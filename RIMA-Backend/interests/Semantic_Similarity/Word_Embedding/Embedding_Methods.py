from unittest import skip
import numpy as np
from nltk.corpus import stopwords
from interests.Semantic_Similarity.Word_Embedding.data_models import use_model, transformer_model, specter_tokenizer, specter_model, scibert_model, scibert_tokenizer
import torch


# LK


def calculate_vector_embedding(data_type, data, embedding) -> np.array:

    '''
    Get vector embedding for user model or full document(title + abstract) or paper keywords extracted from papers 
    :param data_type: user_model, paper_keywords or paper_title_abstract
    :param data: dictionary of keywords and weights for user_model or dictionary of titles and abstracts for paper
    :embedding: embedding type (SPECTER, USE, Transformers, ....)
    :rtype: : numpy array 
    '''
    def specter_vectorize(data_type, data):
        '''Identify the vector values for the given document'''

        if data_type == 'user_model' or data_type == 'paper_keywords':
            # preprocess the input
            vec_list = []
            doc = list(data.keys())
            weights = list(data.values())   

            for phrase in doc:
                # print('phrase\n', phrase)
                try:
                    inputs = specter_tokenizer(phrase, padding=True, truncation=True, return_tensors="pt", max_length=512)
                    result = specter_model(**inputs)

                    # take the first token in the batch as the embedding and convert the tensor to numpy array
                    vector = result.last_hidden_state[:, 0,:].detach().cpu().numpy()
                    #print('vector\n', vector)
                except KeyError:
                    pass

                weighted_vector = weights[doc.index(phrase)] * np.array(vector) #[x * weights[i] for x in vector] # multiply each element in the vector with the weight value
                # print('weighted_vectors\n', weighted_vector)
                vec_list.append(weighted_vector)
            # summing all vectors of keywords into one vector
            vectors = np.sum(vec_list, axis=0)
            #print(vectors)
            # dividing by the sum of weights
            weighted_average_vector = vectors / np.sum(weights)
            #print('weighted_average_vectors\n', weighted_average_vectors)
            return weighted_average_vector


        
        elif data_type == 'paper_title_abstract': 
            title_abs = [data['title'] + specter_tokenizer.sep_token + data['abstract']]
            # preprocess the input
            inputs = specter_tokenizer(title_abs, padding=True, truncation=True, return_tensors="pt", max_length=512)

            result = specter_model(**inputs)

            # take the first token in the batch as the embedding and convert the tensor to numpy array
            embeddings_vector = result.last_hidden_state[:, 0,:].detach().cpu().numpy()
            
            return embeddings_vector


    def use_vectorize(data_type, data):
        """Identify the vector values for the given document"""
        if data_type == 'user_model' or data_type == 'paper_keywords':
            # preprocess the input
            vec_list = []
            doc = list(data.keys())
            weights = list(data.values())   

            for phrase in doc:
                print('phrase\n', phrase)
                try:
                    vector = use_model([phrase])
                    #print('vector\n', vector)
                except KeyError:
                    pass

                weighted_vector = weights[doc.index(phrase)] * np.array(vector)  # multiply each element in the vector with the weight value
                # print('weighted_vectors\n', weighted_vector)
                vec_list.append(weighted_vector)
            # summing all vectors of keywords into one vector
            vectors = np.sum(vec_list, axis=0)
            #print(vectors)
            # dividing by the sum of weights
            weighted_average_vector = vectors / np.sum(weights)
            #print('weighted_average_vectors\n', weighted_average_vectors)
            return weighted_average_vector#[0]


        
        elif data_type == 'paper_title_abstract': 
            title_abs = [data['title'] + ' ' + data['abstract']]
            # preprocess the input
            embeddings_vector = use_model(title_abs)
            return embeddings_vector#[0]

    def transformer_vectorize(data_type, data):
        """Identify the vector values for the given document"""
        if data_type == 'user_model' or data_type == 'paper_keywords':
            # preprocess the input
            vec_list = []
            doc = list(data.keys())
            weights = list(data.values())   
            print("doc values: ", doc)
            print("\nweights values ", weights)
            for phrase in doc:
                print('phrase\n', phrase)
                try:
                    vector = transformer_model.encode(phrase, normalize_embeddings=False, convert_to_tensor=False)
                    print('vector\n', vector)
                except KeyError:
                    pass

                weighted_vector = weights[doc.index(phrase)] * np.array(vector)  # multiply each element in the vector with the weight value
                print('weighted_vectors\n', weighted_vector)
                vec_list.append(weighted_vector)
            # summing all vectors of keywords into one vector
            vectors = np.sum(vec_list, axis=0)
            print(vectors)
            # dividing by the sum of weights
            weighted_average_vector = vectors / np.sum(weights)
            print('weighted_average_vectors\n', weighted_average_vector)
            return weighted_average_vector


    
        elif data_type == 'paper_title_abstract': 
            title_abs = data['title'] + ' ' + data['abstract']
            # preprocess the input
            embeddings_vector = transformer_model.encode(title_abs, normalize_embeddings=False, convert_to_tensor=False)
            return embeddings_vector

    def scibert_vectorize(data_type, data):
        """Identify the vector values for each phrase in the given document"""
    
        if data_type == 'user_model' or data_type == 'paper_keywords':
            # preprocess the input
            vec_list = []
            doc = list(data.keys())
            weights = list(data.values())   

            for phrase in doc:
                # print('phrase\n', phrase)
                try:
                    input_ids = torch.tensor(scibert_tokenizer.encode(phrase)).unsqueeze(0)  # Batch size 1
                    outputs = scibert_model(input_ids)
                    last_hidden_states = outputs[0]
                    #use a mean of all word embeddings. To do that we will take mean over dimension 1 which is the sequence length
                    vector = last_hidden_states.mean(1)
                    vector = vector.detach().numpy()
                    # print('vector\n', vector)
                    # vector = scibert_model.encode(phrase)
                except KeyError:
                    pass

                weighted_vector = weights[doc.index(phrase)] * np.array(vector)  # multiply each element in the vector with the weight value
                # print('weighted_vectors\n', weighted_vector)
                vec_list.append(weighted_vector)
            # summing all vectors of keywords into one vector
            vectors = np.sum(vec_list, axis=0)
            #print(vectors)
            # dividing by the sum of weights
            weighted_average_vector = vectors / np.sum(weights)
            #print('weighted_average_vectors\n', weighted_average_vectors)
            return weighted_average_vector


    
        elif data_type == 'paper_title_abstract':
            title_abs =''
            vector = []
            title_abs = data['title'] + ' ' + data['abstract']
            # print('title_abs\n', title_abs)
            # preprocess the input
            
            input_ids = torch.tensor(scibert_tokenizer.encode(title_abs)).unsqueeze(0)  # Batch size 1
            # print('input_ids', input_ids)           
            outputs = scibert_model(input_ids)
            # print('outputs', outputs)
            last_hidden_states = outputs[0]
            # print('last_hidden_states', last_hidden_states)
            vector = last_hidden_states.mean(1)
            vector = vector.detach().numpy()
            print('vector', vector)
            
               
            # embeddings_vector = scibert_model.encode(title_abs)
            # vector = get_embedding(scibert_model,scibert_tokenizer, title_abs)
            return vector

    if embedding == 'USE':
        vector_embedding = use_vectorize(data_type, data)
    
    elif embedding =='Transformers':
        vector_embedding = transformer_vectorize(data_type, data)

    elif embedding =='SPECTER':
        vector_embedding = specter_vectorize(data_type, data)
    
    elif embedding == "SciBERT":
        vector_embedding = scibert_vectorize(data_type, data)

    return vector_embedding



