from pathlib import Path

import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

from xgboost import XGBClassifier # type: ignore

from feature_engineering import FEATURE_COLUMNS


BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = BASE_DIR / "dataset.csv"

RF_MODEL_PATH = BASE_DIR / "random_forest.pkl"
XGB_MODEL_PATH = BASE_DIR / "xgboost_model.pkl"


# ==========================================
# LOAD DATASET
# ==========================================

data = pd.read_csv(DATASET_PATH)


# ==========================================
# CHECK REQUIRED COLUMNS
# ==========================================

required_columns = FEATURE_COLUMNS + ["label"]

missing_columns = [
    column
    for column in required_columns
    if column not in data.columns
]

if missing_columns:
    raise ValueError(
        f"Missing columns: {missing_columns}"
    )


# ==========================================
# SEPARATE FEATURES AND TARGET
# ==========================================

X = data[FEATURE_COLUMNS]
y = data["label"]


# ==========================================
# SPLIT DATASET
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ==========================================
# RANDOM FOREST
# ==========================================

rf_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


print()
print("Training Random Forest...")
rf_model.fit(X_train, y_train)


rf_predictions = rf_model.predict(X_test)


rf_accuracy = accuracy_score(
    y_test,
    rf_predictions
)

rf_precision = precision_score(
    y_test,
    rf_predictions,
    zero_division=0
)

rf_recall = recall_score(
    y_test,
    rf_predictions,
    zero_division=0
)

rf_f1 = f1_score(
    y_test,
    rf_predictions,
    zero_division=0
)

rf_matrix = confusion_matrix(
    y_test,
    rf_predictions
)


# ==========================================
# XGBOOST
# ==========================================

xgb_model = XGBClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    eval_metric="logloss"
)


print("Training XGBoost...")

xgb_model.fit(
    X_train,
    y_train
)


xgb_predictions = xgb_model.predict(
    X_test
)


xgb_accuracy = accuracy_score(
    y_test,
    xgb_predictions
)

xgb_precision = precision_score(
    y_test,
    xgb_predictions,
    zero_division=0
)

xgb_recall = recall_score(
    y_test,
    xgb_predictions,
    zero_division=0
)

xgb_f1 = f1_score(
    y_test,
    xgb_predictions,
    zero_division=0
)

xgb_matrix = confusion_matrix(
    y_test,
    xgb_predictions
)


# ==========================================
# DISPLAY DATASET INFORMATION
# ==========================================

print()
print("==========================================")
print("       SCHOLARSHIELD ML MODELS")
print("==========================================")

print()

print("Dataset samples :", len(data))
print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


# ==========================================
# RANDOM FOREST RESULTS
# ==========================================

print()
print("==========================================")
print("           RANDOM FOREST")
print("==========================================")

print()

print("Accuracy :", rf_accuracy)
print("Precision:", rf_precision)
print("Recall   :", rf_recall)
print("F1 Score :", rf_f1)

print()

print("Confusion Matrix:")
print(rf_matrix)


# ==========================================
# XGBOOST RESULTS
# ==========================================

print()
print("==========================================")
print("              XGBOOST")
print("==========================================")

print()

print("Accuracy :", xgb_accuracy)
print("Precision:", xgb_precision)
print("Recall   :", xgb_recall)
print("F1 Score :", xgb_f1)

print()

print("Confusion Matrix:")
print(xgb_matrix)


# ==========================================
# SAVE MODELS
# ==========================================
MODEL_PATH = BASE_DIR / "xgboost_model.pkl"

joblib.dump(
    rf_model,
    RF_MODEL_PATH
)

joblib.dump(
    xgb_model,
    XGB_MODEL_PATH
)


# ==========================================
# FINAL MESSAGE
# ==========================================

print()
print("==========================================")
print("             MODELS SAVED")
print("==========================================")

print()
print("Random Forest:")
print(RF_MODEL_PATH)

print()

print("XGBoost:")
print(XGB_MODEL_PATH)

print()
print("ScholarShield ML training completed.")