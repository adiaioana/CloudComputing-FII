import jsonify
import uvicorn
from fastapi import FastAPI, Query
import requests
from bs4 import BeautifulSoup

app = FastAPI()


def get_first_image_url(query: str):
    search_url = f"https://www.google.com/search?tbm=isch&q={query+" quality image full hd"}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(search_url, headers=headers)

    if response.status_code != 200:
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    images = soup.find_all("img")

    if len(images) > 5:
        return images[4]["src"]  # First image is often the Google logo

    return None


@app.get("/image")
def get_image(location: str = Query(..., title="Location")):
    image_url = get_first_image_url(location)

    if image_url:
        return {"location": location, "image_url": image_url}
    else:
        return {"error": "No image found"}

@app.route('/osm_data', methods=['GET'])
def get_osm_data():

    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = """
    [out:json];
    node["amenity"="cafe"](50.746,7.154,50.748,7.157);
    out;
    """
    response = requests.get(overpass_url, params={'data': overpass_query})
    data = response.json()
    return jsonify(data)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5002)