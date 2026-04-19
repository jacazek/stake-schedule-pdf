import json
import csv

def add_presidency_speakers_to_units(json_file_path, csv_file_path):
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
            
            # Check if this unit exists in our units data
            if unit_id in unit_map:
                # Initialize presidency speakers array
                if 'stakePresidencySpeakers' not in unit_map[unit_id]:
                    unit_map[unit_id]['stakePresidencySpeakers'] = []
                
                # Process each month column
                months = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December']
                
                for i, month in enumerate(months):
                    speaker_name = row[month]
                    if speaker_name:  # If there's a speaker for this month
                        # Create date string (1st day of the month)
                        month_num = i + 1
                        date_str = f"{month_num}/1/2026"
                        
                        # Create speaker object
                        speaker = {
                            "name": speaker_name,
                            "date": date_str
                        }
                        
                        # Add to stakePresidencySpeakers array
                        unit_map[unit_id]['stakePresidencySpeakers'].append(speaker)
    
    # Write updated data back to JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(units, json_file, indent=2)
    
    print(f"Updated {len(units)} units with presidency speaker information")

# Run the update
if __name__ == "__main__":
    add_presidency_speakers_to_units('data/output/unit-schedule.json', 'data/unit-data/presidency_speaking.csv')