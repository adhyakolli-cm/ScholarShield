from pathlib import Path

import joblib
import pandas as pd #type:ignore


BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR.parent
    / "ml"
    / "random_forest.pkl"
)


FEATURE_COLUMNS = [
    "url_length",
    "https",
    "subdomain_count",
    "has_ip",
    "number_of_forms",
    "number_of_external_links",
    "number_of_password_fields",
    "has_payment_form",
    "suspicious_keyword_count",
    "is_shortened"
]


model = joblib.load(MODEL_PATH)


def predict_website(features):

    data = {}

    for column in FEATURE_COLUMNS:
        value = features.get(column, 0)

        if isinstance(value, bool):
            value = int(value)

        data[column] = value

    dataframe = pd.DataFrame(
        [data],
        columns=FEATURE_COLUMNS
    )

    prediction = model.predict(dataframe)[0]

    probability = model.predict_proba(
        dataframe
    )[0]

    suspicious_probability = probability[1]

    return {
        "prediction": int(prediction),
        "suspicious_probability": float(
            suspicious_probability
        )
    }
if __name__ == "__main__":

    test_features = {
        "url_length": 80,
        "https": 0,
        "subdomain_count": 3,
        "has_ip": 1,
        "number_of_forms": 2,
        "number_of_external_links": 15,
        "number_of_password_fields": 2,
        "has_payment_form": 1,
        "suspicious_keyword_count": 4,
        "is_shortened": 1
    }

    result = predict_website(
        test_features
    )

    print(result)