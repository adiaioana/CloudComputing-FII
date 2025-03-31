from fastapi.testclient import TestClient
from main import app

test_client = TestClient(app)


def test_get_image():
    locations = ["Louvre Museum", "Colosseum Rome", "Eiffel Tower"]

    for location in locations:
        response = test_client.get(f"/image?location={location}")
        print(response.content)
        assert response.status_code == 200
        json_response = response.json()

        assert "image_url" in json_response or "error" in json_response
        if "image_url" in json_response:
            assert json_response["image_url"].startswith("http")

test_get_image()
print("GET /image tests passed!")
