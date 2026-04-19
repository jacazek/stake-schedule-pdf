import json
import csv

def update_unit_schedule_with_speakers(json_file_path, csv_file_path):
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

            if unit_id not in unit_map:
                unit_map[unit_id] = {
                    'id': unit_id,
                    'name': row['Unit_display'],
                    'eqpMeetings': [],
                    'leaderMeetings': [],
                    'leaderType': None
                }
                units.append(unit_map[unit_id])

            
            # Check if this unit exists in our units data
            if unit_id in unit_map:
                # Use Who column for name instead of Full_name
                speaker_name = row['Who']
                date_value = row['Date']
                
                # Create speaker object
                speaker = {
                    "name": speaker_name,
                    "date": date_value
                }
                
                # Add to stakeCouncilSpeakers array
                if 'stakeCouncilSpeakers' not in unit_map[unit_id]:
                    unit_map[unit_id]['stakeCouncilSpeakers'] = []
                
                unit_map[unit_id]['stakeCouncilSpeakers'].append(speaker)
    
    # Write updated data back to JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(units, json_file, indent=2)
    
    print(f"Updated {len(units)} units with speaker information")

# Run the update
if __name__ == "__main__":
    update_unit_schedule_with_speakers('data/output/unit-schedule.json', 'data/speaker-data/speaking-assignments.csv')