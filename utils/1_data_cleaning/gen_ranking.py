"""Generate the ranking of each university in each area."""
import pandas as pd

university_filename = 'university.csv'
output_filename = 'university_area_rankings.csv'

universities_df = pd.read_csv(university_filename, names=['university_id', 'name'])

area_files = [
    '1_csranking.csv',
    '2_ai_ranking.csv',
    '3_theory_ranking.csv',
    '4_systems_ranking.csv',
    '5_software_ranking.csv',
    '6_security_ranking.csv',
    '7_robotics_ranking.csv'
]

final_df = pd.DataFrame()

for file in area_files:
    area_id = int(file.split('_')[0])

    area_df = pd.read_csv(file)

    area_df['name'] = area_df['name'].str.strip()
    area_df['ranking'] = area_df['ranking'].astype(str).str.strip()

    merged_df = pd.merge(universities_df, area_df, on='name', how='left')

    merged_df = merged_df[['university_id', 'ranking']]
    merged_df['area_id'] = area_id 

    final_df = pd.concat([final_df, merged_df], ignore_index=True)

final_df[['university_id', 'area_id', 'ranking']]

final_df.to_csv(output_filename, index=False)