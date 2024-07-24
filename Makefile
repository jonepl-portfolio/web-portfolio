ifndef DOCKER_USERNAME
  ifneq (,$(wildcard .env))
    include .env
    export $(shell sed 's/=.*//' .env)
  endif

  ifndef DOCKER_USERNAME
    $(error DOCKER_USERNAME is not set. Please set it in the environment or in the .env file)
  endif
endif

build-image:
	docker build -t $(DOCKER_USERNAME)/web-portfolio:latest .
	docker image prune -f

run-container:
	docker-compose up -d

start-container: run-container

stop-container:
	docker-compose down

destroy-container: stop-container