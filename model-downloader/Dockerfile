# syntax=docker/dockerfile:1.6
# hadolint global ignore=DL3008
FROM python:3.12-slim

ENV BUILD_DEPS "build-essential"
ENV RUNTIME_DEPS "make wget unzip"
RUN --mount=type=cache,sharing=private,target=/var/cache/apt \
    --mount=type=cache,sharing=private,target=/var/lib/apt <<EOF
  rm -f /etc/apt/apt.conf.d/docker-clean
  echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
  DEBIAN_FRONTEND=noninteractive apt-get update -q &&
  apt-get install -qq --no-install-recommends -o=Dpkg::Use-Pty=0 $BUILD_DEPS $RUNTIME_DEPS
EOF

RUN adduser --disabled-login --gecos "" -u 101 app
USER 101
WORKDIR /home/app

ENV  PYTHONUNBUFFERED 1
ENV  PATH "$PATH:/home/app/.local/bin"

# Install Python dependencies
COPY Pipfile* .
RUN  pip install --no-color --quiet --no-cache-dir --user pipenv==2023.9.8 && \
     pipenv install --system --deploy

# Clean up build dependencies
USER root
RUN  apt-get purge -y --auto-remove $BUILD_DEPS
USER 101

COPY --link --chown=101 . ./

EXPOSE 8080
CMD ["bin/download"]
