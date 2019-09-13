#!/bin/sh
echo if this does not wor then install:
echo pip install git-of-theseus
git-of-theseus-analyze .
git-of-theseus-survival-plot survival.json
git-of-theseus-stack-plot survival.json
git-of-theseus-stack-plot cohorts.json
git-of-theseus-stack-plot authors.json
git-of-theseus-stack-plot exts.json
