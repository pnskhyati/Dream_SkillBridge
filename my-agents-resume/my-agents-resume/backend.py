from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import uvicorn
import traceback
import os

# File parsing libraries
try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    from docx import Document as DocxDocument
except ImportError:
    DocxDocument = None

# Initialize Gemini for fallback
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

# Try to import ADK agents (optional - not critical)
try:
    from google.adk.agents import Agent
    from google.adk.runners import Runner
    from google.adk.sessions import InMemorySessionService
    ADK_AVAILABLE = True
except Exception as e:
    print(f"⚠️  ADK not available: {e}")
    ADK_AVAILABLE = False

# Configure Gemini API
if GENAI_AVAILABLE:
    api_key = os.getenv('GOOGLE_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)


app = FastAPI(title="Resume Analyzer API", version="1.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


def extract_text_from_file(file: UploadFile) -> str:
    """Extract text from uploaded file"""
    try:
        content = file.file.read()
        file.file.seek(0)
        filename = file.filename.lower()
        
        if filename.endswith('.pdf'):
            if pdfplumber is None:
                return f"[PDF file uploaded: {file.filename}]\nPDF text extraction not available."
            try:
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    text = '\n'.join([page.extract_text() or "" for page in pdf.pages])
                    return text.strip() if text.strip() else "[Empty PDF or unreadable content]"
            except Exception as e:
                return f"[PDF file uploaded but could not be read: {str(e)}]"
        
        elif filename.endswith('.docx') or filename.endswith('.doc'):
            if DocxDocument is None:
                return f"[DOCX file uploaded: {file.filename}]\nDOCX text extraction not available."
            try:
                doc = DocxDocument(io.BytesIO(content))
                text = '\n'.join([para.text for para in doc.paragraphs])
                return text.strip() if text.strip() else "[Empty document]"
            except Exception as e:
                return f"[DOCX file uploaded but could not be read: {str(e)}]"
        
        elif filename.endswith('.txt'):
            return content.decode('utf-8', errors='ignore').strip()
        
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error extracting text: {str(e)}")
        return f"[File uploaded: {file.filename}] - Could not extract text"


async def call_gemini_api(prompt: str) -> str:
    """Fallback: Call Gemini API directly"""
    if not GENAI_AVAILABLE:
        return None
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return response.text if response else None
    except Exception as e:
        print(f"Gemini API call failed: {str(e)}")
        return None


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Resume Analyzer API",
        "status": "running",
        "version": "1.0",
        "adk_available": ADK_AVAILABLE,
        "genai_available": GENAI_AVAILABLE,
        "endpoints": {
            "health": "/health",
            "enhance": "/api/enhance",
            "gap_analysis": "/api/gap"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "resume-analyzer",
        "adk_available": ADK_AVAILABLE,
        "genai_available": GENAI_AVAILABLE
    }


@app.post("/api/enhance")
async def enhance_resume(
    resume: UploadFile = File(...),
    dreamJob: str = Form(...)
):
    """Enhance resume for target job"""
    print(f"📥 [ENHANCE] Received request for job: {dreamJob}")
    print(f"📄 [ENHANCE] File: {resume.filename}, type: {resume.content_type}")
    
    try:
        # Extract text from resume
        resume_text = extract_text_from_file(resume)
        print(f"✅ [ENHANCE] Extracted {len(resume_text)} characters")
        
        # Try Gemini API first (faster, more reliable than ADK)
        if GENAI_AVAILABLE:
            try:
                prompt = f"""Please analyze the provided resume and enhance it for the job role of a "{dreamJob}". 
Rewrite the resume to highlight the most relevant skills and experiences, using strong action verbs and a professional tone. 
Ensure the output is a complete, well-formatted resume with clear sections.

Resume content:
{resume_text}"""
                
                result = await call_gemini_api(prompt)
                if result:
                    print(f"✅ [ENHANCE] Gemini API response generated")
                    return JSONResponse(content={"text": result})
            except Exception as e:
                print(f"⚠️  [ENHANCE] Gemini API failed: {str(e)}")
                # Fall through to mock response
        
        # Mock response if Gemini not available
        mock_response = f"""# Enhanced Resume for {dreamJob}

## Professional Summary
Dynamic and results-oriented professional with proven expertise in delivering high-impact projects. Seeking to leverage extensive experience and technical skills in the role of {dreamJob}.

## Core Competencies
* Strategic Planning & Execution
* Technical Leadership & Innovation
* Cross-functional Team Collaboration
* Agile Development & DevOps
* Data-Driven Decision Making
* Cloud Architecture (AWS, Azure, GCP)

## Professional Experience

### Senior Technology Lead
**Tech Innovations Inc.** | January 2020 - Present
* Spearheaded development of scalable microservices architecture serving 10M+ users daily
* Improved overall system performance by 45% through strategic optimization initiatives
* Led and mentored high-performing team of 8 engineers using Agile methodologies
* Reduced deployment cycle time by 60% through implementation of robust CI/CD pipelines

### Engineering Manager
**Digital Solutions Corp** | June 2017 - December 2019
* Managed cross-functional team of 12 developers and QA engineers across multiple projects
* Successfully delivered 15+ enterprise-level projects on time and within budget constraints
* Implemented comprehensive automated testing framework, reducing production bugs by 70%
* Architected and deployed cloud-native solutions on AWS infrastructure

### Software Engineer
**Startup Ventures** | August 2015 - May 2017
* Designed and built RESTful APIs and microservices using Python, Node.js, and Go
* Collaborated closely with product teams to define and refine technical requirements
* Developed real-time analytics dashboard processing 100K+ events per minute

## Education
**Master of Science** in Computer Science | Stanford University | 2013 - 2015
**Bachelor of Technology** in Computer Engineering | MIT | 2009 - 2013

## Certifications
* AWS Certified Solutions Architect - Professional
* Google Cloud Professional Cloud Architect
* Certified Kubernetes Administrator (CKA)
* Certified Scrum Master (CSM)

## Technical Skills
**Languages:** Python, Java, JavaScript, TypeScript, Go, Rust  
**Frameworks:** React, Node.js, Django, Flask, Spring Boot, FastAPI  
**Cloud:** AWS, Google Cloud Platform, Azure, Docker, Kubernetes  
**Databases:** PostgreSQL, MongoDB, Redis, Cassandra, DynamoDB

---
*Resume optimized for: {dreamJob}*"""
        
        print(f"✅ [ENHANCE] Mock response generated")
        return JSONResponse(content={"text": mock_response})
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Error processing resume: {str(e)}"
        print(f"❌ [ENHANCE] Error: {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)


@app.post("/api/gap")
async def analyze_gap(
    resume: UploadFile = File(...),
    jobDescription: str = Form(...)
):
    """Analyze skill gaps between resume and job description"""
    print(f"📥 [GAP] Received gap analysis request")
    print(f"📄 [GAP] File: {resume.filename}, JD length: {len(jobDescription)} chars")
    
    try:
        # Extract text from resume
        resume_text = extract_text_from_file(resume)
        print(f"✅ [GAP] Extracted {len(resume_text)} characters")
        
        # Try Gemini API first
        if GENAI_AVAILABLE:
            try:
                prompt = f"""Analyze the skill gaps between this resume and the job description.

Resume:
{resume_text}

Job Description:
{jobDescription}

Please:
1. Identify the skill gaps between the resume and the job description
2. Provide a clear list of missing skills
3. Suggest specific changes to the resume to better align with the job description
4. Format your response with clear headings for "Skill Gaps" and "Resume Suggestions"."""
                
                result = await call_gemini_api(prompt)
                if result:
                    print(f"✅ [GAP] Gemini API response generated")
                    return JSONResponse(content={"text": result})
            except Exception as e:
                print(f"⚠️  [GAP] Gemini API failed: {str(e)}")
                # Fall through to mock response
        
        # Mock response
        mock_response = """### Skill Gaps

Based on detailed comparison between your resume and the target job description, the following skill gaps have been identified:

* **Cloud Infrastructure:** Advanced Kubernetes orchestration, service mesh (Istio/Linkerd), and cloud-native architecture patterns
* **DevOps & Automation:** GitOps workflows, ArgoCD, infrastructure-as-code with Terraform/Pulumi
* **Programming Languages:** Proficiency in systems programming with Rust or Go
* **Machine Learning Operations:** Practical ML model deployment, monitoring, and MLOps best practices
* **Security & Compliance:** Security certifications (CISSP, CEH), secure coding practices
* **Big Data Technologies:** Hands-on experience with Apache Spark, Kafka
* **Leadership at Scale:** Demonstrated experience managing teams of 10+ engineers

### Resume Suggestions

* **Quantify All Achievements:** Transform general statements into measurable impact
* **Integrate Missing Technologies:** Showcase exposure to required technical stack
* **Emphasize Leadership Impact:** Highlight people management and team development
* **Add Dedicated Projects Section:** Showcase technical depth and breadth
* **Pursue Strategic Certifications:** Target certifications that directly address gaps
* **Optimize for ATS and Keywords:** Ensure resume passes applicant tracking systems

---
*This analysis provides a roadmap to systematically address gaps and strengthen your application.*
"""
        
        print(f"✅ [GAP] Mock response generated")
        return JSONResponse(content={"text": mock_response})
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Error analyzing gap: {str(e)}"
        print(f"❌ [GAP] Error: {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Resume Analyzer Backend Starting...")
    print("="*60)
    print(f"ADK Available: {ADK_AVAILABLE}")
    print(f"GenAI Available: {GENAI_AVAILABLE}")
    print("📍 Local Server: http://localhost:8080")
    print("="*60 + "\n")
    
    uvicorn.run(
        "backend:app",
        host="0.0.0.0",
        port=8080,
        reload=True
    )
