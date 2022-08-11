help:
	@cat $(MAKEFILE_LIST) | docker run --rm -i xanders/make-help

# Clean, rebuild and run
all: clean build run

##
## Run the application locally
##

# Start all containers
run: stop
	@docker compose up --force-recreate

# Start all containers using development config
dev: stop
	@docker compose -f docker-compose.yml -f docker-compose-dev.yml up --force-recreate

stop:
	@docker compose down

# Remove services, volumes, and locally built images
clean:
	@docker compose down --volumes --remove-orphans --rmi local

# Remove services, volumes, and all images
cleanall:
	@docker compose down --volumes --remove-orphans --rmi all

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

.PHONY: help all run clean cleanall build push k8s-dev k8s-prod
