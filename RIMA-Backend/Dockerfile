# syntax=docker/dockerfile:1.5
FROM python:3.7-slim AS python

# Install dependencies
ENV DEBIAN_FRONTEND noninteractive
RUN --mount=type=cache,target=/var/cache/apt,rw --mount=type=cache,target=/var/lib/apt,rw <<EOF
  apt-get update -q && apt-get install -qq --no-install-recommends -o=Dpkg::Use-Pty=0 \
      build-essential libpq-dev default-libmysqlclient-dev nginx curl wget \
      libblas3 liblapack3 liblapack-dev libblas-dev libatlas-base-dev
EOF

# Link web server log files to devices
RUN ln -sf /dev/stdout /var/log/nginx/access.log &&\
    ln -sf /dev/stderr /var/log/nginx/error.log

# Set up application user and directories
RUN adduser --disabled-login --gecos "" -u 1000 app
USER 1000
WORKDIR /home/app

# Install Python dependencies
ENV  PYTHONUNBUFFERED 1
ENV  PATH "$PATH:/home/app/.local/bin"
COPY --chown=app:app requirements.txt requirements.txt
RUN --mount=type=cache,target=/home/app/.cache/pip,uid=1000 pip install --no-color --user -r requirements.txt

# Clean up build dependencies
USER root
RUN apt-get purge -y --auto-remove build-essential
USER 1000

# Configure web server
COPY nginx.conf .
RUN  nginx -t -c $HOME/nginx.conf -g "pid $HOME/nginx.pid;"

# Add application and run setup tasks
COPY --chown=app:app . ./
RUN  python manage.py collectstatic --no-input

# Run web application
ENV GUNICORN_LOG_LEVEL info
EXPOSE 8080
CMD ["bin/api"]

# :TODO: Use WSGI and stuff?
# https://www.caktusgroup.com/blog/2017/03/14/production-ready-dockerfile-your-python-django-app/
