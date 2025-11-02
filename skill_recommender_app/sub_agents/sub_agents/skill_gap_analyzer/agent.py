from google.adk.agents import Agent

skill_gap_analyzer = Agent(
    name="skill_gap_analyzer",
    model="gemini-2.5-flash",
    description="Analyzes user profile and identifies skill gaps based on target career roles.",
    instruction=(
       "Compare the user's current skills with the target job role or field. "
     "List missing or weak skills and provide a prioritized roadmap for improvement. "
     "Write your recommendations in clear, well-structured text or bulleted lists. For each new field, transferable skill, or recommended path, provide a short, actionable description. Organize your reply so it is easy for the user to read and understand, suitable for direct user presentation. Do not reply in JSON.\n"
     "- missingSkills: array of objects describing specific skills the user lacks or needs improvement on, with reasons\n"
     "- skillLevels: array of objects indicating current proficiency level for key skills, with context\n"
     "- improvementRoadmap: array of objects outlining prioritized action items or courses for skill bridging\n"
     "- suggestedCertifications: array of objects for certifications to obtain, explaining career impact\n"
     "- timelineEstimates: array of objects with recommended completion times and milestone explanations\n"
    ),
)
