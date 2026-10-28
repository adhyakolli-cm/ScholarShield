import socket
import ssl
from datetime import datetime


def analyze_ssl(domain):
    result = {
        "https_enabled": False,
        "certificate_available": False,
        "certificate_subject": None,
        "certificate_issuer": None,
        "valid_from": None,
        "valid_until": None
    }

    try:
        context = ssl.create_default_context()

        with socket.create_connection(
            (domain, 443),
            timeout=5
        ) as sock:

            with context.wrap_socket(
                sock,
                server_hostname=domain
            ) as secure_socket:

                certificate = secure_socket.getpeercert()

                result["https_enabled"] = True
                result["certificate_available"] = True

                # Certificate subject
                subject = certificate.get("subject")

                if subject:
                    result["certificate_subject"] = str(subject)

                # Certificate issuer
                issuer = certificate.get("issuer")

                if issuer:
                    result["certificate_issuer"] = str(issuer)

                # Certificate validity
                result["valid_from"] = certificate.get(
                    "notBefore"
                )

                result["valid_until"] = certificate.get(
                    "notAfter"
                )

    except Exception as error:
        print("SSL analysis error:", error)

    return result
if __name__ == "__main__":
    test_domain = "example.com"

    result = analyze_ssl(test_domain)

    print(result)