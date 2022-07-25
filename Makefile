help:
	@cat $(MAKEFILE_LIST) | docker run --rm -i xanders/make-help

# Clean, rebuild and run
all: clean build run

##
## Run the application locally
##

# Start all containers
run:
	@docker compose up --force-recreate

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
dev:
	@kubectl apply -k .k8s/dev

# Deploy prod overlay
prod:
	@kubectl apply -k .k8s/prod

.PHONY: help all run clean cleanall build push dev prod
