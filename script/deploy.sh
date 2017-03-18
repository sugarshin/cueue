#!/bin/bash

set -eu

COMMIT=$(git rev-parse --short HEAD)
BRANCH=gh-pages
GIT_URL=$(git remote get-url origin)
DIR=demo

rm -rf $DIR;
(git clone $GIT_URL -b $BRANCH $DIR || (git init $DIR && cd $DIR && git remote add origin $GIT_URL && git checkout -b $BRANCH))
rm -rf ${DIR}/*
cp -R ${DIR}/../demo/public/* $DIR
cd $DIR
git add -A
git commit -m \"Built artifacts of ${COMMIT} [ci skip]\"
git push origin $BRANCH
