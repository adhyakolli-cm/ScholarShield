from fastapi import FastAPI #type:ignore
from pydantic import BaseModel #type:ignore
from fastapi.middleware.cors import CORSMiddleware #type:ignore
from datetime import datetime

from features import extract_url_features
from dns_analyzer import analyze_domain
from ssl_analyzer import analyze_ssl
from html_inspector import analyze_html
from risk_indicators import detect_red_flags
from risk_engine import calculate_risk_score
from database import get_connection, create_tables
from ml_predictor import predict_website


app = FastAPI()

create_tables()


class ScanRequest(BaseModel):
    url: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "ScholarShield AI backend is running",
        "status": "online"
    }


@app.post("/scan")
def scan_website(request: ScanRequest):

    url = request.url

    # Phase 20
    url_features = extract_url_features(url)

    domain = url_features.get("domain")

    if not domain:
        return {
            "url": url,
            "error": "Could not extract domain"
        }

    # Phase 21
    domain_features = analyze_domain(domain)

    # Phase 22
    ssl_features = analyze_ssl(domain)

    # Phase 23
    html_features = analyze_html(url)

    # ML analysis
    ml_features = {
        **url_features,
        **html_features
    }

    ml_result = predict_website(
        ml_features
    )

    # Phase 24
    risk_factors = detect_red_flags(
        url_features,
        domain_features,
        ssl_features,
        html_features
    )

    # Phase 25
    risk_result = calculate_risk_score(
        risk_factors
    )

    # Phase 27 - Save scan to database
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO scans
        (url, scan_date, risk_score, risk_level)
        VALUES (?, ?, ?, ?)
    """, (
        url,
        datetime.now().isoformat(),
        risk_result["risk_score"],
        risk_result["risk_level"]
    ))

    connection.commit()
    connection.close()

    # Return result to frontend
    return {
        "url": url,

        "risk_score": risk_result["risk_score"],

        "risk_level": risk_result["risk_level"],

        "risk_factors": risk_factors,

        "ml_prediction": ml_result["prediction"],

        "ml_suspicious_probability":
            ml_result["suspicious_probability"],

        "url_features": url_features,

        "domain_features": domain_features,

        "ssl_features": ssl_features,

        "html_features": html_features
    }


@app.get("/history")
def get_history():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, url, scan_date, risk_score, risk_level
        FROM scans
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    return [dict(row) for row in rows]