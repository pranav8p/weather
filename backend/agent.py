from langchain_openai import ChatOpenAI
from weather_tool import get_weather

llm = ChatOpenAI(
    openai_api_base="https://openrouter.ai/api/v1",
    model="mistralai/mistral-7b-instruct",
    temperature=0
)

STOP_WORDS = {
    "weather","of","in","today","now","current","please","tell",
    "me","the","is","what","whats","what's"
}

def extract_city(query: str) -> str:
    words = [w for w in query.lower().split() if w not in STOP_WORDS]
    return words[-1] if words else ""

def run_agent(query: str):
    q = query.strip().lower()

    # Treat short queries as city names directly
    if len(q.split()) <= 3:
        city = extract_city(q)
        return get_weather(city)

    # If weather intent exists anywhere
    if "weather" in q or "temperature" in q:
        city = extract_city(q)
        return get_weather(city)

    # fallback LLM
    return {"response": llm.invoke(query).content}
