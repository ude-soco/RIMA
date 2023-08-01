# syntax=docker/dockerfile:1.5
FROM python:3.9-slim AS python

# Install dependencies
ENV BUILD_DEPS "build-essential pkg-config gfortran libpq-dev default-libmysqlclient-dev liblapack-dev libblas-dev libatlas-base-dev"
ENV RUNTIME_DEPS "nginx curl wget libblas3 liblapack3 "
RUN --mount=type=cache,target=/var/cache/apt,rw --mount=type=cache,target=/var/lib/apt,rw <<EOF
  DEBIAN_FRONTEND=noninteractive apt-get update -q &&
  apt-get install -qq --no-install-recommends -o=Dpkg::Use-Pty=0 $BUILD_DEPS $RUNTIME_DEPS
EOF

# Link web server log files to devices
RUN ln -sf /dev/stdout /var/log/nginx/access.log &&\
    ln -sf /dev/stderr /var/log/nginx/error.log

# Set up application user and directories
RUN adduser --disabled-login --gecos "" -u 1000 app
USER 1000
WORKDIR /home/app

# Configure Python environment
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIPENV_VENV_IN_PROJECT 1
ENV PIPENV_VERBOSITY -1
ENV VIRTUAL_ENV=/home/app/.venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install Python dependencies
COPY --chown=app:app Pipfile* .
RUN  --mount=type=cache,target=/home/app/.cache/pip,uid=1000 --mount=type=cache,target=/home/app/.cache/pipenv,uid=1000 <<EOF
  pip install --no-color pipenv &&
  pipenv install --deploy
EOF

# Clean up build dependencies
USER root
RUN  apt-get purge -y --auto-remove $BUILD_DEPS
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
