# RIMA

A transparent Recommendation and Interest Modeling Application

Developed by ... at ... for ... since ...


## Components

* RIMA-Backend
  * api: Django (Python) HTTP api, serving ...
  * worker: Celery (Python) job queue, doing ...
  * db: PostgreSQL database, used for ...
  * redis: Redis key-value cache, used for ...
* RIMA-Frontend
  * web: User-facing React (Node.js) UI, offering ...
* model:
  * downloader: Bash, fetches GloVe model from Google Drive
  * server: nginx, serves GloVe model to RIMA-Backend via HTTP


## Official builds and deployments

### Container images

* Backend: [socialcomputing/rima-backend](https://hub.docker.com/repository/docker/socialcomputing/rima-backend)
* Frontend: [socialcomputing/rima-frontend](https://hub.docker.com/repository/docker/socialcomputing/rima-frontend)
* Model Downloader: [socialcomputing/rima-model-downloader](https://hub.docker.com/repository/docker/socialcomputing/rima-model-downloader)

### Live instances

* Preview: [edge.rima.soco.inko.cloud](https://edge.rima.soco.inko.cloud/) ([branch `master`](https://github.com/ude-soco/CourseMapper-webserver/tree/master))


## Run on Docker

* Production: `docker-compose up -f docker-compose.yml` (see `Makefile`)
* Development: `tilt up`


## Run on Kubernetes

* see `./.k8s/README.md`


## Development setup

* see `./RIMA-Backend/README.md` and `./RIMA-Frontend/README.md`


## Citations

* (Bibtex)


## Contributing
