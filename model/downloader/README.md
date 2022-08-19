# Model Downloader

This is a script for fetching model files required by the main application from remote locations and storing them locally. The reason for this is to allow multiple application instances to launch, possibly within a short timespan, without re-downloading data via slow connections and/or triggering rate limits.

## Usage

*Model Downloader* is configured using the following required environment variables:

| Variable                | Purpose                        |
|------------------------ | ------------------------------ |
| MODEL_PATH              | Destination (directory)        |
| GLOVE_MODEL_GDRIVE_ID   | Source (Google Drive id)       |
| GLOVE_MODEL_FILE        | Destination (file name) |


## Possible usage patterns

* Running *Model Downloader* manually to fetch model files on a development machine
* Running *Model Downloader* as an init container, storing the data on a volume shared with the main app
* Running *Model Downloader* and serving the data via HTTP (see `/docker-compose.yaml` for an example)
