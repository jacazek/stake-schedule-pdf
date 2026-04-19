import json
import csv

def add_conference_dates_to_units(json_file_path, csv_file_path):
    # Read the JSON file
    with open(json_file_path, 'r') as json_file:
        units = json.load(json_file)
    
    # Create a mapping from unit_id to unit object for quick lookup
    unit_map = {unit['id']: unit for unit in units}
    
    # Read the CSV file
    with open(csv_file_path, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        
        # Process each row in the CSV
        for row in reader:
            unit_id = row['Unit_id']
            conference_date = row['Conference Date']
            
            # Check if this unit exists in our units data
            if unit_id in unit_map:
                # Add conference date to the unit
                unit_map[unit_id]['conferenceDate'] = conference_date
    
    # Write updated data back to JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(units, json_file, indent=2)
    
    print(f"Updated {len(units)} units with conference dates")

# Run the update
if __name__ == "__main__":
    add_conference_dates_to_units('data/output/unit-schedule.json', 'data/unit-data/unit_conferences.csv')