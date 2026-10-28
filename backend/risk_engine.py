def calculate_risk_score(risk_factors):
    score = 0

    weights = {
        "Website uses an IP address instead of a normal domain": 20,
        "Multiple suspicious keywords found in URL": 15,
        "Shortened URL detected": 10,
        "Domain could not be resolved": 25,
        "HTTPS connection could not be established": 10,
        "Payment-related content detected": 15,
        "Form submits data to an external domain": 20,
        "Password field detected": 5
    }

    for factor in risk_factors:
        score += weights.get(factor, 0)

    score = min(score, 100)

    if score <= 29:
        level = "Low"
    elif score <= 59:
        level = "Moderate"
    elif score <= 79:
        level = "High"
    else:
        level = "Very High"

    return {
        "risk_score": score,
        "risk_level": level
    }
if __name__ == "__main__":

    test_factors = [
        "Shortened URL detected",
        "Payment-related content detected"
    ]

    result = calculate_risk_score(test_factors)

    print(result)