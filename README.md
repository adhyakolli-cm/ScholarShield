# 🛡️ ScholarShield AI

### Fake Scholarship Website Detection System

ScholarShield AI is a web-based project designed to identify potentially fraudulent scholarship websites by analyzing URLs and website security indicators. The project aims to combine rule-based risk assessment with machine learning to help students make safer decisions when exploring scholarship opportunities.

## 🎯 Project Objectives

- Analyze scholarship website URLs for suspicious patterns.
- Examine DNS and SSL/HTTPS security indicators.
- Identify potentially suspicious content in webpage HTML.
- Generate an explainable risk assessment.
- Maintain scan history using an SQLite database.
- Explore machine learning models for website classification.
- Provide a simple, user-friendly web dashboard.

## ✨ Planned Features

- URL validation and feature extraction
- Rule-based website risk assessment
- DNS resolution checks
- SSL/HTTPS analysis
- HTML content analysis
- Risk score and classification
- SQLite scan history
- Machine learning using Random Forest and XGBoost
- Interactive dashboard with recent scan results
- Error handling for invalid or unreachable websites

*Features will be marked complete only after implementation and testing.*

## 🧰 Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | REST API development |
| Uvicorn | Local application server |
| HTML | Webpage structure |
| CSS | Website styling |
| JavaScript | Frontend interaction |
| SQLite | Planned scan history storage |
| scikit-learn | Planned machine learning |
| XGBoost | Planned classification model |
| Git and GitHub | Version control and collaboration |

## 📁 Project Structure

```text
ScholarShield-AI/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── docs/
│   ├── project-roadmap.md
│   └── screenshots/
├── .gitignore
└── README.md
```

Additional scanner, database, and machine learning modules will be added as development progresses.

## ⚙️ Installation and Setup

### Prerequisites

- Python 3
- Visual Studio Code or another code editor
- A modern web browser
- Git (optional for local setup, required for Git-based collaboration)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/ScholarShield-AI.git
cd ScholarShield-AI
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Create a virtual environment

```bash
cd backend
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt:

```bat
venv\Scripts\activate.bat
```

### 3. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 4. Start the backend

```bash
uvicorn main:app --reload
```

The backend should be accessible at:

- API: http://127.0.0.1:8000
- API documentation: http://127.0.0.1:8000/docs

### 5. Run the frontend

Open the `frontend` folder in Visual Studio Code and use the Live Server extension to open `index.html`.

The frontend and backend must both be running for browser-to-API communication to work.

## 🧪 Testing

The project will be tested using:

- Valid and invalid URL inputs
- Empty input validation
- HTTP and HTTPS URLs
- DNS resolution failures
- SSL connection failures
- Unreachable websites
- Frontend–backend communication
- Database persistence
- Machine learning evaluation

Model evaluation will include accuracy, precision, recall, F1-score, and a confusion matrix when the ML component is implemented.

## 🗺️ Development Roadmap

1. Project setup and environment configuration
2. Basic FastAPI backend
3. Frontend development
4. Frontend–backend integration
5. URL feature extraction
6. DNS and SSL analysis
7. HTML analysis and risk engine
8. SQLite database and scan history
9. Machine learning model development
10. Dashboard improvements and final testing

## ⚠️ Important Disclaimer

ScholarShield AI is an educational project and is not a substitute for professional cybersecurity analysis.

A high risk score does not prove that a website is fraudulent, and a low score does not guarantee that a website is safe. HTTPS alone does not establish legitimacy. Results depend on the implemented checks, available data, and model performance.

Avoid entering personal information, passwords, OTPs, or payment details on websites you do not trust.

## 👥 Team and Contributions

This project is developed collaboratively as a student project.

Team members can contribute through bug fixes, feature development, testing, documentation, and improvements to the user interface.

## 📌 Project Status

**Current stage:** Initial setup and prototype development.

The project is being developed incrementally, with each component tested before the next stage is added.


**ScholarShield AI — Helping students evaluate scholarship websites more carefully.**
