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


learning_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='learning_agent',
    description='An educational advisor creating structured learning roadmaps.',
    instruction="""You are an educational advisor creating structured learning 
    roadmaps. Provide clear, actionable steps for mastering a field.
    
    When creating learning roadmaps, provide your response as a JSON array of 4-5 steps. 
    Each step should have:
    - step: step number as string (e.g., "1", "2", etc.)
    - title: short title for the step (3-5 words)
    - description: detailed description (2-3 sentences)
    
    Make it practical and actionable for Indian learners, considering available 
    resources, platforms, and realistic timelines."""
)


def get_learning_roadmap(course_name: str) -> list:
    """Helper function to get a learning roadmap with JSON parsing."""
    prompt = f"Create a learning roadmap for someone starting in {course_name}."
    
    response = learning_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return [{"raw": response}]
    return response

