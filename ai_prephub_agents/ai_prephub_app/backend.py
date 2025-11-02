from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Import your agent runner
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

# Import your root agent
from ai_prephub_app.root_agent import root_agent

app = FastAPI(title="AI Prep Hub API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize runner
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name="ai_prephub",
    session_service=session_service
)

class ChatRequest(BaseModel):
    message: str
    user_id: str = "default_user"
    session_id: str = "default_session"


async def run_agent(message: str, user_id: str, session_id: str):
    content = types.Content(role="user", parts=[types.Part(text=message)])

    final_response = "No response from agent."

    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=content
    ):
        if event.is_final_response() and event.content.parts:
            final_response = event.content.parts[0].text
            break

    return final_response


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        reply = await run_agent(request.message, request.user_id, request.session_id)
        return {"reply": reply, "session_id": request.session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

    
# """FastAPI backend for AI Prep Hub"""
# import time
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional

# # Try to import handle_user_message, if it fails, create a mock
# try:
#     from app import handle_user_message
# except ImportError:
#     print("Warning: Could not import handle_user_message from app.py")
#     async def handle_user_message(user_message: str, user_id: str, session_id: str):
#         return f"Mock response: {user_message}"

# app = FastAPI(
#     title="AI Prep Hub API",
#     description="Backend API for AI-powered career preparation assistant",
#     version="1.0.0"
# )

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://localhost:*",
#         "http://127.0.0.1:*",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Request/Response Models
# class ChatRequest(BaseModel):
#     message: str
#     user_id: str = "default_user"
#     session_id: Optional[str] = None

# class InterviewRequest(BaseModel):
#     interview_type: str
#     user_id: str = "default_user"
#     session_id: Optional[str] = None

# class SkillTestRequest(BaseModel):
#     topic: str
#     user_id: str = "default_user"
#     session_id: Optional[str] = None

# class ResumeRequest(BaseModel):
#     resume_text: str
#     question: str = "Analyze this resume"

# # Health check endpoint
# @app.get("/")
# async def root():
#     return {
#         "message": "AI Prep Hub API",
#         "version": "1.0.0",
#         "endpoints": ["/chat", "/start-interview", "/skill-test", "/resume-analysis", "/health"]
#     }

# @app.get("/health")
# async def health():
#     return {"status": "healthy"}

# # Main chat endpoint
# @app.post("/chat")
# async def chat(request: ChatRequest):
#     try:
#         session_id = request.session_id or f"chat_{request.user_id}_{int(time.time())}"
        
#         response = await handle_user_message(
#             user_message=request.message,
#             user_id=request.user_id,
#             session_id=session_id
#         )
#         return {"reply": response, "session_id": session_id}
#     except Exception as e:
#         print(f"Chat error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# # Start interview endpoint
# @app.post("/start-interview")
# async def start_interview(request: InterviewRequest):
#     try:
#         session_id = request.session_id or f"interview_{request.user_id}_{int(time.time())}"
        
#         message = f"You are interviewing for the role of {request.interview_type}. Start by greeting me and asking your first interview question."
#         response = await handle_user_message(
#             user_message=message,
#             user_id=request.user_id,
#             session_id=session_id
#         )
#         return {"reply": response, "session_id": session_id}
#     except Exception as e:
#         print(f"Interview error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Interview failed: {str(e)}")

# # Skill test endpoint
# @app.post("/skill-test")
# async def skill_test(request: SkillTestRequest):
#     try:
#         session_id = request.session_id or f"skill_{request.user_id}_{int(time.time())}"
        
#         message = f"Generate one technical question to test {request.topic} knowledge. Just provide the question, nothing else."
#         response = await handle_user_message(
#             user_message=message,
#             user_id=request.user_id,
#             session_id=session_id
#         )
#         return {"test": response}
#     except Exception as e:
#         print(f"Skill test error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Skill test failed: {str(e)}")

# # Resume analysis endpoint
# @app.post("/resume-analysis")
# async def resume_analysis(request: ResumeRequest):
#     try:
#         session_id = f"resume_{int(time.time())}"
        
#         message = f"{request.question}\n\nResume content:\n{request.resume_text}"
#         response = await handle_user_message(
#             user_message=message,
#             user_id="resume_user",
#             session_id=session_id
#         )
#         return {"analysis": response}
#     except Exception as e:
#         print(f"Resume analysis error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8080)
