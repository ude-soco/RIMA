import re
import nltk
import gensim
from nltk.tokenize import word_tokenize, sent_tokenize
import string


from gensim import corpora
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer

nltk.download("stopwords")
nltk.download("wordnet")

def preprocess(document):
    # Lowercase the text
    text = document.lower()
    
    # Remove URLs
    text = re.sub(r"http\S+|www\S+|https\S+", "", text, flags=re.MULTILINE)
    
    # Remove non-alphabetic characters and numbers
    text = re.sub(r'\W+|\d+', ' ', text)
    
    # Tokenize the text
    words = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word not in stop_words]
    
    # Remove punctuation
    words = [word for word in words if word not in string.punctuation]
    
    # Lemmatize the tokens
    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(word) for word in words]
    
    # Join the tokens back into a single string
    preprocessed_text = ' '.join(words)

    return preprocessed_text

def extract_topics(text, num_topics=3, num_words=3):
    words = preprocess(text).split()
    dictionary = corpora.Dictionary([words])
    corpus = [dictionary.doc2bow(word) for word in [words]]
    lda_model = gensim.models.ldamodel.LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=50)

    topics = lda_model.print_topics(num_topics=num_topics, num_words=num_words)
    return [topic[1] for topic in topics]

if __name__ == "__main__":
    # academic_text = """On-road remote sensing technology measures the concentration ratios of pollutants over CO2 in the exhaust plume in half a second when a vehicle passes by a measurement site, providing a rapid, non-intrusive and economic tool for vehicle emissions monitoring and control. A key assumption in such measurement is that the emission ratios are constant for a given plume. However, there is a lack of study on this assumption, whose validity could be affected by a number of factors, especially the engine operating conditions and turbulence. To guide the development of the next-generation remote sensing system, this study is conducted to investigate the effects of various factors on the emissions dispersion process in the vehicle near-wake region and their effects on remote sensing measurement. The emissions dispersion process is modelled using Large Eddy Simulation (LES). The studied factors include the height of the remote sensing beam, vehicle speed, acceleration and side wind. The results show that the measurable CO2 and NO exhaust plumes are relatively short at 30 km/h cruising speed, indicating that a large percentage of remote sensing readings within the measurement duration (0.5 s) are below the sensor detection limit which would distort the derived emission ratio. In addition, the valid measurement region of NO/CO2 emission ratio is even shorter than the measurable plume and is at the tailpipe height. The effect of vehicle speed (30–90 km/h) on the measurable plume length is insignificant. Under deceleration condition, the length of the valid NO/CO2 measurement region is shorter than under cruising and acceleration conditions. Side winds from the far-tailpipe direction have a significant effect on remote sensing measurements. The implications of these findings are discussed and possible solutions to improve the accuracy of remote sensing measurement are proposed.
    # """

    import json
    docs = json.load(open('a.json', 'r'))
    topics = [extract_topics(doc) for doc in docs]
    print("Topics extracted from the academic text:")
    print(topics)