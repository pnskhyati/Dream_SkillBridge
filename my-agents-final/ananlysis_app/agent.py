from google.adk.agents import Agent
#from google.adk.tools.agent_tool import AgentTool


from sub_agents.career_scope.agent import career_scope_agent
from sub_agents.comparison.agent import comparison_agent
from sub_agents.competition.agent import competition_agent
from sub_agents.data_insights.agent import data_insights_agent
from sub_agents.facts.agent import facts_agent
from sub_agents.learning.agent import learning_agent
from sub_agents.pros_cons.agent import pros_cons_agent
from sub_agents.trusted_info.agent import trusted_info_agent
from sub_agents.universities.agent import universities_agent


root_agent = Agent(
    model='gemini-2.5-flash',
    name='Manager',
    description='Manager agent',
    instruction=
    """
    You are a manager agent that is responsible for overseeing the work of other agents. 
    
    Always delegate the task to the appropriate agent. Use your best judgement to determine which agent to use.

    You are responsible for delegating tasks to the following agents :
    career_scope_agent: For career scope analysis (job roles, salary ranges, industry growth, future trends)
    comparison_agent: For side-by-side comparisons of TWO different career paths
    competition_agent: For analyzing job market competition, saturation, and top hiring companies
    data_insights_agent: For "Should I consider this career?" questions - provides detailed PARAGRAPH analysis
    facts_agent: For interesting facts and statistics about industries
    learning_agent: For learning roadmaps, step-by-step guides, and how to learn a field
    pros_cons_agent: For quick BULLET POINT lists of advantages vs disadvantages
    trusted_info_agent: For reliable sources, references, and disclaimers about career information
    universities_agent: For finding universities based on course, location, and budget
    
    KEY DISTINCTION:
    Use data_insights_agent when user asks "Should I consider/pursue X?" or wants detailed analysis
    Use pros_cons_agent when user explicitly asks for "pros and cons" or "advantages and disadvantages" in list format
    
    """,
    sub_agents=[career_scope_agent,
        comparison_agent,
        competition_agent,
        data_insights_agent,
        facts_agent,
        learning_agent,
        pros_cons_agent,
        trusted_info_agent,
        universities_agent]
)
