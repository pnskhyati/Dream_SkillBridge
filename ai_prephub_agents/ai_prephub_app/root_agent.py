# from google.ai.agent import Agent
# from google.generativeai import GenerativeModel

from google.adk.agents import Agent

# Import sub-agents (unchanged)
from .subagents.mock_interview.agent import mock_interview
from .subagents.skill_tester.agent import skill_tester
from .subagents.resume_qna.agent import resume_qna

# MAIN ROOT AGENT
root_agent = Agent(
    model="gemini-2.0-flash",   # ✅ updated model API
    name="ai_prephub",
    description=(
        "Career prep assistant coordinating interview practice, "
        "skill tests, and resume guidance."
    ),
    instruction=(
        "Act as a coordinator. "
        "Route interview practice to mock_interview, skills assessment "
        "to skill_tester, and resume questions to resume_qna. "
        "If unclear, ask a clarifying question."
    ),
    sub_agents=[mock_interview, skill_tester, resume_qna],
)
# from google.adk.agents.llm_agent import Agent

# # Use relative imports for subagents in same package
# from .subagents.mock_interview.agent import mock_interview
# from .subagents.skill_tester.agent import skill_tester
# from .subagents.resume_qna.agent import resume_qna

# root_agent = Agent(
#     model='gemini-2.5-flash',
#     name='ai_prephub',
#     description='Career prep assistant coordinating interview practice, skill tests, and resume guidance.',
#     instruction=(
#         'Act as a coordinator. '
#         'Route interview practice to mock_interview, skills assessment to skill_tester, '
#         'and resume questions to resume_qna. '
#         'If a request fits none of the above, answer briefly or ask a clarifying question.'
#     ),
#     sub_agents=[mock_interview, skill_tester, resume_qna],
# )
