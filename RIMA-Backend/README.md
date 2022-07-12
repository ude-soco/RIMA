<p align="center">
<a href="https://rima.sc.inko.cloud/" target="_blank" rel="noopener noreferrer">
<img height="120px" src="../RIMA-Frontend/nodejs/public/images/rimaLogo.svg" alt="re-frame logo">
</a>
</p>

## Installation Guide for RIMA-Backend

1. Download Python (v3.7.1) from [the official website](https://www.python.org/downloads/release/python-371/)

2. Download [IntelliJ Ultimate](https://www.jetbrains.com/de-de/idea/download/#section=windows) or [Visual Studio Code](https://code.visualstudio.com/download) and install one of the code editors

3. Install and activate python virtual environment for Windows (Links to the installation and activation instructions available: [MacOS](https://programwithus.com/learn/python/pip-virtualenv-mac) and [Ubuntu](https://linuxize.com/post/how-to-create-python-virtual-environments-on-ubuntu-18-04/))

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

     - Upgrade pip version

       ```
       python -m pip install --upgrade pip
       ```

     - Install the required packages

       ```
       pip install -r requirements-offline.txt
       ```

4. Using your file explorer, go inside the directory `RIMA-Backend`, rename the environment variable file from `.env.example` to `.env`

5. Open the `.env` file and add additional environment variables (contact the developers for the environment variables)

6. In the command prompt or terminal, type the following commands to install spacy and nltk packages. Do not close the command prompt or terminal after the last command

   - Download the spacy package

     ```
      python -m spacy download en
     ```

   - Download the necessary nltk packages

     ```
      python -c "import nltk;nltk.download('stopwords')" && python -c "import nltk;nltk.download('punkt')" && python -c "import nltk;nltk.download('sentiwordnet')"
     ```

7. Download and install Redis for [Windows](https://github.com/MicrosoftArchive/redis/releases/download/win-3.2.100/Redis-x64-3.2.100.msi) (Links to the installation instructions available: [MacOS](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) and [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04-de))

8. Download the [GloVe model](https://drive.google.com/file/d/1FfQgEjR6q1NyFsD_-kOdBCHMXB2QmNxN/view?usp=sharing) and copy the model inside the `RIMA-Backend`

9. In the command prompt to create the database

   ```
   python manage.py migrate
   ```

10. Run the django server and do not close it

    ```
    python manage.py runserver
    ```

11. Open a new command prompt with admin rights or terminal

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
