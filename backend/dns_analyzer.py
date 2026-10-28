import socket
import dns.resolver # type: ignore


def analyze_domain(domain):
    result = {
        "domain": domain,
        "resolved": False,
        "ip_addresses": [],
        "nameservers": []
    }

    # IP address lookup
    try:
        ip_addresses = socket.gethostbyname_ex(domain)[2]

        result["ip_addresses"] = ip_addresses

        if ip_addresses:
            result["resolved"] = True

    except Exception:
        result["resolved"] = False

    # Nameserver lookup
    try:
        nameserver_records = dns.resolver.resolve(domain, "NS")

        for record in nameserver_records:
            result["nameservers"].append(str(record))

    except Exception:
        result["nameservers"] = []

    return result
if __name__ == "__main__":
    test_domain = "example.com"

    result = analyze_domain(test_domain)

    print(result)