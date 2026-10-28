def detect_red_flags(
    url_features,
    domain_features,
    ssl_features,
    html_features
):

    risk_factors = []

    # URL indicators
    if url_features.get("has_ip"):
        risk_factors.append(
            "Website uses an IP address instead of a normal domain"
        )

    if url_features.get("suspicious_keyword_count", 0) >= 2:
        risk_factors.append(
            "Multiple suspicious keywords found in URL"
        )

    if url_features.get("is_shortened"):
        risk_factors.append(
            "Shortened URL detected"
        )

    # DNS indicators
    if not domain_features.get("resolved"):
        risk_factors.append(
            "Domain could not be resolved"
        )

    # SSL indicators
    if not ssl_features.get("https_enabled"):
        risk_factors.append(
            "HTTPS connection could not be established"
        )

    # HTML indicators
    if html_features.get("has_payment_form"):
        risk_factors.append(
            "Payment-related content detected"
        )

    if html_features.get("external_form_action"):
        risk_factors.append(
            "Form submits data to an external domain"
        )

    if html_features.get("number_of_password_fields", 0) > 0:
        risk_factors.append(
            "Password field detected"
        )

    return risk_factors