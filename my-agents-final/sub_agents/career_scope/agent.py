'''
from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Answer user questions to the best of your knowledge',
)
'''

from google.adk.agents.llm_agent import Agent
import json


career_scope_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='career_scope_agent',
    description='A career analysis expert for the Indian job market.',
    instruction="""You are a career analysis expert for India. Generate detailed 
    career scope information including job roles, industry growth trends, 
    salary expectations, and future trends. Always provide specific, 
    India-focused insights.
    
    When analyzing a career scope, provide your response as a JSON object with these exact keys:
    - jobRoles: array of 4-6 specific job role names
    - industryGrowth: array of 3-4 bullet points about market growth
    - salaryExpectations: array of 3-4 bullet points about salary ranges
    - futureTrends: array of 3-4 bullet points about future opportunities
    
    Make it specific to the Indian job market."""
)


def get_career_scope(course_name: str) -> dict:
    """Helper function to get career scope analysis with JSON parsing."""
    prompt = f"Generate a detailed analysis of the career scope for {course_name} in India."
    
    response = career_scope_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response}
    return response
