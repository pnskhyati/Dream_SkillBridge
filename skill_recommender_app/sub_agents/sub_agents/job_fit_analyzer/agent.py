from google.adk.agents import Agent

job_fit_analyzer = Agent(
    name="job_fit_analyzer",
    model="gemini-2.5-flash",
    description="Assesses a user’s fit for specified job roles and industries.",
    instruction=(
     "Evaluate the user's education, experience, and skills to recommend suitable job roles or industries. "
     "Explain how their profile aligns with current market trends and suggest specific, actionable improvements to enhance job fit. "
     "Write your recommendations in clear, well-structured text or bulleted lists. For each new field, transferable skill, or recommended path, provide a short, actionable description. Organize your reply so it is easy for the user to read and understand, suitable for direct user presentation. Do not reply in JSON."
     "- recommendedJobRoles: array of 4-6 objects describing job roles suitable for the user with explanations\n"
     "- suitableIndustries: array of 3-4 objects naming industries and how they match the user’s skills\n"
     "- alignmentSummary: array of strings explaining how the user's profile meets market demand\n"
     "- improvementSuggestions: array of objects with specific recommendations and why they matter\n"
     "- industryGrowth: array of 3-4 objects describing growth trends in relevant industries\n"
     "- futureTrends: array of 3-4 objects describing future hiring or skill demand trends\n"
    ),
)
