import sqlite3


DATABASE_NAME = "database.db"


def get_connection():
    connection = sqlite3.connect(
        DATABASE_NAME
    )

    connection.row_factory = sqlite3.Row

    return connection


def create_tables():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            scan_date TEXT NOT NULL,
            risk_score INTEGER,
            risk_level TEXT
        )
    """)

    connection.commit()
    connection.close()
if __name__ == "__main__":
    create_tables()
    print("Database created successfully.")