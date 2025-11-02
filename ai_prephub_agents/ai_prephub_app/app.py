"""Runner module to handle user messages through ADK agents"""
import sys
from pathlib import Path

# Add CURRENT directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from ai_prephub_app.root_agent import root_agent

# Initialize session service and runner WITH agent
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name="ai_prephub",
    session_service=session_service
)

async def handle_user_message(
    user_message: str, 
    user_id: str = "default_user", 
    session_id: str = "default_session"
):
    """
    Process user messages through the ADK agent system.
    """
    try:
        # Create message content in ADK format
        content = types.Content(
            role='user',
            parts=[types.Part(text=user_message)]
        )
        
        final_response = "Agent did not produce a response."
        
        # Run the agent
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content
        ):
            if event.is_final_response():
                if event.content and event.content.parts:
                    final_response = event.content.parts[0].text
                elif hasattr(event, 'error_message') and event.error_message:
                    final_response = f"Error: {event.error_message}"
                break
        
        return final_response
    
    except Exception as e:
        print(f"Error in handle_user_message: {str(e)}")
        raise Exception(f"Failed to process message: {str(e)}")
