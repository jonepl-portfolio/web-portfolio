# My Web Portfolio

## Design
<p align="center">
 <img src="./docs/Web-Portfolio.png" style="display: block; margin: 0 auto">
</p>

<br/>

This web portfolio runs an Nginx web server to host the static files within a docker container. The docker-compose file is meant to be used within a docker-swarm instance.

## Usage

- `npm run build` builds the project - this builds assets, HTML, JS, and CSS into `dist`
- `npm run serve:dev` runs the project, launches a live preview in your default browser, and watches for changes made to files in `src`
- `npm run serve:dist` runs the project, launches a live preview in your default browser, and watches for changes made to files in `dist`

# Deployment
- Ensure you have the latest dist folder build before creating an image

## Bugs and Issues

See [Bugs and Issues](bugs-&-issues.md)