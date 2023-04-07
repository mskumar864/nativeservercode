#!/usr/bin/env bash

curl -v -X POST http://localhost:8080/access_tokens \
    -H 'Content-Type: application/json'
