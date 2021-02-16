build:
	@docker-compose build --parallel

all: build

.PHONY: build
