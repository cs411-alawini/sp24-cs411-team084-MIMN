import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import mysql.connector
import joblib
from sqlalchemy import create_engine


# Setup the SQLAlchemy engine
engine = create_engine('mysql+pymysql://root:UIUC-cs411-MIMN@35.232.135.106/COLLEGE_DB')

def load_data(query):
    """Load data from SQL database into a DataFrame."""
    return pd.read_sql(query, engine)

# SQL queries
application_query = "SELECT * FROM application"
user_query = "SELECT * FROM user"
university_query = "SELECT * FROM university"
ranking_query = "SELECT * FROM ranking"
area_query = "SELECT * FROM area"

# Load data into DataFrames
application_df = load_data(application_query)
user_df = load_data(user_query)
university_df = load_data(university_query)
ranking_df = load_data(ranking_query)
area_df = load_data(area_query)

combined_df = pd.merge(application_df, user_df, on='user_id', suffixes=('_app', '_user'))
university_ranking_df = pd.merge(university_df, ranking_df, on='university_id')
final_df = pd.merge(combined_df, university_ranking_df, left_on='university', right_on='university_id')

imputer = SimpleImputer(strategy='median')
final_df[['gre_q_app', 'gre_v_app', 'gre_awa_app', 'gpa_app']] = imputer.fit_transform(final_df[['gre_q_app', 'gre_v_app', 'gre_awa_app', 'gpa_app']])

le = LabelEncoder()
final_df['status_app'] = le.fit_transform(final_df['status_app'])

scaler = StandardScaler()
final_df[['gre_q_app', 'gre_v_app', 'gre_awa_app', 'gpa_app']] = scaler.fit_transform(final_df[['gre_q_app', 'gre_v_app', 'gre_awa_app', 'gpa_app']])

X = final_df[['gre_q_app', 'gre_v_app', 'gre_awa_app', 'gpa_app', 'status_app']]
y = final_df['university_id']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# save the model to a file
joblib.dump(model, 'trained_model.joblib')

joblib.dump(le, 'label_encoder.joblib')
joblib.dump(scaler, 'scaler.joblib')

joblib.dump(university_df, 'university_df.joblib')