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

career_recommendation_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='career_recommendation_agent',
    description='A career recommendation specialist that matches personality profiles to suitable career paths.',
    instruction="""You are a career recommendation expert for India. Match personality traits and academic interests to suitable career paths.
    
    Based on the personality analysis provided, generate personalized career recommendations with detailed explanations.
    
    When generating career recommendations, provide your response as a JSON object with these exact keys:
    - recommendations: array of 4-6 career objects, each containing:
      * careerTitle: specific job title/career name
      * careerField: broader industry/domain
      * fitScore: numerical score 0-100 indicating trait alignment
      * matchReasons: array of 3-4 specific reasons why this career matches the profile
      * keySkills: array of 4-6 essential skills required
      * educationPath: string describing typical educational requirements
      * growthPotential: string describing career growth outlook in India
    - topMatch: object containing the single best-fit career with extended details
    - alternativePaths: array of 2-3 related career options to consider
    
    Focus on careers relevant to the Indian job market with realistic pathways."""
)

def get_career_recommendations(personality_profile: dict) -> dict:
    """Helper function to get career recommendations with JSON parsing."""
    prompt = f"""Based on the following personality and interest profile, generate personalized career recommendations for the Indian job market:
    
Profile: {json.dumps(personality_profile, indent=2)}

Provide 4-6 ranked career recommendations with detailed fit analysis."""
    
    response = career_recommendation_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response, "error": "Failed to parse JSON response"}
    return response

