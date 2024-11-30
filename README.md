# My Web Portfolio

This repository contains the Web Portfolio for the hosted applications. The Web Portfolio is written in Vite within a NodeJS mail server. These services are designed to be integrated within a Docker Swarm instance to serve my personal web portfolio.

* [Design](#design)
* [Prerequisites](#prerequisites)
* [Usage](#usage)
* [Pre-Merge Checklist](#pre-merge-checklist)

## Design
<p align="center">
 <img src="./docs/Web-Portfolio.jpg" style="display: block; margin: 0 auto">
</p>

<br/>

This web portfolio runs an Nginx web server to host the static files within a docker container. The docker-compose file is meant to be used within a docker-swarm instance.

## Prerequisites
* NodeJS
* NGINX

## Usage

This web portfolio uses a NodeJS mail server which you must configured to send emails. 

* Read name `.env.config.example` to `.env.config` and update PORT value if needed
* Read name  `.env.secret.example` to `.env.secret` and provide the

  ```
  # Email server
  SERVICE="yahoo"
  
  # Sender's email address
  EMAIL_USER="example@yahoo.com"

  # Email Application Password
  EMAIL_PASS="mypassword"

  # Recipient's email address
  FORWARD_EMAIL_USER="myemail@yahoo.com"
  ```

### Running Dev Locally
1. Open a terminal shell and run `make start-server-dev`
2. Open a second terminal and run  `start-portfolio-dev`
3. Access web portfolio via `http://localhost:4000`

### Running Docker Swarm Locally
1. Build the mock server with `make build-mock-server`
2. Start mock server with `make start-mock-server`
3. Access web portfolio via `http://localhost`

NOTE: The above steps will simulate a remote server. An entrypoint.sh script will initialize Docker Swarm, create networks, secrets, configs, build images and start the web portfolio services. The application should be accessible via port 80.

## Pre-Merge Checklist
* Update [Portfolio VERSION](./portfolio/VERSION) or [Mail Server VERSION](./mail-server/VERSION)
* Update [Porfolio CHANGELOG.md](./portfolio/CHANGELOG.md) or [Mail Server CHANGELOG.md](./mail-server/CHANGELOG.md)