import requests
from datetime import datetime

def get_weather(city: str) -> dict:
    # 1. Geocoding
    geo = requests.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        params={"name": city, "count": 1}
    ).json()

    if not geo.get("results"):
        return {"error": f"Could not find {city}. Please try again."}

    lat = geo["results"][0]["latitude"]
    lon = geo["results"][0]["longitude"]

    # 2. Weather (with sunrise & sunset)
    weather = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": lat,
            "longitude": lon,
            "current_weather": True,
            "hourly": "temperature_2m",
            "daily": "sunrise,sunset",
            "timezone": "auto"
        }
    ).json()

    # 3. Air Quality
    air = requests.get(
        "https://air-quality-api.open-meteo.com/v1/air-quality",
        params={
            "latitude": lat,
            "longitude": lon,
            "hourly": "us_aqi",
            "timezone": "auto"
        }
    ).json()

    current = weather["current_weather"]
    current_temp = current["temperature"]
    wind = current["windspeed"]

    hourly_times = weather["hourly"]["time"]
    hourly_temps = weather["hourly"]["temperature_2m"]
    hourly_aqi = air["hourly"]["us_aqi"]

    # Sunrise / Sunset (today)
    sunrise = weather["daily"]["sunrise"][0]
    sunset = weather["daily"]["sunset"][0]

    # Find correct start index (robust)
    hourly_datetimes = [datetime.fromisoformat(t) for t in hourly_times]
    current_dt = datetime.fromisoformat(current["time"])

    start_index = 0
    for i, dt in enumerate(hourly_datetimes):
        if dt <= current_dt:
            start_index = i
        else:
            break

    hourly = []
    for i in range(start_index, start_index + 12):
        hourly.append({
            "time": hourly_datetimes[i].strftime("%I %p"),
            "temp": hourly_temps[i]
        })

    current_aqi = hourly_aqi[start_index]

    return {
        "city": city.title(),
        "current": current_temp,
        "wind": wind,
        "aqi": current_aqi,
        "sunrise": datetime.fromisoformat(sunrise).strftime("%I:%M %p"),
        "sunset": datetime.fromisoformat(sunset).strftime("%I:%M %p"),
        "hourly": hourly
    }
