# Kubernetes manifests

## Usage

0. Copy an existing environment (e.g. `prod`) and modify to your liking
1. Copy `./*/configuration.env.example` to `./*/configuration.env` and fill in settings and secrets
2. Use Kustomize to build or apply (currently relies on outdated `kubectl`-provided version)


## Current environtments

* **prod**: all versions tagged 0.0.x
* **dev**: all tagged versions, including pre-releases
* **dev-alp**: all commits to the `dev-alp` branch
