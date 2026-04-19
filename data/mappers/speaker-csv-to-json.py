import csv
import json
from collections import defaultdict

def read_csv_file(file_path):
    """Read CSV file and return list of dictionaries"""
    data = []
    with open(file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data

def build_speaker_json():
    # Read both CSV files
    interviews_data = read_csv_file('data/speaker-data/org-pres-councilor-interviews.csv')
    assignments_data = read_csv_file('data/speaker-data/speaking-assignments.csv')
    
    # Create dictionary to store speaker data
    speakers = {}
    
    # Process interviews data
    for interview in interviews_data:
        speaker_id = interview['Speaker_id']
        if speaker_id not in speakers:
            speakers[speaker_id] = {
                'id': speaker_id,
                'name': interview['Full_name'],
                'tocName': interview['Organization'],
                'speakingAssignments': [],
                'ministeringInterviews': []
            }
        
        speakers[speaker_id]['ministeringInterviews'].append({
            'dateTime': interview['Datetime'],
            'location': interview['Location'],
            'note': interview["Note"],
        })
    
    # Process assignments data
    for assignment in assignments_data:
        speaker_id = assignment['Speaker_id']
        if speaker_id not in speakers:
            speakers[speaker_id] = {
                'id': speaker_id,
                'name': assignment['Full_name'],
                'tocName': assignment['Organization'],
                'speakingAssignments': [],
                'ministeringInterviews': []
            }
        
        speakers[speaker_id]['speakingAssignments'].append({
            'date': assignment['Date'],
            'unit': assignment['Unit_display'],
            'note': assignment['Unit_notes']
        })
    
    # Convert to list and sort by speaker ID
    result = sorted(list(speakers.values()), key=lambda x: x['id'])
    
    # Write to JSON file
    with open(f"data/output/speaker-schedule.json", 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, indent=2, ensure_ascii=False)
    
    print(f"Generated JSON with {len(result)} speakers")
    return result

if __name__ == "__main__":
    build_speaker_json()