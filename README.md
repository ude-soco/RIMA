<p align="center"><a href="https://rima.sc.inko.cloud/" target="_blank" rel="noopener noreferrer">
<img height="120px" src="RIMA-Frontend/nodejs/public/images/rimaLogo.svg" alt="re-frame logo"></a></p>

# RIMA

A transparent Recommendation and Interest Modeling Application. Developed by Social Computer Group at the University of Duisburg-Essen

## Installation

### Manual Installation Guide

#### Step 1: Installation Guide for RIMA-Backend

1. Download Python (v3.7.1) from [the official website](https://www.python.org/downloads/release/python-371/)

2. Download [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors

3. Install and activate python virtual environment for Windows

   - Open a command prompt with **administration rights**

   - Move to the directory `RIMA-Backend` in your command prompt

   - Type the following commands to install and activate the virtual environment:

     - Install python virtual environment

       ```
       pip install pipenv
       ```

       For Mac/Linux users follow the instructions here: [Pipenv Installation](https://pipenv-fork.readthedocs.io/en/latest/install.html#installing-pipenv)

     - Install python package

       ```
       pipenv install
       ```

     - Activate the virtual environment

       ```
       pipenv shell
       ```

       (Optional) To check the location of your virtual environment, type the following command in your command prompt

       ```
       pipenv --venv
       ```

   - Download the spacy package

     ```
     python -m spacy download en
     ```

   - Download the necessary nltk packages

     ```
     python -c "import nltk;nltk.download('stopwords'); nltk.download('punkt'); nltk.download('sentiwordnet')"
     ```

4. Using your file explorer, go inside the directory `RIMA-Backend\config`, copy the twitter config file `rename_twitter_config.yaml` and paste it in the same folder. Rename the copied twitter config file to `twitter_config.yaml`

   - (Optional) Make an account on [Twitter Developer Platform](https://developer.twitter.com/en) and copy the necessary API keys and access tokens in the `twitter_config.yaml` file

5. Install [Visual Studio Community 2017](https://visualstudio.microsoft.com/de/thank-you-downloading-visual-studio/?sku=Community&rel=15). Make sure to install the package `Desktop development with C++`. Set `VCINSTALLER` system variable to `C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC` ([Read more](https://stackoverflow.com/questions/57541402/node-gyp-configure-got-gyp-err-find-vs/70799513#70799513)). For Linux users, check [GCC Installation guide for Linux](https://linuxize.com/post/how-to-install-gcc-compiler-on-ubuntu-18-04/)

6. Download and install [Redis for Windows](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi)

7. Download [Elmo](https://s3-us-west-2.amazonaws.com/allennlp/models/elmo/2x4096_512_2048cnn_2xhighway/elmo_2x4096_512_2048cnn_2xhighway_weights.hdf5) and copy it inside `RIMA-Backend/interests/Keyword_Extractor/Algorithms/embedding_based/auxiliary_data`

8. Download [StanfordCoreNLP](https://uni-duisburg-essen.sciebo.de/s/nO06q2wY0t5h8SO/download) and extract the ZIP file inside `RIMA-Backend/interests/Keyword_Extractor/Algorithms/embedding_based`

9. Download [MSmarco model](https://uni-duisburg-essen.sciebo.de/s/z1k3w8Oxb8RRd4M/download). Create a folder named "transformers" in "RIMA-Backend" folder. Unzip the downloaded file and save it in the location `RIMA-Backend/transformers`

10. Download and install [Java JDK](https://www.oracle.com/java/technologies/downloads/)

11. In the command prompt to create the database

    ```
    python manage.py migrate
    ```

12. Run the django server and do not close it

    ```
    python manage.py runserver
    ```

13. Open a new command prompt with admin rights or terminal

    - Move to the `RIMA-Backend` in your command prompt

    - Activate the virtual environment

      ```
      pipenv shell
      ```

    - Start the celery workers (using one of the suitable commands below) and do not close the command prompt

      ```
      # For Windows if you have more than 4 cores
      celery -A interest_miner_api worker --concurrency=4 -l info -P eventlet

      # For Windows if you have less than 4 cores
      celery -A interest_miner_api worker --pool=solo -l info

      # For Linux: Atleast 4 cores. Set --concurrency value to 1 if you have less than 4 cores
      celery -A interest_miner_api worker --concurrency=4 -l info
      ```

#### Step 2: Installation Guide for RIMA-Frontend

1. Download Node.js (v12.13.0) from [the official website](https://nodejs.org/en/blog/release/v12.13.0)

2. Using your file explorer, go inside the directory `RIMA-Frontend/nodejs`, copy the `example.env` file and paste it in the same folder. Rename the copied environment file to `.env`

3. Open a command prompt/terminal in the `RIMA-Frontend/nodejs` directory

4. Type the command in the command prompt/terminal to install node packages

   ```bash
   npm ci
   ```

   If you face issue with `npm ci` command, try `npm install` or `npm install --force` command. Caution: `npm install` and `npm install --force` will delete all the existing node packages, install the new ones and update the `package-lock.json` file. Please make sure you DO NOT push your changes to the `package-lock.json` file.

5. After the packages are installed, type the following command to run the server

   ```bash
   npm start
   ```

   The server will run at [http://localhost:8080](http://localhost:8080)

6. Stop the server by pressing `Cntl + c` inside the command prompt

**FAQ**

Q. My the interest model is not working, what should I do?

A. Delete the python virtual environment, db.sqllite3 file inside RIMA-Backend folder, and repeat the whole process from the beginning. Make sure you install the python virtual environment, python packages, and run the servers in Command Prompt with Administration rights.

#### Step 2: Installation Guide for RIMA-Frontend

1. Download and install [Node.js ver.12.13.0](https://nodejs.org/dist/v12.13.0)

2. Using a file explorer, move to the `RIMA-Frontend/nodejs` and rename the `.env.example` file to `.env`

3. Open a command prompt or terminal and move to the `RIMA-Frontend/nodejs` directory

4. Type `npm install` to install the necessary dependencies for the project

5. Type `npm start` to run the project

6. [http://localhost:3000](http://localhost:3000/) will open in a browser

## Components

- RIMA-Backend
  - api: Django (Python) HTTP api, serving ...
  - worker: Celery (Python) job queue, doing ...
  - db: PostgreSQL database, used for ...
  - redis: Redis key-value cache, used for ...
- RIMA-Frontend
  - web: User-facing React (Node.js) UI, offering ...
- model:
  - downloader: Bash, fetches model files from Google Drive
  - server: nginx, serves model files to RIMA-Backend via HTTP

## Official builds and deployments

### Container images

- [RIMA-Backend](https://hub.docker.com/repository/docker/inko/soco-rima-backend)
- [RIMA-Frontend](https://hub.docker.com/repository/docker/inko/soco-rima-frontend)
- [model-downloader](https://hub.docker.com/repository/docker/inko/soco-rima-model-downloader)

### Live instances

* Production: [rima.soco.inko.cloud](https://rima.soco.inko.cloud/) (latest [release](https://github.com/ude-soco/RIMA/releases))
* Preview: [edge.rima.soco.inko.cloud](https://edge.rima.soco.inko.cloud/) ([branch `master`](https://github.com/ude-soco/CourseMapper-webserver/tree/master))
* Preview: [development.rima.soco.inko.cloud](https://development.rima.soco.inko.cloud/) ([branch `development`](https://github.com/ude-soco/CourseMapper-webserver/tree/development))


## Run on Docker

- Production: `docker-compose up -f docker-compose.yml` (see `Makefile`)
- Development: `tilt up`

## Run on Kubernetes

- see `./.k8s/README.md`

## Development setup

- see `./RIMA-Backend/README.md` and `./RIMA-Frontend/README.md`

## Citations

- (Bibtex)

## Contributing
