<p align="center">
<a href="https://rima.sc.inko.cloud/" target="_blank" rel="noopener noreferrer">
<img height="120px" src="../RIMA-Frontend/nodejs/public/images/rimaLogo.svg" alt="re-frame logo">
</a>
</p>



## Installation Guide for RIMA-Backend

1. Download Python (v3.7.1) from [the official website](https://www.python.org/downloads/release/python-371/)

2. Download [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors

3. Install and activate python virtual environment for Windows (for [MacOS](https://programwithus.com/learn/python/pip-virtualenv-mac) and [Ubuntu](https://linuxize.com/post/how-to-create-python-virtual-environments-on-ubuntu-18-04/))
    - Move to the directory `RIMA-Backend`

    - Open a command prompt with admin rights or terminal and type the following commands

```sh
$ python -m venv venv                       # Installs a python virtual environment
$ .\venv\Scripts\activate                   # Activates the python virtual environment
$ python -m pip install --upgrade pip       # Upgrades pip version
$ pip install -r requirements-offline.txt   # Installs the required packages
```

4. Rename the environment variable file from `.env.example` to `.env`

5. Edit the environment file to add additional environment variables

6. Type the following commands to install spacy and its libraries

```sh
$ python -m spacy download en
$ python -c "import nltk;nltk.download('stopwords')" && python -c "import nltk;nltk.download('punkt')" && python -c "import nltk;nltk.download('sentiwordnet')"
```

7. Download and install Redis for [Windows](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi) ([MacOS](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) and [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04-de))

8. Download the [GloVe model](https://drive.google.com/file/d/1FfQgEjR6q1NyFsD_-kOdBCHMXB2QmNxN/view?usp=sharing) and copy the model inside the `RIMA-Backend`

9. Type `python manage.py migrate` to create the database

10. Type `python manage.py runserver` to run the django server

11. Open another command prompt with admin rights or terminal

    - Locate the virtual environment and activate
    - Move to the directory `RIMA-Backend`
    - Type `celery worker --app=interest_miner_api -l info -P eventlet` to start the celery workers
