import pandas as pd
import json

df = pd.read_excel("parking.xlsx")
print(df.columns)
ads = []

for i, row in df.iterrows():
    ads.append({
        "id": str(i+1),
        "price": f"{row['Price']}",
        "location": f"{row['Name']} · {row['Address']}",
        "description": f"Sin descripción por el momento",
        "latitude": row['Latitude'],
        "longitude": row['Longitude'],
        "slots": row['Slots']
    })

with open("parking_data.json", "w", encoding="utf-8") as f:
    json.dump(ads, f, ensure_ascii=False, indent=2)
print("Datos exportados a parking_data.json")