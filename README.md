# RIMA

A transparent Recommendation and Interest Modeling Application

Developed by ... at ... for ... since ...


## Official builds and deployments

### Live instances

* Production: [rima.soco.ude.systems](https://rima.soco.ude.systems/) (latest [release](https://github.com/ude-soco/RIMA/releases)) ![status](https://argocd.cluster.soco.ude.systems/api/badge?name=rima-prod)
* Preview: [edge.rima.soco.ude.systems](https://edge.rima.soco.ude.systems/) ([branch `master`](https://github.com/ude-soco/CourseMapper-webserver/tree/master)) ![status](https://argocd.cluster.soco.ude.systems/api/badge?name=rima-edge)
* Preview: [development.rima.soco.ude.systems](https://development.rima.soco.ude.systems/) ([branch `development`](https://github.com/ude-soco/CourseMapper-webserver/tree/development)) ![status](https://argocd.cluster.soco.ude.systems/api/badge?name=rima-development)

### Container images

* see [GitHub Packages](https://github.com/orgs/ude-soco/packages?repo_name=RIMA)


## Run on Docker

* Production: `docker-compose up -f docker-compose.yml` (see `Makefile`)
* Development: `tilt up`


## Run on Kubernetes

* see `./.k8s/README.md`


## Development setup

* see `./RIMA-Backend/README.md` and `./RIMA-Frontend/README.md`


## Application architecture

### Components

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


## Citations

* (Bibtex)


## Contributing
