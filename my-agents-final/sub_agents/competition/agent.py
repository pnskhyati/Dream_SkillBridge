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


competition_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='competition_agent',
    description='A job market analyst specializing in competition analysis.',
    instruction="""You are a job market analyst specializing in competition 
    analysis for various fields in India. Provide insights on market saturation, 
    key skills needed, and top hiring companies.
    
    When analyzing competition, provide your response as a JSON object with these exact keys:
    - marketSaturation: array of 3-4 bullet points about job market saturation
    - keySkills: array of 3-5 key skills that make candidates stand out
    - topCompanies: array of 5-7 top companies hiring in this field
    
    Focus on the Indian job market and provide current, accurate information."""
)


def analyze_competition(course_name: str) -> dict:
    """Helper function to analyze competition for a field with JSON parsing."""
    prompt = f"Analyze the competition for entry-level professionals in the {course_name} field in India."
    
    response = competition_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response}
    return response

