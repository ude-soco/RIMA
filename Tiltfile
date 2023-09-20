docker_compose(["./docker-compose.yml", "./docker-compose-dev.yml"])

dc_resource("frontend-web", labels = ["Frontend"])
dc_resource("backend-db", labels = ["Backend"])
dc_resource("backend-redis", labels = ["Backend"])
dc_resource("backend-api", labels = ["Backend"])
dc_resource("backend-worker", labels = ["Backend"])
dc_resource("model-downloader", labels = ["Model"])
dc_resource("model-server", labels = ["Model"])

docker_build('rima-model-downloader', './model-downloader')

docker_build('rima-model-server', './model-server')

docker_build('rima-rima-frontend', './RIMA-Frontend',
  dockerfile = './RIMA-Frontend/Dockerfile-dev',
  live_update = [
    fall_back_on(['./RIMA-Frontend/nodejs/jsconfig.json']),
    sync('./RIMA-Frontend/nodejs', '/app'),
    run('cd /app && npm install', trigger = ['./package.json', './package-lock.json']),
    restart_container()
  ]
)

docker_build('rima-rima-backend', './RIMA-Backend',
  live_update = [
    fall_back_on(['./RIMA-Backend/Dockerfile']),
    sync('./RIMA-Backend', '/home/app'),
    run('cd /home/app && pipenv install', trigger = './RIMA-Backend/Pipfile'),
    restart_container()
  ]
)
