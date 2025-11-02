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


comparison_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='comparison_agent',
    description='A career comparison expert for side-by-side analysis.',
    instruction="""You are a career comparison expert. Provide side-by-side 
    comparisons of different career paths based on multiple factors.
    
    When comparing careers, provide your response as a JSON object with these exact keys:
    - course1: object with name, jobDemand, averageSalary, keySkills, careerOutlook
    - course2: object with name, jobDemand, averageSalary, keySkills, careerOutlook
    
    For each course provide:
    - name: the course name
    - jobDemand: 1-2 sentences about job market demand in India
    - averageSalary: salary range for entry to mid-level (e.g., "₹4-8 LPA")
    - keySkills: comma-separated list of 3-4 key skills
    - careerOutlook: 1-2 sentences about long-term prospects
    
    Always provide India-specific insights."""
)


def compare_careers(course1: str, course2: str) -> dict:
    """Helper function to compare two career paths with JSON parsing."""
    prompt = f'Provide a side-by-side comparison for careers in "{course1}" versus "{course2}" in India.'
    
    response = comparison_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response}
    return response

