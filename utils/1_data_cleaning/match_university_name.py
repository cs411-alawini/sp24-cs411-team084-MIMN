"""Match university names to IDs and drop rows with unlisted universities"""
import pandas as pd
import re

university_match_filename = '1_university_match.csv'
application_filename = '3_applications.csv'
output_filename = 'applications_cleaned.csv'

university_df = pd.read_csv(university_match_filename, header=None)
university_df.columns = ['id', 'name', 'regex']

university_df['compiled_regex'] = university_df['regex'].apply(lambda x: re.compile(x, re.IGNORECASE))

application_df = pd.read_csv(application_filename)

def replace_university_names(column, compiled_regex, id):
    return column.replace(compiled_regex, id, regex=True)

for _, row in university_df.iterrows():
    application_df['university'] = replace_university_names(application_df['university'], row['compiled_regex'], row['id'])
    print(f"replaced {row['compiled_regex']}")

application_df = application_df[pd.to_numeric(application_df['university'], errors='coerce')
                                .between(1, 103, inclusive='both').fillna(False)]

application_df.to_csv(output_filename, index=False)