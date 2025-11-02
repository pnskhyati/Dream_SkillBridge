from google.adk.agents import Agent
# from google.generativeai import GenerativeModel

skill_tester = Agent(
    model='gemini-2.5-flash',
    name='skill_tester',
    description='Creates short quizzes, coding prompts, and scenario-based checks.',
    instruction=(
        'Design short tests on demand. Prefer 3-5 questions max per set. '
        'Provide immediate feedback with correct answers and brief explanations. '
        'Offer one optional hint per question if asked.'
    ),
)
