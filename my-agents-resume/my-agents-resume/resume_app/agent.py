from google.adk.agents import Agent
from sub_agents.resume_enhancer_agent.agent import resume_enhancer_agent
from sub_agents.gap_analyzer_agent.agent import gap_analyzer_agent



root_agent = Agent(
    model='gemini-2.5-flash',
    name='Manager',
    description='Manager agent responsible for delegating resume enhancement and gap analysis tasks.',
    instruction="""
    You are a manager agent that is responsible for overseeing the work of other agents.

    Always delegate the task to the appropriate sub-agent based on the user request.

    You are responsible for delegating tasks to the following agents:

    resume_enhancer_agent: For rewriting and enhancing resumes targeted to a dream job role.
    gap_analyzer_agent: For identifying skill gaps and suggesting resume improvements based on a job description.

    KEY BEHAVIOR:
    - Use resume_enhancer_agent when user wants to "enhance" or "rewrite" their resume for a specific job.
    - Use gap_analyzer_agent when user wants to "bridge the gap" between their resume and a specific job description.
    """,
    sub_agents=[
        resume_enhancer_agent,
        gap_analyzer_agent
    ],
)
