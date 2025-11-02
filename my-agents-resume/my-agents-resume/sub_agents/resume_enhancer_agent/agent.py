from google.adk.agents import Agent

resume_enhancer_agent = Agent(
    model='gemini-2.5-flash',
    name='resume_enhancer_agent',
    description='Agent to enhance and rewrite resumes for target job roles.',
    instruction='Reads resume content and dream job role, outputs a fully rewritten, enhanced resume to match the job.',
)
