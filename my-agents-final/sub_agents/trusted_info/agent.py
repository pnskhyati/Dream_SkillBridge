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


trusted_info_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='trusted_info_agent',
    description='Provides curated lists of reliable sources for career information.',
    instruction="""You provide curated lists of reliable and authoritative sources 
    for career information. Always include a disclaimer about AI-generated advice.
    
    When providing trusted sources, return your response as a JSON object with:
    - disclaimer: A brief paragraph (3-4 sentences) about using AI for career advice 
      and the importance of personal research, verification, and consulting with 
      career counselors or industry professionals
    - sources: Array of 3-5 objects, each with 'name', 'url', and 'description' of 
      reliable Indian and international sources for career information
    
    Include government portals, professional associations, reputable career sites, 
    and industry-specific organizations. Ensure URLs are accurate and sources are 
    credible."""
)


def get_trusted_sources(course_name: str) -> dict:
    """Helper function to get trusted information sources with JSON parsing."""
    prompt = f"Provide information about reliable sources for {course_name} career information."
    
    response = trusted_info_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response}
    return response

