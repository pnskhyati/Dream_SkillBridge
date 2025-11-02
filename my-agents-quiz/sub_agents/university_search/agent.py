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

university_search_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='university_search_agent',
    description='A university and program finder specialized in Indian institutions and courses.',
    instruction="""You are a university search expert for India. Find universities and programs that align with specific career paths.
    
    Search and recommend universities based on course requirements, location preferences, and budget constraints.
    
    When providing university recommendations, provide your response as a JSON object with these exact keys:
    - universities: array of 5-8 university objects, each containing:
      * universityName: full name of institution
      * location: city and state
      * programs: array of relevant program names
      * programDuration: string (e.g., "4 years", "2 years")
      * estimatedFees: string with annual fee range in INR
      * admissionRequirements: array of 3-4 key requirements
      * specializations: array of available specializations
      * ranking: string describing institution reputation (e.g., "Tier 1", "NIRF Top 50")
    - filterCriteria: object showing applied filters (location, budget, program type)
    - alternativeOptions: array of 2-3 online/distance learning options if applicable
    
    Focus on Indian universities (IITs, NITs, central/state universities, private institutions)."""
)

def search_universities(career_field: str, location: str = None, budget: str = None) -> dict:
    """Helper function to search universities with JSON parsing."""
    prompt = f"""Find universities in India offering programs for a career in {career_field}.
    
Filters:
- Location: {location if location else "Pan-India"}
- Budget: {budget if budget else "All ranges"}

Provide detailed university and program information."""
    
    response = university_search_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response, "error": "Failed to parse JSON response"}
    return response

