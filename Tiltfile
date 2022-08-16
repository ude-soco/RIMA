docker_compose(["./docker-compose.yml", "./docker-compose-dev.yml"])

dc_resource("frontend-web", labels=["Frontend"])
dc_resource("backend-db", labels=["Backend"])
dc_resource("backend-redis", labels=["Backend"])
dc_resource("backend-api", labels=["Backend"])
dc_resource("backend-worker", labels=["Backend"])
dc_resource("model-downloader", labels=["Model"])
dc_resource("model-server", labels=["Model"])
