import requests


virustotal_url = "https://www.virustotal.com/api/v3/files"
response_virustotal = requests.get(virustotal_url)
print("VirusTotal API Response:", response_virustotal.status_code, response_virustotal.text) #405
splashbase_url = "http://www.splashbase.co/api/v1/images/random"
response_splashbase = requests.get(splashbase_url)
print("Splashbase API Response:", response_splashbase.status_code, response_splashbase.content) #200 (?)

random_org_url = "https://api.random.org/json-rpc/4/invoke"
data = {
    "jsonrpc": "2.0",
    "method": "generateIntegers",
    "params": {
        "n": 5,
        "min": 1,
        "max": 100
    },
    "id": 1
}
response_random = requests.post(random_org_url, json=data)
print("Random.org API Response:", response_random.status_code, response_random.json())
