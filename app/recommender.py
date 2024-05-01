import pandas as pd
import joblib
import sys


# Load the model and other components
model = joblib.load('trained_model.joblib')
le = joblib.load('label_encoder.joblib')
scaler = joblib.load('scaler.joblib')
university_df = joblib.load('university_df.joblib')

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

    return top_school_names

if __name__ == "__main__":
    gre_quant = float(sys.argv[1])
    gre_verbal = float(sys.argv[2])
    gre_w = float(sys.argv[3])
    gpa = float(sys.argv[4])
    status = sys.argv[5]

    print(f"{gpa}, {gre_quant}, {gre_verbal}, {gre_w}, {status}")
    recommendations = recommend_schools(gre_quant, gre_verbal, gre_w, gpa, status)
    print(", ".join(recommendations))  # Output as a simple comma-separated string