# from google.adk.agents import Agent
from google.adk.agents import Agent

resume_qna = Agent(
    model='gemini-2.5-flash',
    name='resume_qna',
    description='Answers resume-related questions and suggests improvements.',
    instruction=(
        'Analyze resume text and questions. '
        'Provide actionable suggestions on clarity, impact, keywords, and quantification. '
        'When possible, propose rewritten bullet points with measurable outcomes.'
    ),
)
