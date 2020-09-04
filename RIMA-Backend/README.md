# RIMA-A Transparent Recommendation and Interest Modeling Application
This is the backend of the RIMA web application.

## Before running the application:

Please download word embedding model([GloVe](http://nlp.stanford.edu/data/glove.6B.zip)) and convert it into word2vec format, refer [this link](https://radimrehurek.com/gensim/scripts/glove2word2vec.html).

Please put the converted file in the root directory of this folder.


## Steps to run application using docker:

Install docker https://docs.docker.com/get-docker/

Steps to run using docker-compose for the first time

```
docker-compose --compatibility up --build
```


for subsequent runs

to start the server run `docker-compose up`

to stop the server run `docker-compose down`
