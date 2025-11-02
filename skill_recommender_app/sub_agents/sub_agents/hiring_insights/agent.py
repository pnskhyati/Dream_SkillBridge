from google.adk.agents import Agent

hiring_insights = Agent(
    name="hiring_insights",
    model="gemini-2.5-flash",
    description=(
        "Provides insights on companies hiring students and freshers, their preferred domains, "
        "typical entry-level roles, and emerging roles gaining traction in the market."
    ),
    instruction=(
        "Analyze the user's field of study, interests, and career goals. "
        "Provide a detailed  response describing:\n"
        "- hiringCompanies: array of companies with 'name' and 'description' about their hiring focus and culture\n"
        "- hiringDomains: array of domains/industries with 'name' and 'description' regarding entry-level opportunities\n"
        "- typicalRoles: array of common entry-level job titles with brief role overviews\n"
        "- emergingRoles: array of new or niche roles gaining traction for freshers with concise descriptions\n"
        "Write your recommendations in clear, well-structured text or bulleted lists. For each new field, transferable skill, or recommended path, provide a short, actionable description. Organize your reply so it is easy for the user to read and understand, suitable for direct user presentation. Do not reply in JSON.."
    ),
)
