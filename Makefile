all: clean build up

up:
	@docker-compose up --force-recreate

build:
	@docker-compose build --parallel

clean:
	@docker-compose down --volumes --remove-orphans --rmi local

push:
	@docker-compose push

.PHONY: up build clean push all
