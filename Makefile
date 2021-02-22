build:
	@docker-compose build --parallel

push:
	@docker-compose push

up:
	@docker-compose up --force-recreate

clean:
	@docker-compose down --volumes --remove-orphans --rmi local

all: clean build up

.PHONY: build push up clean all
