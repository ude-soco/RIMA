<p align="center">
<a href="https://rima.sc.inko.cloud/" target="_blank" rel="noopener noreferrer">
<img height="120px" src="../RIMA-Frontend/nodejs/public/images/rimaLogo.svg" alt="re-frame logo">
</a>
</p>

## Installation Guide for RIMA-Backend

1. Download Python (v3.7.1) from [the official website](https://www.python.org/downloads/release/python-371/)

2. Download [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors

3. Install and activate python virtual environment for Windows (Links to the installation and activation instructions available: [MacOS](https://programwithus.com/learn/python/pip-virtualenv-mac) and [Ubuntu](https://linuxize.com/post/how-to-create-python-virtual-environments-on-ubuntu-18-04/))

   - Open a command prompt with admin rights or open a terminal

   - Move to the directory `RIMA-Backend` in your command prompt or terminal

   - Type the following commands and do not close the command prompt or terminal after executing the fourth command:

```sh
# Installs a python virtual environment
python -m venv venv

# Activates the python virtual environment
.\venv\Scripts\activate

# Upgrades pip version
python -m pip install --upgrade pip

# Installs the required packages
pip install -r requirements-offline.txt
```

4. Using your file explorer, go inside the directory `RIMA-Backend`, rename the environment variable file from `.env.example` to `.env`

5. Open the `.env` file and add additional environment variables (contact the developers for the environment variables)

6. In the command prompt or terminal, type the following commands to install spacy and nltk packages. Do not close the command prompt or terminal after the last command

```sh
# Downloads the spacy package
python -m spacy download en

# Downloads the necessary nltk packages
python -c "import nltk;nltk.download('stopwords')" && python -c "import nltk;nltk.download('punkt')" && python -c "import nltk;nltk.download('sentiwordnet')"
```

7. Download and install Redis for [Windows](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi) (Links to the installation instructions available: [MacOS](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) and [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04-de))

8. Download the [GloVe model](https://drive.google.com/file/d/1FfQgEjR6q1NyFsD_-kOdBCHMXB2QmNxN/view?usp=sharing) and copy the model inside the `RIMA-Backend`

9. In the command prompt or terminal, type `python manage.py migrate` to create the database

10. Then type `python manage.py runserver` in the command prompt or terminal, to run the django server and do not close it

11. Open a new command prompt with admin rights or terminal

    - Move to the `RIMA-Backend` in your command prompt
    - Activate the virtual environment by typing `.\venv\Scripts\activate`
    - Type `celery worker --app=interest_miner_api -l info -P eventlet` to start the celery workers and do not close the command prompt or terminal
