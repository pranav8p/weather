from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import run_agent

app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    message: str

@app.post("/chat")
def chat(query: Query):
    return run_agent(query.message)

