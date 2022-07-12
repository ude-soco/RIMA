from glob import glob
import os
import re
from kep.utility import LoadFiles
from imports import EVALUATION_CONFIG

datasets_path = EVALUATION_CONFIG['datasets']


def clean_text(text="", dataset="Inspec"):
    if dataset == "Duc2001" or dataset == 'SemEval2017':
        pattern = re.compile(r'[\s,]' + '[\n]{1}')
        while True:
            if pattern.search(text) is not None:
                position = pattern.search(text)
                start = position.start()
                end = position.end()
                text_new = text[:start] + '\n' + text[start + 2:]
                text = text_new
            else:
                break

    pattern = re.compile(r'[a-zA-Z0-9,\s]' + '[\n]{1}')
    while True:
        if pattern.search(text) is not None:
            position = pattern.search(text)
            start = position.start()
            end = position.end()
            text_new = text[:start + 1] + " " + text[start + 2:]
            text = text_new
        else:
            break

    pattern1 = re.compile(r'\s{2,}')
    while True:
        if pattern1.search(text) is not None:
            position = pattern1.search(text)
            start = position.start()
            end = position.end()
            text_new = text[:start + 1] + "" + text[start + 2:]
            text = text_new
        else:
            break

    pattern2 = re.compile(r'[<>[\]{}]')
    text = pattern2.sub(' ', text)
    text = text.replace("\t", " ")
    text = text.replace(' p ', '\n')
    text = text.replace(' /p \n', '\n')
    lines = text.splitlines()
    text_new = ""
    for line in lines:
        if line != '\n':
            text_new += line + '\n'

    return text_new


def get_inspec_data():
    file_path = os.path.join(datasets_path, "Inspec")
    data = {}
    labels = {}
    for dirname, dirnames, filenames in os.walk(file_path):
        for fname in filenames:
            left, right = fname.split('.')
            if (right == "abstr"):
                infile = os.path.join(dirname, fname)
                with open(infile) as f:
                    text = f.read()
                text = clean_text(text)
                data[left] = text
            if (right == "uncontr"):
                infile = os.path.join(dirname, fname)
                with open(infile) as f:
                    text = f.read()
                text = text.replace("\n", ' ')
                text = clean_text(text)
                text = text.lower()
                label = text.split("; ")
                labels[left] = label
    return data, labels


def get_duc2001_data():
    file_path = os.path.join(datasets_path, "DUC2001")
    pattern = re.compile(r'<TEXT>(.*?)</TEXT>', re.S)
    data = {}
    labels = {}
    for dirname, dirnames, filenames in os.walk(file_path):
        for fname in filenames:
            if (fname == "annotations.txt"):
                infile = os.path.join(dirname, fname)
                with open(infile, 'rb') as f:
                    text = f.read().decode('utf8')
                lines = text.splitlines()
                for line in lines:
                    left, right = line.split("@")
                    d = right.split(";")[:-1]
                    l = left
                    labels[l] = d

            else:
                infile = os.path.join(dirname, fname)
                with open(infile, 'rb') as f:
                    text = f.read().decode('utf8')
                text = re.findall(pattern, text)[0]
                text = text.lower()
                text = clean_text(text, dataset="DUC2001")
                data[fname] = text.strip("\n")
    return data, labels


def get_data(datasetName):
    data = {}
    labels = {}

    listOfDocs = LoadFiles(
        os.path.join(datasets_path, datasetName, 'docsutf8', '*'))

    keysFiles = glob(os.path.join(datasets_path, datasetName, 'keys', '*'))

    for i, doc in enumerate(listOfDocs):
        docID = str(os.path.basename(doc).split('.')[0])
        text = read_file(doc)
        text = clean_text(text, dataset=datasetName)
        data[docID] = text.lower()

    for i, key_doc in enumerate(keysFiles):
        docID = str(os.path.basename(key_doc).split('.')[0])
        text = read_file(key_doc)
        text = text.strip()
        lines = text.splitlines()
        labels[docID] = lines

    return data, labels


def read_file(file_path):
    with open(file_path, encoding='utf8') as f:
        content = f.read()
    return content
