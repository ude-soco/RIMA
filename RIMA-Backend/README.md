# RIMA-A Transparent Recommendation and Interest Modeling Application
This is the backend of the RIMA web application.

## Before running the application:

Please download word embedding model[(GloVe)](https://drive.google.com/file/d/1FfQgEjR6q1NyFsD_-kOdBCHMXB2QmNxN/view?usp=sharing) .

Please put the model file in the root directory of this folder.


## Steps to run application using Docker for Mac/Linux users:

**Step 1 Install Docker**

Install Docker from https://docs.docker.com/get-docker/

Please make sure you have at least 10GB free space in your disk.

**Step 2 Using docker-compose to run the app**

If you are running the app for the first time, run following command to build the and run:

```
docker-compose --compatibility up --build
```
for subsequent runs:

to start the server, you can run `docker-compose up`

to stop the server, you can run `docker-compose down`

**Step 3 Check if the backend already start successfully**

For checking that the backend part is working, type the following link in the browser: `127.0.0.1:8000`, it should take 10 to 15 min to load (because of the Glove model). You can also check the API docs via `127.0.0.1:8000/docs`.

## Steps to run application using Docker for Windows users:

**Step 1 Install Docker**

Install Docker from https://docs.docker.com/get-docker/
Please make sure you have at least 10GB free space in your disk.

**Step 2 Enable Hyper-V**

1. Right click on the Windows button and select ‘Apps and Features’.
2. Select Programs and Features on the right under related settings.
3. Select Turn Windows Features on or off.
4. Select Hyper-V and click OK.

(optional): if above steps don't work, try using following command(refer this [link](https://stackoverflow.com/questions/39684974/docker-for-windows-error-hardware-assisted-virtualization-and-data-execution-p)):
```
bcdedit /set hypervisorlaunchtype auto
```

**Step 3 Formatting file**

Open `start.sh` file using [Notepad++](https://notepad-plus-plus.org/), click edit tab, choose EOL conversion then select UNIX/OSX Format.

**Step 4 Using docker-compose to run the app**

If you are running the app for the first time, run following command to build the and run:

```
docker-compose --compatibility up --build
```
for subsequent runs:

to start the server, you can run `docker-compose up`

to stop the server, you can run `docker-compose down`

**Step 5 Check if the backend already start successfully**

For checking that the backend part is working, type the following link in the browser: `127.0.0.1:8000`, it should take 10 to 15 min to load (because of the Glove model). You can also check the API docs via `127.0.0.1:8000/docs`.


