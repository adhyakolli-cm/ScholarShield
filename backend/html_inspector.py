import requests #type:ignore
from bs4 import BeautifulSoup #type:ignore
from urllib.parse import urlparse, urljoin


def analyze_html(url):
    result = {
        "page_retrieved": False,
        "number_of_forms": 0,
        "has_login_form": False,
        "has_payment_form": False,
        "external_form_action": False,
        "number_of_external_links": 0,
        "number_of_scripts": 0,
        "number_of_password_fields": 0,
        "number_of_email_fields": 0
    }

    try:
        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "ScholarShield/1.0"
            }
        )

        result["page_retrieved"] = True

        soup = BeautifulSoup(response.text, "html.parser")

        # Forms
        forms = soup.find_all("form")
        result["number_of_forms"] = len(forms)

        # Password fields
        password_fields = soup.find_all(
            "input",
            {"type": "password"}
        )

        result["number_of_password_fields"] = len(
            password_fields
        )

        # Email fields
        email_fields = soup.find_all(
            "input",
            {"type": "email"}
        )

        result["number_of_email_fields"] = len(
            email_fields
        )

        # Page text
        page_text = soup.get_text(" ", strip=True).lower()

        login_words = [
            "login",
            "log in",
            "sign in"
        ]

        payment_words = [
            "payment",
            "pay now",
            "card number",
            "upi",
            "processing fee"
        ]

        for word in login_words:
            if word in page_text:
                result["has_login_form"] = True
                break

        for word in payment_words:
            if word in page_text:
                result["has_payment_form"] = True
                break

        # External form actions
        parsed_page = urlparse(url)
        page_domain = parsed_page.netloc.lower()

        for form in forms:
            action = form.get("action")

            if action:
                full_action_url = urljoin(url, action)
                action_domain = urlparse(
                    full_action_url
                ).netloc.lower()

                if action_domain and action_domain != page_domain:
                    result["external_form_action"] = True

        # External links
        links = soup.find_all("a", href=True)

        external_links = 0

        for link in links:
            href = link.get("href")

            full_url = urljoin(url, href)

            link_domain = urlparse(
                full_url
            ).netloc.lower()

            if link_domain and link_domain != page_domain:
                external_links += 1

        result["number_of_external_links"] = external_links

        # Scripts
        scripts = soup.find_all("script")

        result["number_of_scripts"] = len(scripts)

    except Exception as error:
        print("HTML analysis error:", error)

    return result


if __name__ == "__main__":
    test_url = "https://example.com"

    result = analyze_html(test_url)

    print(result)