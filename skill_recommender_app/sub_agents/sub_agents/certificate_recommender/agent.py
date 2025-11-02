from google.adk.agents import Agent

certificate_recommender = Agent(
    name="certificate_recommender",
    model="gemini-2.5-flash",
    description="Recommends courses, certifications, and learning programs based on educational,and professional goals.",
    instruction=(
      "Analyze the user's career goals, current skills, and industry. "
     "Recommend online courses or certifications that enhance employability, "
     "with each recommendation including a brief explanation of its career value. "
     "Include providers like Coursera, Google YouTube videos, Udemy, and AWS where relevant. "
     "Write your recommendations in clear, well-structured text or bulleted lists. For each new field, transferable skill, or recommended path, provide a short, actionable description. Organize your reply so it is easy for the user to read and understand, suitable for direct user presentation. Do not reply in JSON."
     "- recommendedCourses: array of objects with 'name' (course/certification), 'provider', and 'description' (how it helps the user)\n"
     "- courseLinks: array of objects with 'name' (matching course/certification) and 'url' (direct link to the course)\n"
     "- keySkills: array of objects, each with 'skill' and 'course' (source of the skill, by name)\n"
     "- providerSummary: array of objects with 'provider' and 'summary' (one-line about their career value)\n"
    ),
)
