help:
	@cat $(MAKEFILE_LIST) | docker run --rm -i --platform linux/amd64 xanders/make-help

##
## Run container images locally
##

compose     = docker compose -f compose.yaml
compose-dev = docker compose -f compose.yaml -f compose-dev.yaml

# Clean, rebuild and run
all: clean build run

# Start all services for development
dev:
	@$(compose-dev) up
	@$(compose-dev) down

# Start all services for development using Tilt for live container updates
tilt:
	@tilt up
	@$(compose-dev) down

# Start all services using regular configuration
run: stop
	@$(compose) up --force-recreate

start: run
up: run

# Download all required data using Model Downloader
model:
	@$(compose) run model-downloader

# Stop all services
stop:
	@$(compose) down

down: stop

# Remove services, volumes, and locally built images
clean:
	@$(compose) down --volumes --remove-orphans --rmi local

# Remove services, volumes, and all images
cleanall:
	@$(compose) down --volumes --remove-orphans --rmi all

# Build all container images
build: lint
	@$(compose) build

# Push container images to remote registry
push: build
	@$(compose) push


##
## Test the application
##

# Check Dockerfile for best practices
lint:
	# Linting model-downloader ...
	@docker run --quiet --rm -i hadolint/hadolint < model-downloader/Dockerfile
	# Linting model-server ...
	@docker run --quiet --rm -i hadolint/hadolint < model-server/Dockerfile
	# Linting RIMA-Backend ...
	@docker run --quiet --rm -i hadolint/hadolint < RIMA-Backend/Dockerfile
	# Linting RIMA-Frontend ...
	@docker run --quiet --rm -i hadolint/hadolint < RIMA-Frontend/Dockerfile


.PHONY: help all dev tilt run start up model stop down clean cleanall build push lint
