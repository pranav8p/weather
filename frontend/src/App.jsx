import React, { useState } from "react";
import "./App.css";

/* ---------- Time helpers ---------- */
function parseHour(label) {
    const [time, meridian] = label.split(" ");
    let hour = parseInt(time);
    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;
    return hour;
}

/* ---------- Icon logic ---------- */
function getIconByTime(label, temp, sunrise, sunset) {
    const hour = parseHour(label);
    const sunriseHour = parseHour(sunrise);
    const sunsetHour = parseHour(sunset);

    const isDay = hour >= sunriseHour && hour < sunsetHour;

    if (isDay) {
        if (temp >= 35) return "☀️";
        if (temp >= 25) return "🌤️";
        if (temp >= 15) return "⛅";
        return "🌥️";
    } else {
        if (temp >= 18) return "🌙";
        if (temp >= 15) return "☁️";
        return "❄️";
    }
}

/* ---------- AQI ---------- */
function getAQIInfo(aqi) {
    if (aqi <= 50) return { text: "Good", color: "#16a34a" };
    if (aqi <= 100) return { text: "Moderate", color: "#ca8a04" };
    if (aqi <= 150) return { text: "Bad", color: "#ea580c" };
    return { text: "Severe", color: "#dc2626" };
}

function App() {
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setData(null);
        setError("");

        try {
            const res = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: query })
            });

            const json = await res.json();

            if (json.error) {
                setError(json.error);
            } else {
                setData(json);
            }
        } catch (e) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="app">
            <input
                placeholder="Search city (e.g. Pune, Mumbai, Delhi)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
            />

            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}


            {data && data.current && (
                <div className="card">
                    <h2>{data.city}</h2>

                    <p>🌅 Sunrise: {data.sunrise} | 🌇 Sunset: {data.sunset}</p>

                    {/* Current */}
                    <div className="current">
                        <span className="icon">
                            {getIconByTime(
                                new Date().toLocaleString("en-US", { hour: "2-digit", hour12: true }),
                                data.current,
                                data.sunrise,
                                data.sunset
                            )}
                        </span>
                        <span className="temp">{data.current}°C</span>
                    </div>

                    <p>🌬️ Wind: {data.wind} km/h</p>

                    {typeof data.aqi === "number" && (() => {
                        const aqiInfo = getAQIInfo(data.aqi);
                        return (
                            <p>
                                🌫️ AQI:
                                <span style={{
                                    color: aqiInfo.color,
                                    fontWeight: "bold",
                                    marginLeft: "6px"
                                }}>
                                    {data.aqi} ({aqiInfo.text})
                                </span>
                            </p>
                        );
                    })()}

                    {/* Hourly */}
                    <div className="hourly">
                        {data.hourly.map((h, i) => (
                            <div key={i} className="hour">
                                <span>{h.time}</span>
                                <span className="small-icon">
                                    {getIconByTime(h.time, h.temp, data.sunrise, data.sunset)}
                                </span>
                                <strong>{h.temp}°</strong>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
