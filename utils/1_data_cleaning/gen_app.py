"""Generate application records from raw data, appending randomly hashed user_id and application_id."""
import pandas as pd
import hashlib
import os

application_filename = '8_application.csv'
output_filename = 'applications.csv'

def generate_hash(salt, id_value):
    hash_input = str(id_value).encode('utf-8') + salt
    return hashlib.sha256(hash_input).hexdigest()[:10]

df = pd.read_csv(application_filename)

df = df.rename(columns={
    'degree': 'degree',
    'gre_quant': 'gre_q',
    'decision': 'decision',
    'gre_verbal': 'gre_v',
    'date_of_result': 'decision_date',
    'term_year': 'term',
    'undergrad_gpa': 'gpa',
    'date_added': 'decision_date',
    'applicant_status': 'status',
    'university': 'university',
    'gre_awa': 'gre_awa'
})

salt = os.urandom(16)

df['user_id'] = [generate_hash(salt, i) for i in range(len(df))]
df['application_id'] = [generate_hash(salt, i + len(df)) for i in range(len(df))]

df = df[[
    'user_id',
    'application_id',
    'degree',
    'term',
    'decision',
    'gre_q',
    'gre_v',
    'gre_awa',
    'gpa',
    'status',
    'university',
    'decision_date'
]]

df.to_csv(output_filename, index=False)