start-server-dev:
	npm --prefix mail-server/ run dev

start-portfolio-dev:
	npm --prefix portfolio/ run dev

build-mock-server:
	docker build -f local-server/Dockerfile.local -t mock-server:latest .

start-mock-server:
	docker compose -f local-server/docker-compose.server.yml up -d
	# Wait for dockerd to be ready
	until docker exec mock-server docker info > /dev/null 2>&1; do \
		echo "Waiting for Docker daemon in mock-server to be ready..."; \
		sleep 2; \
	done
	# Run the entrypoint script
	docker exec mock-server /srv/app/entrypoint.sh

stop-mock-server:
	docker compose -f local-server/docker-compose.server.yml down
