import requests
import sys

def login():
    try:
        response = requests.post("http://127.0.0.1:8000/api/auth/login", json={
            "email": "admin@aigenthix.com", 
            "password": "password"
        })
        print(f"Status: {response.status_code}")
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    login()
