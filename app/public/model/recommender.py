import pandas as pd
import joblib
import sys
from sqlalchemy import create_engine, text

# Load the model and other components
model = joblib.load('public/model/trained_model.joblib')
le = joblib.load('public/model/label_encoder.joblib')
scaler = joblib.load('public/model/scaler.joblib')
university_df = joblib.load('public/model/university_df.joblib')

# Setup the SQLAlchemy engine
engine = create_engine('mysql+pymysql://root:UIUC-cs411-MIMN@35.232.135.106/COLLEGE_DB')

def call_stored_procedure(univ1, univ2, univ3):
    with engine.connect() as connection:
        # Access the raw DBAPI connection
        raw_conn = connection.connection
        cursor = raw_conn.cursor()
        cursor.callproc("GetUniversityApplicants", [univ1, univ2, univ3])
        
        results = cursor.fetchall()
        #print("\nQuery 1: Average Scores and Ranking")
        for row in results:
            print(f"University: {row[0]}, Ranking: {row[1]}, "
                  f"Avg GPA: {float(row[2]):.1f}, Avg GRE Q: {float(row[3]):.1f}, "
                  f"Avg GRE V: {float(row[4]):.1f}, Avg GRE AWA: {float(row[5]):.1f}")

        cursor.nextset()

        results = cursor.fetchall()
        #print("\nQuery 2: Acceptance Rates")
        for row in results:
            print(f"University: {row[0]}, Total Applicants: {row[1]}, "
                  f"Acceptance Rate: {float(row[2]):.2f}%")

        cursor.close()



def recommend_schools(gre_quant, gre_verbal, gre_w, gpa, status):

    input_data = pd.DataFrame({
        'gre_q_app': [gre_quant],
        'gre_v_app': [gre_verbal],
        'gre_awa_app': [gre_w],
        'gpa_app': [gpa],
        'status_app': [status]
    })

    input_data['status_app'] = le.transform(input_data['status_app'])
    input_data_scaled = scaler.transform(input_data[['gre_q_app', 'gre_v_app', 'gre_awa_app', 'gpa_app']])
    input_data[['gre_q_app', 'gre_v_app', 'gre_awa_app', 'gpa_app']] = input_data_scaled

    predicted_probs = model.predict_proba(input_data)
    top_school_indices = predicted_probs.argsort()[0][-3:][::-1]
    top_school_ids = model.classes_[top_school_indices]
    top_school_names = university_df[university_df['university_id'].isin(top_school_ids)]['name'].values

    return top_school_names, top_school_ids


if __name__ == "__main__":
    gre_quant = float(sys.argv[1])
    gre_verbal = float(sys.argv[2])
    gre_w = float(sys.argv[3])
    gpa = float(sys.argv[4])
    status = sys.argv[5]

    print(f"{gpa}, {gre_quant}, {gre_verbal}, {gre_w}, {status}")
    recommendations, top_school_ids = recommend_schools(gre_quant, gre_verbal, gre_w, gpa, status)
    print(", ".join(recommendations))  # Outputs recommendations

    print("---Applicants---")
    call_stored_procedure(top_school_ids[0], top_school_ids[1], top_school_ids[2])
