build-image:
	docker build -t jonepl/web-portfolio:latest .
	docker image prune -f

run-container:
	docker-compose up -d

start-container: run-container

stop-container:
	docker-compose down

destroy-container: stop-server