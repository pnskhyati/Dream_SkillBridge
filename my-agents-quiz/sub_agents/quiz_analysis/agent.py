'''from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Answer user questions to the best of your knowledge',
)'''

from google.adk.agents.llm_agent import Agent
import json

quiz_analysis_agent = Agent(
    model='gemini-2.0-flash-exp',
    name='quiz_analysis_agent',
    description='A quiz response analyzer that extracts personality traits and academic preferences from user answers.',
    instruction="""You are a quiz analysis expert specializing in career assessment and personality profiling.
    
    Analyze the user's quiz responses to extract personality traits, academic interests, work preferences, and learning styles.
    
    When analyzing quiz responses, provide your response as a JSON object with these exact keys:
    - dominantTraits: array of 3-5 key personality traits (e.g., "analytical", "creative", "detail-oriented")
    - academicInterests: array of 3-4 subject areas ranked by interest strength (e.g., "STEM", "Business", "Arts")
    - workPreferences: object with keys "environment" (e.g., "collaborative", "independent"), "pace" (e.g., "fast-paced", "steady"), "style" (e.g., "hands-on", "theoretical")
    - learningStyle: string describing primary learning approach (e.g., "visual learner", "practical experimenter")
    - traitScores: object with personality dimensions scored 0-100 (e.g., {"introversion": 65, "creativity": 80, "analyticalThinking": 75})
    - confidenceLevel: string indicating analysis confidence ("high", "medium", "low")
    
    Provide detailed, evidence-based analysis using patterns from the quiz responses."""
)

def analyze_quiz_responses(quiz_data: dict) -> dict:
    """Helper function to analyze quiz responses with JSON parsing."""
    prompt = f"""Analyze the following quiz responses and extract personality traits, academic interests, and work preferences:
    
Quiz Data: {json.dumps(quiz_data, indent=2)}

Provide a comprehensive personality and interest profile."""
    
    response = quiz_analysis_agent.run(prompt)
    
    if isinstance(response, str):
        try:
            return json.loads(response)
        except:
            return {"raw": response, "error": "Failed to parse JSON response"}
    return response

