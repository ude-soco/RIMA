# syntax=docker/dockerfile:1.6
FROM python:3.11-slim

ENV APT_PACKAGES "make wget unzip"
RUN --mount=type=cache,sharing=private,target=/var/cache/apt \
    --mount=type=cache,sharing=private,target=/var/lib/apt <<EOF
  rm -f /etc/apt/apt.conf.d/docker-clean
  echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
  DEBIAN_FRONTEND=noninteractive apt-get update -q &&
  apt-get install -qq --no-install-recommends -o=Dpkg::Use-Pty=0 $APT_PACKAGES
EOF

RUN adduser --disabled-login --gecos "" -u 101 app
USER 101
WORKDIR /home/app

ENV  PYTHONUNBUFFERED 1
ENV  PATH "$PATH:/home/app/.local/bin"
COPY Pipfile* .
RUN  pip install --no-color --quiet --no-cache-dir --user pipenv && \
     pipenv install --system --deploy

COPY --link --chown=101 . ./

EXPOSE 8080
CMD ["bin/download"]
