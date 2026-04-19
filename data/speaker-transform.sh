#!/usr/bin/env bash
NOW=$(date +"%d%m%Y-%T")

# Backup the previous if exists
FILE="data/output/speaker-schedule.json"
if [ -f "$FILE" ]; then
    mv $FILE "data/output/speaker-schedule-$NOW.json"
fi

python3 data/mappers/speaker-csv-to-json.py
