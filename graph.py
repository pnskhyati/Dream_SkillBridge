import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load dataset
df = pd.read_csv("student_career_dataset.csv")

# Sidebar for course selection
st.sidebar.title("Select a Course")
career = st.sidebar.radio(
    "Choose a career stream:",
    df["Degree_Program"].unique()
)

# Filter for selected career
career_df = df[df["Degree_Program"] == career]

# Main Title
st.title(f"{career}")

# Career Description
why_choose = career_df["Why_Choose"].iloc[0] if "Why_Choose" in career_df.columns else "N/A"
why_not = career_df["Why_Not_Choose"].iloc[0] if "Why_Not_Choose" in career_df.columns else "N/A"

st.markdown(f"""
✅ **Why You Should Consider It**  
{why_choose}  

❌ **Why You Should Not Consider It**  
{why_not}  
""")

# =======================
# Layout for charts
# =======================
col1, col2 = st.columns(2)

# 1. Enrollment Trends
with col1:
    enrollment_trends = career_df.groupby("Year")["Student_ID"].count()
    fig1, ax1 = plt.subplots()
    ax1.bar(enrollment_trends.index, enrollment_trends.values, color="skyblue", alpha=0.8, label="Student Enrollment")
    ax1.set_title("Student Enrollment Trends")
    ax1.set_xlabel("Year")
    ax1.set_ylabel("Number of Students")
    ax1.legend()
    st.pyplot(fig1)

# 2. Average Salary Trends
with col2:
    salary_trends = career_df.groupby("Year")["Starting_Salary"].mean() / 100000
    fig2, ax2 = plt.subplots()
    ax2.plot(salary_trends.index, salary_trends.values,
             marker="o", color="blue", label="Average Salary")
    ax2.fill_between(salary_trends.index, salary_trends.values, alpha=0.2, color="blue")
    ax2.set_title("Average Salary Trends (in Lakhs INR)")
    ax2.set_xlabel("Year")
    ax2.set_ylabel("Salary (Lakhs)")
    ax2.legend()
    st.pyplot(fig2)

# Second row
col3, col4 = st.columns(2)

# 3. Job Market Growth
with col3:
    job_growth = career_df.groupby("Year")["Future_Demand_Score"].mean()
    latest_year = job_growth.index.max()
    latest_score = job_growth.loc[latest_year]

    fig3, ax3 = plt.subplots()
    wedges, texts, autotexts = ax3.pie([latest_score, 10 - latest_score],
                                       labels=["Positive Growth", "Negative/Stagnant Growth"],
                                       colors=["green","red"],
                                       autopct='%1.1f%%', startangle=140,
                                       wedgeprops=dict(width=0.4))
    ax3.set_title(f"Job Market Growth ({latest_year})")
    st.pyplot(fig3)

# 4. Student-to-Teacher Ratio
with col4:
    ratio_trends = (career_df.groupby("Year")["Student_ID"].count() / 10).round(2)  # 10 teachers assumption
    categories = ratio_trends.index.astype(str).tolist()
    values = ratio_trends.values.tolist()

    # close the loop
    values += values[:1]
    angles = np.linspace(0, 2*np.pi, len(categories), endpoint=False).tolist()
    angles += angles[:1]

    fig4 = plt.figure(figsize=(5,5))
    ax4 = plt.subplot(111, polar=True)
    ax4.plot(angles, values, 'o-', linewidth=2)
    ax4.fill(angles, values, alpha=0.25)
    ax4.set_xticks(angles[:-1])
    ax4.set_xticklabels(categories)
    ax4.set_title("Student-to-Teacher Ratio (per Year)")
    st.pyplot(fig4)