from google.adk.agents import Agent
from sub_agents.career_transition.agent import career_transition_specialist
from sub_agents.graduate_advisor.agent import graduate_advisor
from sub_agents.certificate_recommender.agent import certificate_recommender
from sub_agents.skill_gap_analyzer.agent import skill_gap_analyzer
from sub_agents.job_fit_analyzer.agent import job_fit_analyzer
from sub_agents.mental_health_supporter.agent import mental_health_supporter
from sub_agents.hiring_insights.agent import hiring_insights
from sub_agents.Internship_guide.agent import Internship_guide
from sub_agents.competition_recommender.agent import competition_recommender

# Main orchestrator agent
root_agent = Agent(
    name='skill_recommender_agent',
    model='gemini-2.5-flash',
    description='An AI career advisor that routes requests to specialized sub-agents.',
    instruction=(
    "Act as an intelligent orchestrator that delegates user queries to the appropriate sub-agent "
    "based on their needs, background, and goals. Analyze the user profile and query to determine "
    "which specialized agent(s) should handle the request. Each sub-agent will respond with a set "
    "of descriptive items or recommendations. "
    "Your role is to combine these insights into a unified, well-organized, and easy-to-read structured text response. "
    "Organize information under clear headings and bullet points. Use numbered steps, lists, or sections for clarity. "
    "Write your recommendations in clear, well-structured text or bulleted lists. For each new field, transferable skill, or recommended path, provide a short, actionable description. Organize your reply so it is easy for the user to read and understand, suitable for direct user presentation. Do not reply in JSON."
    ),
    sub_agents=[
        graduate_advisor,
        certificate_recommender,
        skill_gap_analyzer,
        job_fit_analyzer,
        career_transition_specialist,
        mental_health_supporter,
        hiring_insights,
        Internship_guide,
        competition_recommender
    ]
)

profile_questions = [
    "What is your current situation? (e.g., student, working professional, job seeker)",
    "What is your educational background? (degrees, majors, certifications)",
    "What kind of work experience do you have? (internships, projects, roles, industry)",
    "What are your main interests or passions? (things you enjoy learning or doing)",
    "Which career fields or roles are you most curious about?",
    "What is your primary career goal? (find a job, upskill, career switch, pursue higher studies)"
]

profile_keys = [
    "current_situation", "education", "work_experience",
    "interests", "career_fields", "career_goals"
]

def create_prompt(profile, user_query=None):
    prompt = (
        f"User Profile:\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"Current Situation: {profile.get('current_situation', 'Not provided')}\n"
        f"Education: {profile.get('education', 'Not provided')}\n"
        f"Work Experience: {profile.get('work_experience', 'Not provided')}\n"
        f"Interests: {profile.get('interests', 'Not provided')}\n"
        f"Career Fields: {profile.get('career_fields', 'Not provided')}\n"
        f"Career Goals: {profile.get('career_goals', 'Not provided')}\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
    )
    if user_query:
        prompt += (
            f"User Question: {user_query}\n\n"
            "Route this query to the appropriate sub-agent(s) and provide a personalized response."
        )
    else:
        prompt += (
            "Based on this profile, provide comprehensive career guidance by consulting appropriate sub-agents. "
            "Include:\n"
            "1. Skill gap analysis relative to target roles\n"
            "2. Job fit recommendations based on background and interests\n"
            "3. Relevant courses, certifications, or graduate programs\n"
            "4. Career transition strategies if applicable\n\n"
            "Prioritize actionable advice and specific recommendations."
        )
    return prompt

def format_profile_summary(profile):
    summary = "📋 **Profile Summary**\n\n"
    for key, question in zip(profile_keys, profile_questions):
        value = profile.get(key, "Not provided")
        label = question.split("?")[0].strip()
        summary += f"**{label}:**\n{value}\n\n"
    return summary

def run(message, state=None):
    if state is None:
        state = {"step": 0, "profile": {}, "profile_complete": False}
    step = state["step"]
    if step == 0:
        state["step"] = 1
        return {
            "response": (
                "👋 **Welcome to the AI Career Advisor!**\n\n"
                "I'll help you navigate your career path by asking a few questions.\n"
                "Let's get started!\n\n"
                f"{profile_questions[0]}"
            ),
            "state": state
        }
    if 1 <= step <= len(profile_keys):
        state["profile"][profile_keys[step - 1]] = message.strip()
        if step < len(profile_questions):
            state["step"] += 1
            return {
                "response": f"✓ Got it!\n\n{profile_questions[step]}",
                "state": state
            }
        else:
            state["step"] = 7
            state["profile_complete"] = True
            summary = format_profile_summary(state["profile"])
            prompt = create_prompt(state["profile"])
            try:
                advisor_reply = root_agent.invoke(prompt)  # Changed from run() to invoke()
                response = (
                    f"{summary}\n"
                    f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                    f"🎯 **Career Guidance**\n\n{advisor_reply}\n\n"
                    f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                    f"💬 Feel free to ask follow-up questions about:\n"
                    f"• Specific skills to develop\n"
                    f"• Recommended courses or certifications\n"
                    f"• Graduate programs\n"
                    f"• Job search strategies\n"
                    f"• Career transition plans"
                )
            except Exception as e:
                response = (
                    f"⚠️ An error occurred while generating guidance: {str(e)}\n\n"
                    "Please try asking a specific question about your career goals."
                )
            return {
                "response": response,
                "state": state
            }
    if step >= 7 and state.get("profile_complete"):
        prompt = create_prompt(state["profile"], user_query=message)
        try:
            advisor_reply = root_agent.invoke(prompt)  # Changed from run() to invoke()
            state["step"] += 1
            return {
                "response": advisor_reply,
                "state": state
            }
        except Exception as e:
            return {
                "response": f"⚠️ Error: {str(e)}\n\nPlease rephrase your question.",
                "state": state
            }
    return {
        "response": "Something went wrong. Type 'restart' to begin again.",
        "state": state
    }

__all__ = ["root_agent", "run"]
