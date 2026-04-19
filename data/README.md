# Data Processing Scripts and Mappers

This directory contains scripts and mappers for processing data from various CSV files into structured JSON output for the Durham Stake schedule application.

## Transform Scripts

### `speaker-transform.sh`
Shell script that processes speaker data by:
1. Backing up the existing speaker schedule JSON file
2. Running the speaker CSV to JSON converter

### `unit-transform.sh`
Shell script that processes unit data by:
1. Backing up the existing unit schedule JSON file
2. Running multiple Python mappers in sequence:
   - Unit ministering CSV to JSON converter
   - Unit speaker mapping
   - Unit conference date mapping
   - Unit presidency speaker mapping
   - Unit provide speaker mapping

## Python Mappers

### `speaker-csv-to-json.py`
Converts speaker data from CSV files (`org-pres-councilor-interviews.csv` and `speaking-assignments.csv`) into a unified JSON format containing:
- Speaker interviews
- Speaking assignments
- Speaker identification information

### `unit-ministering-csv-to-json.py`
Processes unit ministering data from `bp-eqp-ministering.csv` to create:
- Unit meeting records (EQP and leader meetings)
- Leader type identification
- Meeting details including date, location, and participants

### `unit-speaker-map.py`
Maps speaker assignments from `speaking-assignments.csv` to units, adding:
- Stake council speaker information to units

### `unit-conference-map.py`
Adds conference dates to units from `unit_conferences.csv`:
- Conference date information for each unit

### `unit-presidency-speaker-map.py`
Maps presidency speakers to units from `presidency_speaking.csv`:
- Monthly presidency speaker assignments for each unit

### `unit-provide-speaker-map.py`
Manages speaker providing/receiving assignments:
- Identifies units that provide speakers to ROX and ERS
- Tracks speaker assignments for receiving units