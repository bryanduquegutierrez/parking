import requests
import pandas as pd
import time

API_KEY = "AIzaSyB0xJF-5TpvXlZjaeolGfYNfXl33fG9CV0"



# Ubicación base (ejemplo: Madrid centro)
LAT = 40.4168
LNG = -3.7038
RADIUS = 5000  # metros

PLACES_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

stations = []

def get_place_details(place_id):
    params = {
        "place_id": place_id,
        "fields": "formatted_phone_number,opening_hours",
        "key": API_KEY,
    }
    res = requests.get(DETAILS_URL, params=params).json()
    result = res.get("result", {})

    phone = result.get("formatted_phone_number", "")
    hours = result.get("opening_hours", {}).get("weekday_text", [])

    return phone, " | ".join(hours)

params = {
    "location": f"{LAT},{LNG}",
    "radius": RADIUS,
    "type": "parking",
    "key": API_KEY,
}

while True:
    response = requests.get(PLACES_URL, params=params).json()
    print(response)  # <--- para depurar

    for place in response.get("results", []):
        phone, hours = get_place_details(place["place_id"])

        stations.append({
            "Name": place.get("name"),
            "Address": place.get("vicinity"),
            "Latitude": place["geometry"]["location"]["lat"],
            "Longitude": place["geometry"]["location"]["lng"],
            "Rating": place.get("rating"),
            "Open now": place.get("opening_hours", {}).get("open_now"),
            "Phone": phone,
            "Opening hours": hours,
        })

        time.sleep(0.2)  # evitar rate limit

    if "next_page_token" in response:
        params["pagetoken"] = response["next_page_token"]
        time.sleep(2)
    else:
        break

# Exportar a Excel
df = pd.DataFrame(stations)
df.to_excel("parking.xlsx", index=False)



print(f"✅ Exportadas {len(df)} parkings a parking.xlsx")