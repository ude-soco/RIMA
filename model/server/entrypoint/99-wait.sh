if [ ! -f /usr/share/nginx/html/.done ]
then
  echo "Waiting for Model Downloader to signal completion ..."
fi

while [ ! -f /usr/share/nginx/html/.done ]; do
  sleep 1;
done

echo "Model Server is starting to serve downloaded model files"
