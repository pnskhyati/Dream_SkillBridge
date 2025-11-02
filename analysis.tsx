/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { LocationIcon, FocusIcon, CareerScopeIcon, CompetitionIcon, LearningIcon, TrustedIcon, BarChartIcon, ScaleIcon, CareerScopeView, CompetitionView, LearningRoadmapView, ProsAndConsView, FactsView, UniversitiesView, ComparisonView, TrustedInfoView, DataDrivenInsightsView } from './common';

export const AnalysisPage = ({ navigateTo, course }) => {
  const [feeValue, setFeeValue] = useState(250000);
  const [location, setLocation] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisContent, setAnalysisContent] = useState(null);
  const [activeTab, setActiveTab] = useState('Career Scope');
  const [courseToCompare, setCourseToCompare] = useState('Data Analytics');
  const [sessionId, setSessionId] = useState(null);

  // Backend API URL - your deployed Cloud Run URL
  const API_URL = 'https://career-agent-backend-225573582209.us-central1.run.app';

  const indianStates = [ "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal" ];
  const courseOptions = ["AI/ML", "Data Analytics", "Web Development", "Design", "Management", "Finance", "Marketing", "Engineering", "B.Tech"];

  // Query the deployed Vertex AI agent
  const queryAgent = async (message) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📤 Sending request:', message);
      
      const response = await fetch(`${API_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          user_id: 'user_' + Date.now(),
          session_id: null // Don't use session - create new each time for reliability
        })
      });

      console.log('📊 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error:', errorText);
        throw new Error('Failed to query agent');
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      
      // Check if response is empty
      if (!data.response || data.response.trim() === '') {
        console.warn('⚠️ Empty response from agent');
        throw new Error('Agent returned empty response');
      }
      
      return data.response;
    } catch (err) {
      console.error("❌ Agent query failed", err);
      setError('Failed to fetch data from AI agent. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Parse JSON from agent response with better error handling
  const parseAgentResponse = (response) => {
    if (!response || response.trim() === '') {
      console.error("Empty response received");
      return null;
    }

    try {
      // First try to parse directly
      const parsed = JSON.parse(response);
      return parsed;
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/``````/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (parseError) {
          console.error("Failed to parse extracted JSON:", parseError);
        }
      }
      
      // Try to extract JSON from text (look for array or object patterns)
      const arrayMatch = response.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        try {
          return JSON.parse(arrayMatch[0]);
        } catch (parseError) {
          console.error("Failed to parse array:", parseError);
        }
      }
      
      const objectMatch = response.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          return JSON.parse(objectMatch[0]);
        } catch (parseError) {
          console.error("Failed to parse object:", parseError);
        }
      }
      
      // If all parsing fails, return as text wrapped in object
      console.error("Failed to parse response, returning as text:", e);
      return { text: response };
    }
  };

  const fetchCareerScope = async () => {
    setActiveTab('Career Scope');
    const prompt = `Generate a detailed analysis of the career scope for the field of ${course.name} in India. Return ONLY valid JSON with these fields: jobRoles (array of strings), industryGrowth (array of 3-4 bullet points), salaryExpectations (array of 3-4 bullet points), futureTrends (array of 3-4 bullet points). No markdown formatting.`;
    
    const response = await queryAgent(prompt);
    if (response) {
      const parsed = parseAgentResponse(response);
      if (parsed) {
        setAnalysisContent(parsed);
      } else {
        setError("Failed to parse career scope data");
      }
    }
  };

  const fetchCompetition = async () => {
    setActiveTab('Competition');
    const prompt = `Analyze the competition for entry-level professionals in the ${course.name} field in India. Return ONLY valid JSON with these fields: marketSaturation (array of 3-4 bullet points about job market saturation), keySkills (array of key skills that make candidates stand out), topCompanies (array of top companies hiring for these roles). No markdown formatting.`;
    
    const response = await queryAgent(prompt);
    if (response) {
      const parsed = parseAgentResponse(response);
      if (parsed) {
        setAnalysisContent(parsed);
      } else {
        setError("Failed to parse competition data");
      }
    }
  };

  const fetchLearningRoadmap = async () => {
    setActiveTab('Learning');
    const prompt = `Create a learning roadmap for someone starting in ${course.name}. Return ONLY valid JSON array of 4-5 objects, each with: step (string), title (string), description (short string). No markdown formatting.`;
    
    const response = await queryAgent(prompt);
    if (response) {
      const parsed = parseAgentResponse(response);
      if (parsed) {
        setAnalysisContent(parsed);
      } else {
        setError("Failed to parse learning roadmap");
      }
    }
  };

  const fetchProsAndCons = async () => {
    setActiveTab('Pros & Cons');
    const prompt = `What are the main pros and cons of pursuing a career in ${course.name}? Return ONLY valid JSON with two fields: pros (array of 3-4 points), cons (array of 3-4 points). No markdown formatting.`;
    
    const response = await queryAgent(prompt);
    if (response) {
      const parsed = parseAgentResponse(response);
      if (parsed) {
        setAnalysisContent(parsed);
      } else {
        setError("Failed to parse pros and cons");
      }
    }
  };
  
  const fetchFacts = async () => {
    setActiveTab('Facts');
    setAnalysisContent(null); // Clear previous content
    
    const prompt = `List 4 interesting and little-known facts about the ${course.name} industry. Return ONLY a valid JSON array of strings. No markdown, no explanations. Example: ["Fact 1", "Fact 2", "Fact 3", "Fact 4"]`;
    
    const response = await queryAgent(prompt);
    if (response) {
      const parsed = parseAgentResponse(response);
      console.log('Parsed facts:', parsed);
      
      // Ensure it's an array
      if (Array.isArray(parsed)) {
        setAnalysisContent(parsed);
      } else if (parsed && parsed.text) {
        // If we got text, try to extract facts manually
        const facts = parsed.text.split('\n').filter(line => line.trim().length > 10).slice(0, 4);
        setAnalysisContent(facts.length > 0 ? facts : ["Unable to parse facts. Please try again."]);
      } else {
        setAnalysisContent(["Unable to load facts. Please try again."]);
      }
    } else {
      setAnalysisContent(["Failed to load facts. Please try again."]);
    }
  };

  const fetchUniversities = async () => {
    if (!location) {
      setError("Please select a location to search for universities.");
      return;
    }
    
    setActiveTab('Universities');
    const prompt = `List top universities in ${location}, India for ${course.name} with a max annual fee of INR ${feeValue}. ${focusArea ? `Focus on ${focusArea}.` : ''} Return ONLY valid JSON array where each object has: name (string), fee (string - estimated annual fee), description (brief string). No markdown formatting.`;
    
    const response = await queryAgent(prompt);
    if (response) {
      const parsed = parseAgentResponse(response);
      if (parsed) {
        setAnalysisContent(parsed);
      } else {
        setError("Failed to parse universities data");
      }
    }
  };
  
  const fetchComparison = async () => {
    setActiveTab('Comparison');
    const prompt = `Provide a side-by-side comparison for a career in "${course.name}" versus "${courseToCompare}". Compare on: job market demand in India, average starting salary, required key skills, and long-term career outlook. Return ONLY valid JSON with two objects: course1 and course2, each containing: name, jobDemand, averageSalary, keySkills, careerOutlook. No markdown formatting.`;
    
    const response = await queryAgent(prompt);
    if (response) {
      const parsed = parseAgentResponse(response);
      if (parsed) {
        setAnalysisContent(parsed);
      } else {
        setError("Failed to parse comparison data");
      }
    }
  };
  
  const fetchTrustedInfo = async () => {
    setActiveTab('Trusted Information');
    const prompt = `Provide a brief disclaimer about using AI for career advice, highlighting that this information is for guidance and should be supplemented with personal research. Then, find and list 3-5 highly reliable and authoritative online sources for career information about ${course.name} in India. Include URLs and brief descriptions of each source.`;
    
    const response = await queryAgent(prompt);
    if (response) {
      // For trusted info, keep as text with sources
      setAnalysisContent({ text: response });
    }
  };
  
  const fetchDataInsights = async () => {
    setActiveTab('Data Insights');
    const prompt = `For a career in ${course.name}, provide a detailed paragraph for "Why You Should Consider It" and another detailed paragraph for "Why You Should Not Consider It". Return ONLY valid JSON with two fields: consider (string paragraph), notConsider (string paragraph). No markdown formatting.`;
    
    const response = await queryAgent(prompt);
    if (response) {
      const parsed = parseAgentResponse(response);
      if (parsed) {
        setAnalysisContent(parsed);
      } else {
        setError("Failed to parse data insights");
      }
    }
  };

  useEffect(() => { 
    fetchCareerScope(); 
  }, [course]);
  
  const renderContent = () => {
    if (isLoading) return <div className="loader"></div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!analysisContent) return <p>Select a category to see the analysis.</p>;

    switch (activeTab) {
      case 'Career Scope': return <CareerScopeView data={analysisContent} />;
      case 'Competition': return <CompetitionView data={analysisContent} />;
      case 'Learning': return <LearningRoadmapView data={analysisContent} />;
      case 'Pros & Cons': return <ProsAndConsView data={analysisContent} />;
      case 'Facts': return <FactsView data={analysisContent} />;
      case 'Universities': return <UniversitiesView data={analysisContent} />;
      case 'Comparison': return <ComparisonView data={analysisContent} />;
      case 'Trusted Information': return <TrustedInfoView data={analysisContent} />;
      case 'Data Insights': return <DataDrivenInsightsView courseName={course.name} textData={analysisContent} onRefresh={fetchDataInsights} />;
      default: return null;
    }
  };

  return (
    <div className="analysis-container">
      <div className="sidebar">
        <nav className="sidebar-nav">
          <div className="filter-box">
            <h4><LocationIcon /> Find Universities</h4>
            <div className="filter-item">
              <label htmlFor="max-fees">$ Max Fees</label>
              <div className="fee-slider">
                <input type="range" id="max-fees" min="10000" max="500000" step="1000" value={feeValue} onChange={(e) => setFeeValue(Number(e.target.value))} />
                <div className="fee-labels">
                  <span>₹10K</span>
                  <span>₹{Math.round(feeValue / 1000)}K</span>
                  <span>₹5L</span>
                </div>
              </div>
            </div>
            <div className="filter-item">
              <label htmlFor="location"><LocationIcon /> Location</label>
              <div className="select-wrapper"><select id="location" className="location-select" value={location} onChange={(e) => setLocation(e.target.value)}><option value="">Select State(s)</option>{indianStates.map(state => <option key={state} value={state}>{state}</option>)}</select></div>
            </div>
            <div className="filter-item">
              <label htmlFor="focus-area"><FocusIcon /> Focus Area</label>
              <div className="select-wrapper"><select id="focus-area" className="location-select" value={focusArea} onChange={(e) => setFocusArea(e.target.value)}><option value="">Select a focus</option><option>Research</option><option>Practical Application</option><option>Management</option><option>Software Development</option></select></div>
            </div>
            <button className="search-universities-btn" onClick={fetchUniversities}>Search Universities</button>
          </div>
          <a href="#" className={`sidebar-link ${activeTab === 'Career Scope' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); fetchCareerScope(); }}><CareerScopeIcon /> Career Scope</a>
          <a href="#" className={`sidebar-link ${activeTab === 'Competition' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); fetchCompetition(); }}><CompetitionIcon /> Competition</a>
          <a href="#" className={`sidebar-link ${activeTab === 'Learning' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); fetchLearningRoadmap(); }}><LearningIcon /> Learning</a>
          <a href="#" className={`sidebar-link ${activeTab === 'Trusted Information' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); fetchTrustedInfo(); }}><TrustedIcon /> Trusted Information</a>
        </nav>
      </div>

      <div className="main-analysis">
        <header className="header analysis-header">
          <button onClick={() => navigateTo('filter')} className="back-button" aria-label="Go back">← Back</button>
          <h1 className="header-title">Dream - {course.name} Analysis</h1>
          <div style={{ width: '80px' }}></div>
        </header>
        <main>
          <div className="analysis-intro">
            <p className="course-subtitle">COURSE: {course.name}</p>
            <h2 className="analysis-title">Help me choose if {course.name} is right for me?</h2>
          </div>
          <div className="action-buttons-container">
            <button className="action-btn quiz" onClick={() => navigateTo('quiz')}>TAKE A PERSONALISED QUIZ</button>
            <button className="action-btn pros-cons" onClick={fetchProsAndCons}>PROS AND CONS OF THIS FIELD</button>
            <button className="action-btn facts" onClick={fetchFacts}>HELP ME WITH FACTS</button>
          </div>
          <div className="analysis-content-area">
            <h2 className="analysis-content-title">{activeTab}</h2>
            {renderContent()}
          </div>
          <div className="feature-grid">
            <div className="feature-card" onClick={fetchDataInsights}>
              <div className="feature-icon data-icon"><BarChartIcon/></div>
              <h3>Data-Driven Insights</h3>
              <p>Get analysis based on market data and industry trends.</p>
            </div>
            <div className="feature-card" onClick={fetchComparison}>
              <div className="feature-icon compare-icon"><ScaleIcon/></div>
              <h3>Compare Courses</h3>
              <div className="select-wrapper compare-select-wrapper">
                <select 
                  onClick={(e) => e.stopPropagation()} 
                  onChange={(e) => {
                    setCourseToCompare(e.target.value);
                    // Automatically trigger comparison after selection
                    setTimeout(() => {
                      fetchComparison();
                    }, 100);
                  }} 
                  value={courseToCompare} 
                  className="location-select"
                >
                  {courseOptions.filter(opt => opt !== course.name).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
             </div>
             <p style={{marginTop: '10px', fontSize: '12px', opacity: 0.7}}>Select a course and it will compare automatically</p>
           </div>

            <div className="feature-card" onClick={fetchTrustedInfo}>
              <div className="feature-icon trusted-icon"><TrustedIcon/></div>
              <h3>Trusted Information</h3>
              <p>Access verified data from reliable industry sources.</p>
            </div>
          </div>
        </main>
      </div>
      <div className="fab-container">
        <div className="fab" role="button" aria-label="Open AI Assistant" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" className="fab-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12,3C16.42,3 20,4.34 20,6C20,7.66 16.42,9 12,9C7.58,9 4,7.66 4,6C4,4.34 7.58,3 12,3M13,9.5V12.5H15.65C15.22,13.34 14.5,14 12,14C8.45,14 6.5,12.5 6.5,12.5V10.5C6.5,10.5 8.45,9 12,9C12.35,9 12.68,9.04 13,9.1V9.5M17.5,10.5C17.5,10.5 19.55,12 19.55,14C19.55,16 17.5,17.5 17.5,17.5C17.5,17.5 15.45,16 15.45,14C15.45,12 17.5,10.5 17.5,10.5M10.35,14.5H13.65C13.8,15.22 14.25,15.82 14.88,16.25L13,18V21H11V18L9.12,16.25C9.75,15.82 10.2,15.22 10.35,14.5Z" /></svg>
        </div>
      </div>
    </div>
  );
};
