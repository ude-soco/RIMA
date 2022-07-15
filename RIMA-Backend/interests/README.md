
1. For using scibert model or USE model <br> 
Download the models from the links below and follow the comments written in settings.py file<br>
    - [SciBERT](https://s3-us-west-2.amazonaws.com/ai2-s2-research/scibert/huggingface_pytorch/scibert_scivocab_uncased.tar)<br> 
    - [USE](https://tfhub.dev/google/universal-sentence-encoder/4)<br>

2. Download MSmarco model from [MSmarco](https://1drv.ms/u/s!AokEy2_vaKbhgddabiUyea8NDznodA?e=NwX2CR). Create a folder named "transformers" in "RIMA-Backend" folder, unzip it and save it in the following location "RIMA-Backend/transformers"

3. SIFRank model<br>
Download:<br>
    
    - <b>ELMo</b>: elmo_2x4096_512_2048cnn_2xhighway_weights.hdf5 from [Link1](https://s3-us-west-2.amazonaws.com/allennlp/models/elmo/2x4096_512_2048cnn_2xhighway/elmo_2x4096_512_2048cnn_2xhighway_weights.hdf5). Save the files in the <i>"RIMA-Backend/interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data"</i> directory.<br>
    
    - <b>StanfordCoreNLP</b>: stanford-corenlp-full-2018-02-27 from [here](http://nlp.stanford.edu/software/stanford-corenlp-full-2018-02-27.zip). Unzip and save in <i> "RIMA-Backend/interests/Keyword_Extractor/Algorithms/embedding_based" </i> directory.

