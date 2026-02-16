import os
from dotenv import load_dotenv
from typing import Generator
import mysql.connector

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

def conectar_bd() -> mysql.connector.connection.MySQLConnection:
    conexion = mysql.connector.connect(**DB_CONFIG)
    return conexion

def obtener_conexion_bd() -> Generator[mysql.connector.connection.MySQLConnection, None, None]:
    conexion = conectar_bd()
    try:
        yield conexion
        conexion.commit()
    except Exception:
        conexion.rollback()
        raise
    finally:
        conexion.close()