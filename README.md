## 📌 Project Overview

This project is a full end-to-end web application that allows users to query weather information for any city using natural language inputs such as:

* `Pune`
* `Weather of Mumbai today`
* `Delhi weather`
* `What is the temperature in Bangalore?`

The application intelligently processes the query, fetches real-time weather data, air quality information, sunrise/sunset timings, and presents the results in a modern, Google-style UI.

The backend integrates **FastAPI**, **LangChain**, and **OpenRouter LLM**, while the frontend is built using **React (Vite)**.

---

## 🚀 Features

### 🌍 Weather Information

* Current temperature
* Wind speed
* 12-hour hourly temperature forecast (from the current time)
* Sunrise & sunset timings

### 🌫️ Air Quality Index (AQI)

* Real-time AQI values
* AQI interpretation:

  * Good
  * Moderate
  * Bad
  * Severe
* Color-coded AQI display

### ☀️🌙 Intelligent Icons

* Sun icons after sunrise
* Moon icons after sunset
* Temperature-based icons for both day and night

### 🧠 Natural Language Input

* Accepts flexible user queries:

  * Single city name (`Pune`)
  * Sentence-based queries (`weather in delhi today`)
* Uses LLM fallback for non-weather queries

### ❌ Error Handling

* Graceful error message when city is not found
* No blank screens or crashes

---

## 🛠️ Tech Stack

### Frontend

* **React (Vite)**
* HTML, CSS
* Fetch API

### Backend

* **FastAPI**
* **LangChain**
* **OpenRouter (LLM API)**
* Python 3.10+

### APIs Used

* **Open-Meteo Weather API**
* **Open-Meteo Air Quality API**
* **Open-Meteo Geocoding API**

---

## 🧩 System Architecture

```
User (Browser)
   ↓
React Frontend (Vite)
   ↓  HTTP POST /chat
FastAPI Backend
   ↓
Query Router (agent.py)
   ↓
Weather Tool (weather_tool.py)
   ↓
Open-Meteo APIs
```

The backend decides whether the query is weather-related and routes it accordingly. Weather queries are handled deterministically, while non-weather queries are handled by the LLM.

---

## ⚙️ Backend Setup

### 1️⃣ Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

### 2️⃣ Install Dependencies

```bash
pip install fastapi uvicorn langchain langchain-community langchain-openai python-dotenv requests
```

### 3️⃣ Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
OPENAI_API_KEY=your_openrouter_api_key_here
```

> ⚠️ OpenRouter keys are used via the `OPENAI_API_KEY` variable for LangChain compatibility.

### 4️⃣ Run Backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## 🎨 Frontend Setup

### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

### 2️⃣ Start Frontend

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🧪 Example Queries

| Input                     | Output                                       |
| ------------------------- | -------------------------------------------- |
| `Pune`                    | Weather card with temp, AQI, hourly forecast |
| `weather in mumbai today` | Accurate city-specific data                  |
| `xyzabc`                  | Error: City not found                        |

---

## 📷 UI Highlights

* Wide Google-style weather card
* Light gradient background
* Responsive layout
* Scrollable hourly forecast
* Color-coded AQI indicators
* Day/Night icon switching using sunrise/sunset

---

## 🧠 Design Decisions

* **Deterministic weather routing** instead of unreliable agent reasoning
* **Real sunrise/sunset data** instead of hardcoded times
* **Hourly forecast aligned to current time**, not midnight
* **No heavy chart libraries** to keep UI lightweight
* **Graceful failure handling** for invalid inputs

---

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── main.py
│   ├── agent.py
│   ├── weather_tool.py
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
└── README.md
```
