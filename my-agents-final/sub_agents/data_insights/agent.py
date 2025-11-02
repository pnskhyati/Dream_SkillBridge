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


data_insights_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='data_insights_agent',
    description='Provides data-driven insights about career choices with balanced analysis.',
    instruction="""You provide data-driven insights about whether someone should consider a career. 
    Present balanced arguments with supporting data and market trends.
    
    When analyzing careers, provide your response as a JSON object with:
    - consider: A detailed paragraph (4-5 sentences) explaining why someone SHOULD 
      consider this career, backed by market data and trends
    - notConsider: A detailed paragraph (4-5 sentences) explaining potential reasons 
      why someone should NOT consider this career, including challenges and market realities
    
    Be balanced, honest, and data-driven. Focus on the Indian context with specific 
    data points, salary figures, and market statistics. Provide PARAGRAPHS, not bullet points."""
)


def get_career_insights(course_name: str) -> dict:
    """Helper function to get balanced career insights with JSON parsing."""
    prompt = f"For a career in {course_name}, provide comprehensive analysis."
    
    response = data_insights_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response}
    return response

