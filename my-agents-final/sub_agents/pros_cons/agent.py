'''
from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Answer user questions to the best of your knowledge',
)
'''

from google.adk.agents import Agent
import json


pros_cons_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='pros_cons_agent',
    description='A career counselor providing balanced pros and cons analysis.',
    instruction="""You are a career counselor providing concise lists of pros and cons.
    
    When analyzing pros and cons, provide your response as a JSON object with these exact keys:
    - pros: array of 3-4 key advantages (short, concise bullet points)
    - cons: array of 3-4 key challenges or disadvantages (short, concise bullet points)
    
    Be honest and balanced. Focus on the Indian job market context. 
    Provide BRIEF BULLET POINTS, not paragraphs.
    
    Be honest and balanced in your assessment. Focus on the Indian job market context, 
    including realistic salary expectations, work-life balance, growth opportunities, 
    and industry challenges."""
)


def get_pros_cons(course_name: str) -> dict:
    """Helper function to get pros and cons analysis with JSON parsing."""
    prompt = f"What are the main pros and cons of pursuing a career in {course_name} in India?"
    
    response = pros_cons_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response}
    return response

