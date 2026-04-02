FROM ubuntu:latest
LABEL authors="wuwan"

ENTRYPOINT ["top", "-b"]