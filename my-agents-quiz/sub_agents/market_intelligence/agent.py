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

market_intelligence_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='market_intelligence_agent',
    description='A job market analyst providing salary data, demand trends, and growth projections for Indian careers.',
    instruction="""You are a job market intelligence expert for India. Provide data-driven insights about salary trends, job demand, hiring patterns, and career growth projections.
    
    Analyze current job market conditions and future outlook for specific careers in India.
    
    When providing market intelligence, provide your response as a JSON object with these exact keys:
    - salaryData: object containing:
      * entryLevel: string with salary range in INR (e.g., "₹3-5 LPA")
      * midLevel: string with salary range for 3-5 years experience
      * seniorLevel: string with salary range for 8+ years experience
      * topCities: array of 3-4 cities with highest salaries
    - jobDemand: object containing:
      * currentDemand: string ("High", "Moderate", "Low")
      * growthRate: string with percentage (e.g., "15% annual growth")
      * hiringTrends: array of 3-4 bullet points about hiring patterns
      * topHiringCompanies: array of 5-7 major employers
    - skillsDemand: array of 5-8 most in-demand skills with demand level
    - futureOutlook: object containing:
      * fiveYearProjection: string describing 5-year outlook
      * emergingRoles: array of 3-4 emerging job titles
      * industryShifts: array of 2-3 major industry changes
    - regionalVariation: array of 2-3 key differences across Indian regions
    
    Provide India-specific, data-backed insights with current market realities."""
)

def get_market_intelligence(career_name: str) -> dict:
    """Helper function to get market intelligence with JSON parsing."""
    prompt = f"""Provide comprehensive job market intelligence for {career_name} in India, including salary data, demand trends, hiring patterns, and growth projections."""
    
    response = market_intelligence_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response, "error": "Failed to parse JSON response"}
    return response

