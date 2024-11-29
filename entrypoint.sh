#!/bin/bash
APP_WORKING_DIR="/srv/app"
MAIL_SERVER_DIR="$APP_WORKING_DIR/mail-server"
PORTFOLIO_DIR="$APP_WORKING_DIR/portfolio"
ENV_CONFIG="$APP_WORKING_DIR/app-scripts/.env"
CURRENT_DIR=$(pwd)

log_message() {
    local level="$1"
    local message="$2"
    echo "$(date '+%Y-%m-%d %H:%M:%S') [$level] $message"
}

start_docker_daemon() {
    exec /usr/local/bin/dockerd-entrypoint.sh "$@"
}

wait_for_docker() {
    echo "Waiting for Docker daemon to be ready..."
    while ! docker info >/dev/null 2>&1; do
        echo "Docker is not ready yet. Retrying in 2 seconds..."
        sleep 2
    done
    echo "Docker is ready!"
}

initialize_swarm() {
    if ! docker info | grep -q "Swarm: active"; then
        log_message "INFO" "Docker Swarm is not initialized. Initializing now..."
        docker swarm init
    else
        log_message "INFO" "Docker Swarm is already initialized."
    fi
}

create_network() {
    if ! docker network ls | grep -q "portfolio-network"; then
        log_message "INFO" "Creating Docker overlay network 'portfolio-network'..."
        docker network create --driver overlay --attachable portfolio-network
    else
        log_message "INFO" "Docker overlay network 'portfolio-network' already exists."
    fi
}

create_secret() {
    if ! docker secret ls | grep -q "mail_server_secret"; then
        log_message "INFO" "Creating Docker secret 'mail_server_secret'..."
        docker secret create mail_server_secret $MAIL_SERVER_DIR/.env.local.secret
    else
        log_message "INFO" "Docker secret 'mail_server_secret' already exists."
    fi
}

create_config() {
    if ! docker config ls | grep -q "mail_server_config"; then
        log_message "INFO" "Creating Docker config 'mail_server_config'..."
        docker config create mail_server_config $MAIL_SERVER_DIR/.env.local.config
    else
        log_message "INFO" "Docker config 'mail_server_config' already exists."
    fi
}

build_images() {
    log_message "INFO" "Building Docker images..."
    docker build -f $PORTFOLIO_DIR/Dockerfile -t web-portfolio:latest $PORTFOLIO_DIR
    docker build -f $MAIL_SERVER_DIR/Dockerfile -t mail-server $MAIL_SERVER_DIR
}

start_services() {
    log_message "INFO" "Deploying web portfolio to hosted-apps stack..."
    docker stack deploy -c $APP_WORKING_DIR/docker-compose.local.yml hosted-apps
}

wait_for_docker

build_images

initialize_swarm

create_network

create_secret

create_config

start_services

log_message "INFO" "Deployment complete."
