<p align="center">
<a href="https://rima.sc.inko.cloud/" target="_blank" rel="noopener noreferrer">
<img height="120px" src="RIMA-Frontend/nodejs/public/images/rimaLogo.svg" alt="re-frame logo">
</a>
</p>

# RIMA

A transparent Recommendation and Interest Modeling Application

Developed by ... at ... for ... since ...

## Components

- RIMA-Backend
  - api: Django (Python) HTTP api, serving ...
  - worker: Celery (Python) job queue, doing ...
  - db: PostgreSQL database, used for ...
  - redis: Redis key-value cache, used for ...
- RIMA-Frontend
  - web: User-facing React (Node.js) UI, offering ...
- model:
  - downloader: Python, fetches GloVe model from Google Drive
  - server: nginx, serves GloVe model to RIMA-Backend via HTTP

## Official builds and deployments

### Container images

- [RIMA-Backend](https://hub.docker.com/repository/docker/inko/soco-rima-backend)
- [RIMA-Frontend](https://hub.docker.com/repository/docker/inko/soco-rima-frontend)
- [model-downloader](https://hub.docker.com/repository/docker/inko/soco-rima-model-downloader)

### Live deployments

- [Development](https://rima-dev.sc.inko.cloud/)
- [Production](https://rima.sc.inko.cloud/)

## Run on Docker Compose

- docker-compose up

## Run on Kubernetes

- see `./.k8s/README.md`

## Development setup

- see `./RIMA-Backend/README.md` and `./RIMA-Frontend/README.md`

## Citations

- (Bibtex)

## Contributing
