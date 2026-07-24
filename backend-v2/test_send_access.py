import requests
import sys
import json

base_url = "http://127.0.0.1:8000"
headers = {"Content-Type": "application/json"}

# 1. Login to get token
login_data = {
    "email": "admin@aigenthix.com",
    "password": "password"
}
resp = requests.post(f"{base_url}/api/auth/login", json=login_data, headers=headers)
if resp.status_code != 200:
    print(f"Login failed: {resp.status_code}")
    print(resp.text)
    sys.exit(1)

token = resp.json().get("token")
auth_headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

# 2. Test send access
send_access_data = {
    "email": "testuser_sendaccess@example.com",
    "name": "Test User",
    "role": "editor"
}

print("Testing send-access...")
resp = requests.post(f"{base_url}/api/admin/users/send-access", json=send_access_data, headers=auth_headers)
print(f"Status: {resp.status_code}")
print(resp.text)
