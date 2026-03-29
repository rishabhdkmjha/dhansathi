"""
DhanSathi AI Service — powered by Groq (free tier)
Llama 3.3 70B is fast, smart, and free on Groq.
Drop-in replacement for the original claude_service.py
"""

import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"
API_KEY = "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".strip()

HEADERS = {
    "Content-Type":  "application/json",
    "Authorization": f"Bearer {API_KEY}",
}


async def call_claude(system_prompt: str, user_message: str, max_tokens: int = 1500) -> str:
    """Send prompt to Groq, return text response."""
    payload = {
        "model":      GROQ_MODEL,
        "max_tokens": max_tokens,
        "messages": [
            {"role": "system",  "content": system_prompt},
            {"role": "user",    "content": user_message},
        ],
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(GROQ_API_URL, headers=HEADERS, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


async def call_claude_json(system_prompt: str, user_message: str, max_tokens: int = 2000) -> dict:
    """Call Groq and parse JSON response."""
    enforced_system = system_prompt + "\n\nCRITICAL: Your entire response must be valid JSON only. No markdown, no backticks, no explanation outside the JSON object."
    result = await call_claude(enforced_system, user_message, max_tokens)
    # Strip markdown fences if model adds them anyway
    cleaned = result.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip().rstrip("```").strip()
    return json.loads(cleaned)


async def call_claude_chat(messages: list, system_prompt: str, max_tokens: int = 1000) -> str:
    """Multi-turn chat call."""
    payload = {
        "model":      GROQ_MODEL,
        "max_tokens": max_tokens,
        "messages":   [{"role": "system", "content": system_prompt}] + messages,
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(GROQ_API_URL, headers=HEADERS, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]