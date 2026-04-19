import csv
import json
from collections import defaultdict

def process_unit_data(csv_file_path):
    # Dictionary to store unit data
    units = {}
    
    # Read CSV file
    with open(csv_file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            unit_id = row['Unit_id']
            entity_id = row['Entity_id']
            entity_name = row['Entity_name']
            
            # Initialize unit if not exists
            if unit_id not in units:
                units[unit_id] = {
                    'id': unit_id,
                    'name': row['Unit_name'],
                    'eqpMeetings': [],
                    'leaderMeetings': [],
                    'leaderType': None
                }
            
            # Create meeting object
            meeting = {
                'date': row['Datetime'],
                'location': row['Location'],
                'member': row['SP Member']
            }
            
            # Add to appropriate meeting array
            if entity_id == 'EQP':
                units[unit_id]['eqpMeetings'].append(meeting)
            elif entity_id in ['Bishop', 'BP']:
                units[unit_id]['leaderMeetings'].append(meeting)
                # Set leader type if not already set
                if units[unit_id]['leaderType'] is None:
                    units[unit_id]['leaderType'] = entity_name
    
    # Convert dictionary to list
    result = list(units.values())
    
    return result

# Process the CSV and save to JSON
if __name__ == "__main__":
    units_data = process_unit_data('data/unit-data/bp-eqp-ministering.csv')
    
    # Save to JSON file
    with open('data/output/unit-schedule.json', 'w') as outfile:
        json.dump(units_data, outfile, indent=2)
    
    print("Processed units data saved to units_output.json")