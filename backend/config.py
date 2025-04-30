import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="auth-db636.hstgr.io",
        user="u861134693_castoruser",
        password="Nalgasdemike8",
        database="u861134693_castordb"
    )
