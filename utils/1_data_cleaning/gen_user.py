"""Add application records to users by appending random email and hashed password"""
import pandas as pd
import random
import hashlib
import string

application_filename = '4_application.csv'
output_filename = 'user.csv'


columns = [
    'user_id', 'application_id', 'degree', 'term', 'decision',
    'gre_q', 'gre_v', 'gre_awa', 'gpa', 'status',
    'university', 'decision_date'
]

def random_string(length):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def hash_data(data):
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

application_df = pd.read_csv(application_filename, header=None, names=columns)

user_data = []

count = 0

for _, row in application_df.iterrows():
    username = random_string(10)
    email = f"{username.lower()}@gmail.com"
    
    password = hash_data(random_string(10))
    
    dream_area = random.randint(2, 7)
    
    user_record = {
        'user_id': row['user_id'],
        'username': username,
        'email': email,
        'password': password,
        'gre_q': row['gre_q'] if pd.notnull(row['gre_q']) else None,
        'gre_v': row['gre_v'] if pd.notnull(row['gre_v']) else None,
        'gre_awa': row['gre_awa'] if pd.notnull(row['gre_awa']) else None,
        'gpa': row['gpa'] if pd.notnull(row['gpa']) else None,
        'status': row['status'] if pd.notnull(row['status']) else None,
        'dream_area': dream_area
    }
    
    user_data.append(user_record)
    count += 1
    print(f"finished {count}" )

user_df = pd.DataFrame(user_data)

user_df.to_csv(output_filename, index=False)