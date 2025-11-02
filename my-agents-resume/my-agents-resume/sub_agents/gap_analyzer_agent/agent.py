from google.adk.agents import Agent

gap_analyzer_agent = Agent(
    model='gemini-2.5-flash',
    name='gap_analyzer_agent',
    description='Agent to identify skill gaps between resume and job description, and give suggestions.',
    instruction='Compares resume and job description and outputs skill gaps and improvements.',
)
