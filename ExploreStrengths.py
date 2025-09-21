# main.py

from fastapi import FastAPI, Request
from dotenv import load_dotenv
from google.cloud import firestore
from google import genai
import os
from datetime import datetime
import json

# --------------------------
# Load environment variables
# --------------------------
load_dotenv()

# --------------------------
# Initialize Firestore
# --------------------------
db = firestore.Client.from_service_account_json(
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
)

# --------------------------
# Initialize Gemini (AI Studio) client
# --------------------------
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# --------------------------
# Initialize FastAPI app
# --------------------------
app = FastAPI()

# --------------------------
# GET endpoint for browser check
# --------------------------
@app.get("/recommend")
async def recommend_get():
    return {
        "info": "Please use POST with JSON body at this endpoint.",
        "example_body": {
            "filter_type": "science",
            "choices": ["Physics", "Astronomy"],
            "user_id": "user123"
        }
    }

# --------------------------
# POST endpoint for AI recommendations
# --------------------------
@app.post("/recommend")
async def recommend(request: Request):
    # Step 1: Get data from frontend
    body = await request.json()
    filter_type = body.get("filter_type")
    choices = body.get("choices", [])
    user_id = body.get("user_id", "anonymous")

    if not choices or not filter_type:
        return {"error": "Please provide filter_type and at least one choice."}

    # Step 2: Save to Firestore
    doc_ref = db.collection("good_at").document(user_id)
    doc_ref.set({
        "filter_type": filter_type,
        "choices": choices,
        "updated_at": datetime.utcnow().isoformat()
    })

    # Step 3: Build prompt for AI
    prompt = f"""
    The user has selected filter type: {filter_type}
    and these choices: {choices}.

    Recommend between 8 and 12 rare and unique university degrees or courses.  
    Some can be directly related to the chosen subjects/interests/skills,  
    and some can be broader but still relevant.  

    Return the output strictly in JSON format as a list of objects like this:
    [
      {{
        "degree": "Degree Name",
        "description": "1–2 sentence short description"
      }}
    ]

    IMPORTANT:
    - Do not add any extra text outside the JSON array.
    - If unsure, return an empty list.
    """

    # Step 4: Call Gemini
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt,
    )

    # Step 5: Clean and return JSON safely
    try:
        recommendations = json.loads(response.text)
        # Ensure it is always a list
        if not isinstance(recommendations, list):
            recommendations = [{"degree": "Error", "description": "Invalid AI output"}]
    except json.JSONDecodeError:
        recommendations = [{"degree": "Error", "description": "Invalid AI output"}]

    return {
        "user_input": {
            "filter_type": filter_type,
            "choices": choices
        },
        "recommendations": recommendations
    }
