#!/usr/bin/env bash
NOW=$(date +"%d%m%Y-%T")

# Backup the previous if exists
FILE="data/output/unit-schedule.json"
if [ -f "$FILE" ]; then
    mv $FILE "data/output/unit-schedule-$NOW.json"
fi
python3 data/mappers/unit-ministering-csv-to-json.py
python3 data/mappers/unit-speaker-map.py
python3 data/mappers/unit-conference-map.py
python3 data/mappers/unit-presidency-speaker-map.py
python3 data/mappers/unit-provide-speaker-map.py