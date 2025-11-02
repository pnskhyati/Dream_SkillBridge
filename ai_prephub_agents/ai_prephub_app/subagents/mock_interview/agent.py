# from google.adk.agents import Agent
from google.adk.agents import Agent



mock_interview = Agent(
    model='gemini-2.5-flash',
    name='mock_interview',
    description='Conducts behavioral and technical mock interviews.',
    instruction='Ask one question at a time; probe; then give short feedback and score.'
)