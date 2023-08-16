# syntax=docker/dockerfile:1.6
FROM --platform=linux/amd64 python:3.7-slim AS python

# Install dependencies
ENV BUILD_DEPS "build-essential pkg-config python3-dev gfortran default-libmysqlclient-dev liblapack-dev libblas-dev libatlas-base-dev"
ENV RUNTIME_DEPS "nginx curl wget libblas3 liblapack3 libpq-dev default-jre"
# RUN --mount=type=cache,sharing=private,target=/var/cache/apt \
#     --mount=type=cache,sharing=private,target=/var/lib/apt <<EOF
#   rm -f /etc/apt/apt.conf.d/docker-clean
#   echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
#   DEBIAN_FRONTEND=noninteractive apt-get update -q &&
#   apt-get install -qq --no-install-recommends -o=Dpkg::Use-Pty=0 $BUILD_DEPS $RUNTIME_DEPS
# EOF

RUN rm -f /etc/apt/apt.conf.d/docker-clean && \
    echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache && \
    DEBIAN_FRONTEND=noninteractive apt-get update -q && \
    apt-get install -qq --no-install-recommends -o=Dpkg::Use-Pty=0 $BUILD_DEPS $RUNTIME_DEPS

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
# RUN  --mount=type=cache,sharing=private,target=/home/app/.cache/pip,uid=1000 \
#      --mount=type=cache,sharing=private,target=/home/app/.cache/pipenv,uid=1000 <<EOF
#   pip install --no-color pipenv &&
#   pipenv install --deploy
# EOF

RUN pip install --no-color pipenv && \
    ipenv install --deploy

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
