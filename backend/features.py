from urllib.parse import urlparse


def extract_url_features(url):
    parsed_url = urlparse(url)

    features = {}

    features["https"] = parsed_url.scheme == "https"

    features["url_length"] = len(url)

    domain = parsed_url.netloc.split(":")[0]
    features["domain"] = domain

    parts = domain.split(".")

    if len(parts) > 2:
        features["subdomain_count"] = len(parts) - 2
    else:
        features["subdomain_count"] = 0

    features["has_ip"] = domain.replace(".", "").isdigit()

    special_characters = ["@", "-", "_", "%", "="]

    count = 0

    for character in special_characters:
        count += url.count(character)

    features["special_char_count"] = count

    suspicious_keywords = [
        "free",
        "claim",
        "winner",
        "urgent",
        "verify",
        "password",
        "login",
        "fee"
    ]

    url_lower = url.lower()

    keyword_count = 0

    for keyword in suspicious_keywords:
        if keyword in url_lower:
            keyword_count += 1

    features["suspicious_keyword_count"] = keyword_count

    shortened_domains = [
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "ow.ly"
    ]

    features["is_shortened"] = domain.lower() in shortened_domains

    return features


if __name__ == "__main__":
    test_url = "https://scholarship-example.com/apply"

    result = extract_url_features(test_url)

    print(result)