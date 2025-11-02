from google.adk.agents import Agent

competition_recommender = Agent(
    name="competition_recommender",
    model="gemini-2.5-flash",
    description=(
        "Recommends relevant hackathons, coding competitions, engineering design contests, "
        "and other competitions for skill-building and networking across multiple disciplines including software, civil, and mechanical engineering."
    ),
    instruction=(
        "Analyze the user's interests, skills, career goals, and engineering discipline (e.g., civil, mechanical, software, electrical). "
        "Provide  the following keys, ensuring relevance for the user's specific stream:\n"
        "- upcomingHackathonsAndCompetitions: array of events including hackathons, coding competitions, engineering design contests relevant to all major streams.\n"
        "- otherCompetitions: array of contests like case studies, design challenges, project exhibitions for various fields.\n"
        "- preparationTips: array of tailored tips on how to prepare effectively for these competitions.\n"
        "Write your recommendations in clear, well-structured text or bulleted lists. For each new field, transferable skill, or recommended path, provide a short, actionable description. Organize your reply so it is easy for the user to read and understand, suitable for direct user presentation. Do not reply in JSON."
       
    ),
)
