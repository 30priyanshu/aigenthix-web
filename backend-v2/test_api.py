import urllib.request, urllib.error
try:
    print(urllib.request.urlopen('http://localhost:8000/api/blogs/hello').read().decode())
except urllib.error.HTTPError as e:
    print(e.read().decode())
