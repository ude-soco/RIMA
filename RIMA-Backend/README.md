Steps to run using docker compose for the first time

```
export TWITTER_CONSUMER_KEY="q3tv2FEcuhreRWO4WYtSAyJAj"
export TWITTER_CONSUMER_SECRET="vxrXdz8TpiQQhQv7GSHMBliGQoMzGPNMdUpcVercmCYb8UqvzF"
export TWITTER_ACCESS_TOKEN="1106978050850328578-2HjYKtDlRU3J88emRjV4TmkUapeJWl"
export TWITTER_ACCESS_TOKEN_SECRET="doG0kjyHoD4tGBUnKTneUDZjUD392dRR3z8PwTJ2Autwm"
export TWITTER_FETCH_DAYS=180

docker-compose --compatibility up --build
```


for subsequent runs

to start the server run `docker-compose up`

to stop the server run `docker-compose down`