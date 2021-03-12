all: clean build up

up:
	@docker-compose up --force-recreate

down:
	@docker-compose down

build:
	@docker-compose build --parallel

clean:
	@docker-compose down --volumes --remove-orphans --rmi local

push:
	@docker-compose push

k8s:
	@kubectl apply -k .k8s/dev
	@kubectl apply -k .k8s/prod

.PHONY: up build clean push all
