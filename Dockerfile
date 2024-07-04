FROM node:latest

# https://github.com/nodejs/docker-node/issues/289
# RUN groupadd --gid 1000 foo \
# && useradd --uid 1000 --gid foo --shell /bin/bash --create-home foo

USER 1000

WORKDIR /home/foo/project
