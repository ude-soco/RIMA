help:
	@cat $(MAKEFILE_LIST) | docker run --rm -i xanders/make-help

# Clean, rebuild and run
all: clean build run

##
## Run the application locally
##

compose = docker compose -f docker-compose.yml -f docker-compose-dev.yml

# Start all containers
run: stop
	@$(compose) up --force-recreate

start: run
up: run

stop:
	@$(compose) down

down: stop

# Remove services, volumes, and locally built images
clean:
	@$(compose) down --volumes --remove-orphans --rmi local

# Remove services, volumes, and all images
cleanall:
	@$(compose) down --volumes --remove-orphans --rmi all

# Download all required data using Model Downloader
model:
	@$(compose) run model-downloader

##
## Build container images locally
##

# Build all container images
build:
	@docker buildx bake --progress=plain

# Push container images to remote registry
push:
	@docker compose push

##
## Deploy the application to Kubernetes
##

# Deploy dev overlay
k8s-dev:
	@kubectl apply --wait -k .k8s/dev

# Deploy prod overlay
k8s-prod:
	@kubectl apply --wait -k .k8s/prod

.PHONY: help all run start up stop down clean cleanall model build push k8s-dev k8s-prod
