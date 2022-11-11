<p align="center">
<a href="https://rima.sc.inko.cloud/" target="_blank" rel="noopener noreferrer">
<img height="120px" src="../RIMA-Frontend/nodejs/public/images/rimaLogo.svg" alt="re-frame logo">
</a>
</p>

## 🐳 Docker Installation Guide

1. Download and install [Docker](https://www.docker.com/products/docker-desktop)

2. Download and install [Node.js v.8.9.0](https://nodejs.org/dist/v8.9.0/). Using a terminal/command prompt, move to the `RIMA-Frontend/nodejs` and type `npm install`

3. Download [Elmo](https://s3-us-west-2.amazonaws.com/allennlp/models/elmo/2x4096_512_2048cnn_2xhighway/elmo_2x4096_512_2048cnn_2xhighway_weights.hdf5) and copy it inside `RIMA-Backend/interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data`

4. Download [StanfordCoreNLP](https://uni-duisburg-essen.sciebo.de/s/jADBrM5PUgVqMIr/download) and unzip the file inside `RIMA-Backend/interests/Keyword_Extractor/Algorithms/embedding_based`

5. Download [MSmarco model](https://uni-duisburg-essen.sciebo.de/s/z1k3w8Oxb8RRd4M/download). Create a folder named "transformers" in "RIMA-Backend" folder. Unzip the downloaded file and save it in `RIMA-Backend/transformers`

6. Download the [GloVe model](https://uni-duisburg-essen.sciebo.de/s/cKZLWBtulWHoCaT/download) and unzip the model inside the `RIMA-Backend` folder

7. Run the following command in the root directory `RIMA`

   ```
   docker-compose -f docker-compose-dev-alp.yml up --build
   ```

## Manual Installation Guide for RIMA-Backend

1. Download Python (v3.7.1) from [the official website](https://www.python.org/downloads/release/python-371/)

2. Download [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors

3. Install and activate python virtual environment for Windows

   - Open a command prompt with **administration rights**

   - Move to the directory `RIMA-Backend` in your command prompt

   - Type the following commands and do not close the command prompt after executing the fourth command:

     - Install python virtual environment

       ```
       python -m venv venv
       ```

     - Activate python virtual environment

       ```
       .\venv\Scripts\activate
       ```

     - Upgrade pip and setuptools version

       ```
       python -m pip install --upgrade pip setuptools
       ```

     - Install the required packages

       ```
       pip install -r requirements-docker.txt     # For Linux/MacOS
       pip install -r requirements-windows.txt    # For Windows
       ```

   - Install selenium

     ```
     pip install selenium
     ```

   - Download the spacy package

     ```
     python -m spacy download en
     ```

   - Download the necessary nltk packages

     ```
     python -c "import nltk;nltk.download('stopwords'); nltk.download('punkt'); nltk.download('sentiwordnet')"
     ```

4. Using your file explorer, go inside the directory `RIMA-Backend`, rename the environment variable file from `.env.example` to `.env`

5. Open the `.env` file and add additional environment variables (contact [Shoeb Joarder](mailto:shoeb.joarder@uni-due.de) for info)

6. Install [Visual Studio Community 2017](https://visualstudio.microsoft.com/de/vs/community/). Make sure to install the package `Desktop development with C++`. Set `VCINSTALLER` system variable to `C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC` ([Read more](https://stackoverflow.com/questions/57541402/node-gyp-configure-got-gyp-err-find-vs/70799513#70799513)). For Linux users, check [GCC Installation guide for Linux](https://linuxize.com/post/how-to-install-gcc-compiler-on-ubuntu-18-04/)

7. Download and install [Redis for Windows](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi)

8. Download [Elmo](https://s3-us-west-2.amazonaws.com/allennlp/models/elmo/2x4096_512_2048cnn_2xhighway/elmo_2x4096_512_2048cnn_2xhighway_weights.hdf5) and copy it inside `RIMA-Backend/interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data`

9. Download [StanfordCoreNLP](http://nlp.stanford.edu/software/stanford-corenlp-full-2018-02-27.zip) and extract the ZIP file inside `RIMA-Backend/interests/Keyword_Extractor/Algorithms/embedding_based`

10. Download [MSmarco model](https://1drv.ms/u/s!AokEy2_vaKbhgddabiUyea8NDznodA?e=NwX2CR). Create a folder named "transformers" in "RIMA-Backend" folder. Unzip the downloaded file and save it in the location `RIMA-Backend/transformers`

11. Download and install [Java JDK](https://www.oracle.com/java/technologies/downloads/)

12. Download the [GloVe model](https://drive.google.com/file/d/1FfQgEjR6q1NyFsD_-kOdBCHMXB2QmNxN/view?usp=sharing) and copy the model inside the `RIMA-Backend`

13. In the command prompt to create the database

    ```
    python manage.py migrate
    ```

14. Run the django server and do not close it

    ```
    python manage.py runserver
    ```

15. Open a new command prompt with admin rights or terminal

    - Move to the `RIMA-Backend` in your command prompt

    - Activate the virtual environment

      ```
      .\venv\Scripts\activate
      ```

    - Start the celery workers and do not close the command prompt

      ```
      celery worker --app=interest_miner_api -l info -P eventlet
      ```

**FAQ**

Q. My the interest model is not working, what should I do?

A. Delete the python virtual environment, db.sqllite3 file inside RIMA-Backend folder, and repeat the whole process from the beginning. Make sure you install the python virtual environment, python packages, and run the servers in Command Prompt with Administration rights.
