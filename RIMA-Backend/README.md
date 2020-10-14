# RIMA- a transparent Recommendation and Interest Modeling Application
This is the backend of the RIMA web application.

## Before running the application:

**Step 1:**  Download word embedding model [(GloVe)](https://drive.google.com/file/d/1FfQgEjR6q1NyFsD_-kOdBCHMXB2QmNxN/view?usp=sharing) 

**Step 2:** Put the model file in the root directory of this folder

**Step 3 (For Windows users):** 
- Open `start.sh` file in the backend folder using [Notepad++](https://notepad-plus-plus.org/) 
- Click **edit** tab, choose **EOL conversion** then select **UNIX/OSX** format
- Save it 

<br>
<br>

## Installation guide to run the application using Docker for **Mac/Linux** users:

**Step 1 Install Docker**

- Install Docker from https://docs.docker.com/get-docker/

- Make sure that there is at least 10GB free space available


**Step 2 Use docker-compose to run the app**

- For the first time, run the following command to build and run the application:

```
docker-compose --compatibility up --build
```
- For subsequent runs:

    - To start the server, run `docker-compose up`

    - To stop the server,  run `docker-compose down`

**Step 3 Check if the backend already start successfully**

- For checking that the backend part is working, run the API docs via `127.0.0.1:8000/docs`

<br>
<br>
<br>

## Installation guide to run the application using Docker for **Windows** users:

### Requirements: 
- Any Windows version except windows Home
- Virtualisation should be enable in BIOS setup
- At least 10GB free space in your disk

**Step 1 Install Docker**

- Install Docker from https://docs.docker.com/get-docker/


**Step 2 Enable Hyper-V**

- Right click on the Windows button and select **‘Apps and Features’**
- Select **Programs and Features** on the right under **related settings**
- Select **Turn Windows Features on or off**
- Select **Hyper-V** and click OK
<br> <br>
- **(optional)**: if above steps don't work, try using following command (refer this [link](https://stackoverflow.com/questions/39684974/docker-for-windows-error-hardware-assisted-virtualization-and-data-execution-p)):
```
bcdedit /set hypervisorlaunchtype auto
```



**Step 3 Use docker-compose to run the app**

- For the first time, run the following command to build and run the application:

```
docker-compose --compatibility up --build
```
- For subsequent runs:

    - To start the server, run `docker-compose up`

    - To stop the server, run `docker-compose down`

**Step 4 Check if the backend already start successfully**

- For checking that the backend part is working, run the API docs via `127.0.0.1:8000/docs`

<br>
<br>
<br>

## Django admin Panel

- In the browser, run the following URL `127.0.0.1:8000/admin`  
- Set the default user account to superuser account

    - **Username:** admin_user

    - **Password:** admin

- In the admin page, all the data models can be managed, and a celery task can be triggered manually 


