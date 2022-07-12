import os
import pke
from kep.utility import CreateKeywordsFolder, LoadFiles
from sifrank.SifRank import KeyphraseExtractor
from flair.embeddings import TransformerWordEmbeddings


class KWPExtractor(object):
    def __init__(self, numOfKeywords, pathData, dataset_name):
        self.__numOfKeywords = numOfKeywords
        self.__dataset_name = dataset_name
        self.__pathData = pathData
        self.__algorithmName = "{}".format(self.__class__.__name__)
        self.__pathToDatasetName = self.__pathData + "/datasets/" + self.__dataset_name
        self.__keywordsPath = "{}/keyphrases/{}/{}".format(
            self.__pathData, self.__algorithmName, self.__dataset_name)

        tf = TransformerWordEmbeddings("squeezebert/squeezebert-mnli", subtoken_pooling="mean", layers='3,5')
        self.model = KeyphraseExtractor(tf)

    def LoadDatasetFiles(self):
        listFile = LoadFiles(self.__pathToDatasetName + '/docsutf8/*')
        print("\ndatasetID = {}; Number of Files = {}".format(
            self.__dataset_name, len(listFile)))
        return listFile

    def CreateKeywordsOutputFolder(self):
        CreateKeywordsFolder(self.__keywordsPath)

    def runSingleDoc(self, doc):
        if os.path.isfile(doc):
            with open(doc, encoding='utf-8') as f:
                text = f.read()
        else:
            text = doc
        try:
            keywords = self.model.extract_keyphrases(
                text, top_n=self.__numOfKeywords, lamda=0.6, use_embedding_alignment=False, dataset="Inspec")
            return keywords
        except Exception as e:
            print(e)

    def runMultipleDocs(self, listOfDocs):
        self.CreateKeywordsOutputFolder()

        for j, doc in enumerate(listOfDocs):
            docID = '.'.join(os.path.basename(doc).split('.')[0:-1])

            keywords = self.runSingleDoc(doc)

            with open(os.path.join(self.__keywordsPath, docID),
                      'w',
                      encoding='utf-8') as out:
                for keyword, score in keywords:
                    out.write('{} {}\n'.format(keyword, score))

            print("\rFile: {}/{}".format(j + 1, len(listOfDocs)), end='')

        print(f"\n100% of the Extraction Concluded")

    def ExtractKeyphrases(self):
        print(
            "\n\n-----------------Extract Keyphrases--------------------------"
        )
        listOfDocs = self.LoadDatasetFiles()
        self.runMultipleDocs(listOfDocs)
