/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Type } from "@google/genai";
import { ai, LocationIcon, FocusIcon, CareerScopeIcon, CompetitionIcon, LearningIcon, TrustedIcon, BarChartIcon, ScaleIcon, CareerScopeView, CompetitionView, LearningRoadmapView, ProsAndConsView, FactsView, UniversitiesView, ComparisonView, TrustedInfoView, DataDrivenInsightsView } from './common';

export const AnalysisPage = ({ navigateTo, course }) => {
  const [feeValue, setFeeValue] = useState(250000);
  const [location, setLocation] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisContent, setAnalysisContent] = useState(null);
  const [activeTab, setActiveTab] = useState('Career Scope');
  const [courseToCompare, setCourseToCompare] = useState('Data Analytics');

  const indianStates = [ "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal" ];
  const courseOptions = ["AI/ML", "Data Analytics", "Web Development", "Design", "Management", "Finance", "Marketing", "Engineering", "B.Tech"];

  const generateContent = async (prompt, title, options: any = {}) => {
    const { schema, useGoogleSearch = false } = options;
    setIsLoading(true);
    setError(null);
    setAnalysisContent(null);
    setActiveTab(title);
    try {
      const config: any = {};
      if (schema) {
        config.responseMimeType = "application/json";
        config.responseSchema = schema;
      }
      if (useGoogleSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config,
      });

      if (schema) {
        setAnalysisContent(JSON.parse(response.text));
      } else if (useGoogleSearch) {
        setAnalysisContent({
          text: response.text,
          sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
        });
      } else {
        setAnalysisContent({ text: response.text });
      }
    } catch (err) {
      console.error("API Call failed", err);
      setError('Failed to fetch data from AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCareerScope = () => {
    const prompt = `Generate a detailed analysis of the career scope for the field of ${course.name} in India. Include a list of potential job roles. For industry growth, salary expectations, and future trends, provide a list of 3-4 key bullet points for each.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            jobRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
            industryGrowth: { type: Type.ARRAY, items: { type: Type.STRING } },
            salaryExpectations: { type: Type.ARRAY, items: { type: Type.STRING } },
            futureTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
    };
    generateContent(prompt, 'Career Scope', { schema });
  };

  const fetchCompetition = () => {
    const prompt = `Analyze the competition for entry-level professionals in the ${course.name} field in India. Provide a list of 3-4 key bullet points discussing the current job market saturation. Also, provide a list for key skills that make a candidate stand out, and a list for top companies hiring for these roles.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            marketSaturation: { type: Type.ARRAY, items: { type: Type.STRING } },
            keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            topCompanies: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
    };
    generateContent(prompt, 'Competition', { schema });
  };

  const fetchLearningRoadmap = () => {
    const prompt = `Create a learning roadmap for someone starting in ${course.name}. Provide 4-5 key steps. For each step, provide a title and a short description.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                step: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
            }
        }
    };
    generateContent(prompt, 'Learning', { schema });
  };

  const fetchProsAndCons = () => {
    const prompt = `What are the main pros and cons of pursuing a career in ${course.name}? Provide 3-4 points for each.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        }
    };
    generateContent(prompt, 'Pros & Cons', { schema });
  };
  
  const fetchFacts = () => {
    const prompt = `List 4 interesting and little-known facts about the ${course.name} industry.`;
     const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
    generateContent(prompt, 'Facts', { schema });
  };

  const fetchUniversities = () => {
    if (!location) {
        setError("Please select a location to search for universities.");
        return;
    }
    const prompt = `List top universities in ${location}, India for ${course.name} with a max annual fee of INR ${feeValue}. ${focusArea ? `Focus on ${focusArea}.` : ''} For each, provide name, estimated annual fee, and a brief description.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                fee: { type: Type.STRING },
                description: { type: Type.STRING },
            }
        }
    };
    generateContent(prompt, 'Universities', { schema });
  };
  
  const fetchComparison = () => {
    const prompt = `Provide a side-by-side comparison for a career in "${course.name}" versus "${courseToCompare}". Compare on: job market demand in India, average starting salary, required key skills, and long-term career outlook.`;
    const courseSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            jobDemand: { type: Type.STRING },
            averageSalary: { type: Type.STRING },
            keySkills: { type: Type.STRING },
            careerOutlook: { type: Type.STRING },
        }
    };
    const schema = {
        type: Type.OBJECT,
        properties: {
            course1: courseSchema,
            course2: courseSchema,
        }
    };
    generateContent(prompt, 'Comparison', { schema });
  };
  
  const fetchTrustedInfo = () => {
    const prompt = `Provide a brief disclaimer about using AI for career advice, highlighting that this information is for guidance and should be supplemented with personal research. Then, using Google Search, find and list 3-5 highly reliable and authoritative online sources for career information about ${course.name} in India.`;
    generateContent(prompt, 'Trusted Information', { useGoogleSearch: true });
  };
  
  const fetchDataInsights = () => {
    const prompt = `For a career in ${course.name}, provide a detailed paragraph for "Why You Should Consider It" and another detailed paragraph for "Why You Should Not Consider It".`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            consider: { type: Type.STRING },
            notConsider: { type: Type.STRING },
        }
    };
    generateContent(prompt, 'Data Insights', { schema });
  };

  useEffect(() => { fetchCareerScope(); }, [course]);
  
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
            <h2 className="analysis-title">Help me choose if an {course.name} is right for me?</h2>
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
                 <select onClick={(e) => e.stopPropagation()} onChange={(e) => setCourseToCompare(e.target.value)} value={courseToCompare} className="location-select">
                    {courseOptions.filter(opt => opt !== course.name).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                 </select>
               </div>
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
