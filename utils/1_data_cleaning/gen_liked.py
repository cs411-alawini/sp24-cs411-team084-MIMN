"""Generate liked university for raw users randomly."""
import pandas as pd
import numpy as np

application_filename = 'application.csv'
output_filename = 'like.csv'

columns = [
    'user_id', 'application_id', 'degree', 'term', 
    'decision', 'gre_q', 'gre_v', 'gre_awa', 'gpa', 
    'status', 'university', 'decision_date'
]

application_df = pd.read_csv(application_filename, header=None, names=columns)

def calculate_liked(university):
    """Liked university is applied university plus a random integer in [-10, 10], while keeping in range."""
    random_number = np.random.randint(-10, 11)
    liked = university + random_number

    if liked < 1:
        liked = 1
    elif liked > 103:
        liked = 103
    return liked

application_df['liked'] = application_df['university'].apply(calculate_liked)

like_df = application_df[['user_id', 'liked']]

like_df.to_csv(output_filename, index=False, header=False)