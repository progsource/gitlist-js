#! /bin/sh
docker run -it --rm -p 127.0.0.1:8090:80 -v `pwd`:/data -w /data --rm dockerfile/nodejs-bower-gulp:latest bash
