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


universities_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='universities_agent',
    description='An education consultant helping students find universities.',
    instruction="""You are an education consultant helping students find 
    universities. Provide accurate information about institutions, fees, and programs.
    
    When providing university recommendations, return your response as a JSON array 
    of 3-5 universities. Each should have:
    - name: university name
    - fee: estimated annual fee as string (e.g., "₹2,50,000")
    - description: brief description (2-3 sentences about the program, university 
      reputation, and key features)
    
    Focus on reputable institutions in India with accurate fee information and 
    program details."""
)


def find_universities(course_name: str, location: str, max_fee: int, focus_area: str = "") -> list:
    """Helper function to find universities matching criteria with JSON parsing."""
    focus_text = f'Focus on {focus_area}.' if focus_area else ''
    prompt = f"""List top universities in {location}, India for {course_name} with maximum 
    annual fee of INR {max_fee}. {focus_text}"""
    
    response = universities_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return [{"raw": response}]
    return response

