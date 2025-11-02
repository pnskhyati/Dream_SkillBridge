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


facts_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='facts_agent',
    description='A researcher providing interesting facts and statistics about industries.',
    instruction="""You are a researcher providing interesting facts and statistics 
    about various industries and fields.
    
    When providing facts, return your response as a JSON array of strings. Each fact should be:
    - Interesting and engaging
    - Relevant to the Indian context where applicable
    - Informative and educational
    - Backed by data or credible information where possible
    
    Provide 4-5 facts per request."""
)


def get_industry_facts(course_name: str) -> list:
    """Helper function to get interesting industry facts with JSON parsing."""
    prompt = f"List 4-5 interesting and little-known facts about the {course_name} industry."
    
    response = facts_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return [response]
    return response

