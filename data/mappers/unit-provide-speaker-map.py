import json
import csv

def add_speaker_assignments_to_units(json_file_path, csv_file_path):
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
            month = row['Month']
            
            # Convert month to number (January=1, February=2, etc.)
            months = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December']
            month_num = months.index(month) + 1
            date_str = f"{month_num}/1/2026"
            
            # # If this unit is one of the receiving units (ROX or ERS)
            # if unit_id in ['ROX', 'ERS']:
            #     # Add to receivingSpeakers for this unit
            #     if 'receivingSpeakers' not in unit_map[unit_id]:
            #         unit_map[unit_id]['receivingSpeakers'] = []
                
            #     speaker = {
            #         "name": unit_id,
            #         "date": date_str
            #     }
                
            #     unit_map[unit_id]['receivingSpeakers'].append(speaker)
            # else:
            # For other units, add to providingSpeakers
            if 'providingSpeakers' not in unit_map[unit_id]:
                unit_map[unit_id]['providingSpeakers'] = []
            
            speaker = {
                "name": "ERS, ROX",
                "date": date_str
            }
            
            unit_map[unit_id]['providingSpeakers'].append(speaker)
            
            # Also add to receivingSpeakers for ROX and ERS units
            for target_unit in ['ROX', 'ERS']:
                if 'receivingSpeakers' not in unit_map[target_unit]:
                    unit_map[target_unit]['receivingSpeakers'] = []
                
                # Check if this speaker assignment already exists
                exists = any(
                    speaker['name'] == unit_id and speaker['date'] == date_str
                    for speaker in unit_map[target_unit]['receivingSpeakers']
                )
                
                if not exists:
                    speaker = {
                        "name": unit_id,
                        "date": date_str
                    }
                    
                    unit_map[target_unit]['receivingSpeakers'].append(speaker)
    
    # Write updated data back to JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(units, json_file, indent=2)
    
    print(f"Updated {len(units)} units with speaker assignment information")

# Run the update
if __name__ == "__main__":
    add_speaker_assignments_to_units('data/output/unit-schedule.json', 'data/unit-data/unit_provide_speakers.csv')