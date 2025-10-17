/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { GoogleGenAI } from "@google/genai";
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- Gemini API Initialization ---
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SVG Icon Components ---
export const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 16.5v-11A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 1 4 14.5v-1z"></path></svg>
);
export const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
export const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"></path></svg>
);
export const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
export const LaptopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.7 20H3.3a1 1 0 0 1-.58-1.45L4 16"></path></svg>
);
export const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
export const FocusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line></svg>
);
export const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
export const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16.5l4-4L12 3 4 12.5l4 4"></path><path d="M2 17h20"></path><path d="M12 3v18"></path><path d="M8.5 12.5L4 17"></path><path d="M15.5 12.5L20 17"></path></svg>;
export const TrustedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
export const CareerScopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
export const CompetitionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
export const LearningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
export const ThumbsUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12 M18 10V5a2 2 0 0 0-2-2h-1a4 4 0 0 0-4 4v8 M18 10h3.5a2 2 0 0 1 2 1.5v1a2 2 0 0 1-2 2H18"/></svg>;
export const ThumbsDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 14V2 M18 14v5a2 2 0 0 1-2 2h-1a4 4 0 0 1-4-4v-8 M18 14h3.5a2 2 0 0 0 2-1.5v-1a2 2 0 0 0-2-2H18"/></svg>;
export const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
export const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
export const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
export const BrainCircuitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2.5 2.5 0 0 1 2.5 2.5v.5c0 .32.06.63.17.92a2.5 2.5 0 0 0 4.66 1.42A2.5 2.5 0 0 1 21 8.5v.5c0 .32.06.63.17.92a2.5 2.5 0 0 0 1.76 2.4c.7.25 1.07.99 1.07 1.75v.26c0 .76-.37 1.5-1.07 1.75a2.5 2.5 0 0 0-1.76 2.4c-.11.29-.17.6-.17.92v.5a2.5 2.5 0 0 1-1.67 2.33A2.5 2.5 0 0 0 19.33 21c-.42.27-.9.4-1.4.4h-1.87a2.5 2.5 0 0 1-2.33-1.67A2.5 2.5 0 0 0 12.3 18c-.29-.1-.6-.17-.92-.17h-.76c-.32 0-.63.06-.92.17a2.5 2.5 0 0 0-1.42 4.66A2.5 2.5 0 0 1 8.5 21H7.7a2.5 2.5 0 0 1-2.33-1.67A2.5 2.5 0 0 0 3.95 18c-.29-.1-.6-.17-.92-.17h-.06c-.32 0-.63.06-.92.17a2.5 2.5 0 0 0-1.42 4.66A2.5 2.5 0 0 1 3 21H2.5A2.5 2.5 0 0 1 0 18.5v-.5c0-.32.06-.63.17-.92a2.5 2.5 0 0 0-1.76-2.4C-1.35 14.42-2 13.68-2 13s.65-1.42 1.4-1.67a2.5 2.5 0 0 0 1.76-2.4c.11-.29.17-.6.17-.92v-.5A2.5 2.5 0 0 1 3.95 5.17A2.5 2.5 0 0 0 5.17 3c.42-.27.9-.4 1.4-.4h1.87a2.5 2.5 0 0 1 2.33 1.67A2.5 2.5 0 0 0 12.12 6c.29.1.6.17.92.17h.92c.32 0 .63-.06.92-.17a2.5 2.5 0 0 0 1.42-4.66A2.5 2.5 0 0 1 15.5 3H16a2.5 2.5 0 0 1 2.5-2.5h-6.5Z"></path></svg>;
export const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16.5 3.51a4 4 0 0 1 0 6.98"></path></svg>;
export const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
export const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
export const CheckCircleIconSolid = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
export const WarningIconSolid = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
export const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a12 12 0 0116 16" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 4a12 12 0 00-16 16" /></svg>;

// --- Visual Components for AI Content ---
export const CareerScopeView = ({ data }) => (
    <div className="info-grid">
        <div className="info-card"><div className="info-card-icon"><BriefcaseIcon/></div><h4>Potential Job Roles</h4><div className="skill-tags">{data.jobRoles?.map(role => <span key={role} className="skill-tag">{role}</span>)}</div></div>
        <div className="info-card"><div className="info-card-icon"><TrendingUpIcon/></div><h4>Industry Growth</h4><ul>{data.industryGrowth?.map(point => <li key={point}>{point}</li>)}</ul></div>
        <div className="info-card"><div className="info-card-icon"><DollarSignIcon/></div><h4>Salary Expectations</h4><ul>{data.salaryExpectations?.map(point => <li key={point}>{point}</li>)}</ul></div>
        <div className="info-card"><div className="info-card-icon"><BrainCircuitIcon/></div><h4>Future Trends</h4><ul>{data.futureTrends?.map(point => <li key={point}>{point}</li>)}</ul></div>
    </div>
);
export const CompetitionView = ({ data }) => (
     <div className="info-grid">
        <div className="info-card"><div className="info-card-icon"><UsersIcon/></div><h4>Market Saturation</h4><ul>{data.marketSaturation?.map(point => <li key={point}>{point}</li>)}</ul></div>
        <div className="info-card"><div className="info-card-icon"><CheckCircleIcon/></div><h4>Key Skills to Stand Out</h4><div className="skill-tags">{data.keySkills?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div></div>
        <div className="info-card"><div className="info-card-icon"><TargetIcon/></div><h4>Top Hiring Companies</h4><div className="skill-tags">{data.topCompanies?.map(company => <span key={company} className="skill-tag">{company}</span>)}</div></div>
    </div>
);
export const LearningRoadmapView = ({ data }) => (
    <div className="timeline">
        {data.map((item, index) => (
            <div key={index} className={`timeline-item-container ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}>
                <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <h4 className="timeline-title">{item.step}: {item.title}</h4>
                        <p className="timeline-description">{item.description}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
export const ProsAndConsView = ({ data }) => (
    <div className="pros-cons-container">
        <div className="pro-con-card pros-card">
            <h3><ThumbsUpIcon /> Pros</h3>
            <ul>{data.pros?.map(pro => <li key={pro}>{pro}</li>)}</ul>
        </div>
        <div className="pro-con-card cons-card">
            <h3><ThumbsDownIcon /> Cons</h3>
            <ul>{data.cons?.map(con => <li key={con}>{con}</li>)}</ul>
        </div>
    </div>
);
export const FactsView = ({ data }) => (
    <div className="facts-grid">
        {data.map((fact, index) => (
            <div key={index} className="fact-card">
                <p className="fact-header">Did you know?</p>
                <p className="fact-body">{fact}</p>
            </div>
        ))}
    </div>
);
export const UniversitiesView = ({ data }) => (
    <div className="universities-list">
        {data.map((uni, index) => (
            <div key={index} className="uni-card">
                <h4>{uni.name}</h4>
                <p><strong>Fee:</strong> {uni.fee}</p>
                <p>{uni.description}</p>
            </div>
        ))}
    </div>
);
export const ComparisonView = ({ data }) => (
    <div className="comparison-container">
        <div className="comparison-header">
            <h3>{data.course1?.name}</h3>
            <span className="vs-tag">VS</span>
            <h3>{data.course2?.name}</h3>
        </div>
        <div className="comparison-grid">
            <div className="comparison-row">
                <div className="comparison-card">{data.course1?.jobDemand}</div>
                <div className="comparison-feature">Job Demand</div>
                <div className="comparison-card">{data.course2?.jobDemand}</div>
            </div>
            <div className="comparison-row">
                <div className="comparison-card">{data.course1?.averageSalary}</div>
                <div className="comparison-feature">Average Salary</div>
                <div className="comparison-card">{data.course2?.averageSalary}</div>
            </div>
            <div className="comparison-row">
                <div className="comparison-card">{data.course1?.keySkills}</div>
                <div className="comparison-feature">Key Skills</div>
                <div className="comparison-card">{data.course2?.keySkills}</div>
            </div>
            <div className="comparison-row">
                <div className="comparison-card">{data.course1?.careerOutlook}</div>
                <div className="comparison-feature">Career Outlook</div>
                <div className="comparison-card">{data.course2?.careerOutlook}</div>
            </div>
        </div>
    </div>
);
export const TrustedInfoView = ({ data }) => {
    const formatText = (text = '') => {
        const html = text
            .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>') // Bold
            .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')       // Italic
            .split('\n')
            .map(line => line.trim())
            .reduce((acc, line) => {
                if (line.startsWith('* ')) {
                    const item = `<li>${line.substring(2)}</li>`;
                    if (acc.endsWith('</ul>')) {
                        return acc.substring(0, acc.length - 5) + item + '</ul>';
                    } else {
                        return acc + `<ul>${item}</ul>`;
                    }
                } else {
                    return acc + `<p>${line}</p>`;
                }
            }, '');
        return html;
    };
    return (
        <div className="trusted-info-view">
            <div className="analysis-text" dangerouslySetInnerHTML={{ __html: formatText(data.text) }}></div>
            {data.sources && data.sources.length > 0 && (
                <>
                    <h4 className="sources-title">Sources from Google Search</h4>
                    <div className="sources-list">
                        {data.sources.map((source, index) => (
                           source.web?.uri && (
                             <a href={source.web.uri} key={index} className="source-card" target="_blank" rel="noopener noreferrer">
                                <p className="source-title">{source.web.title || "Untitled Source"}</p>
                                <p className="source-uri">{source.web.uri}</p>
                            </a>
                           )
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export const DataDrivenInsightsView = ({ courseName, textData, onRefresh }) => {
    // Chart configurations
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                font: {
                    size: 16,
                },
            },
        },
    };

    const enrollmentData = {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [{
            label: 'Student Enrollment',
            data: [250000, 275000, 290000, 310000, 330000],
            backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(153, 102, 255, 0.7)', 'rgba(153, 102, 255, 0.8)', 'rgba(153, 102, 255, 0.9)', 'rgba(153, 102, 255, 1)'],
            borderRadius: 4,
        }],
    };

    const salaryData = {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [{
            label: 'Average Salary',
            data: [4.5, 5.5, 6.8, 8.2, 9.5],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4,
        }],
    };

    const marketGrowthData = {
        labels: ['Positive Growth', 'Negative/Stagnant Growth'],
        datasets: [{
            data: [70, 30],
            backgroundColor: ['#28a745', '#dc3545'],
            hoverBackgroundColor: ['#218838', '#c82333'],
        }],
    };

    const ratioData = {
        labels: ['Undergraduate', 'Graduate', 'PhD'],
        datasets: [{
            data: [80, 15, 5],
            backgroundColor: ['#007bff', '#fd7e14', '#17a2b8'],
            hoverBackgroundColor: ['#0069d9', '#e86a02', '#138496'],
        }],
    };

    return (
        <div className="data-insights-view">
            <div className="insights-header">
                <h2>{courseName}</h2>
                <button className="refresh-button" onClick={onRefresh}>
                    <RefreshIcon /> Refresh Data
                </button>
            </div>

            <div className="consideration-section consider-card">
                <h3><CheckCircleIconSolid /> Why You Should Consider It</h3>
                <p>{textData?.consider || "Loading..."}</p>
            </div>

            <div className="consideration-section not-consider-card">
                <h3><WarningIconSolid /> Why You Should Not Consider It</h3>
                <p>{textData?.notConsider || "Loading..."}</p>
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <Bar options={{...commonOptions, plugins: {...commonOptions.plugins, title: {...commonOptions.plugins.title, text: 'Student Enrollment Trends'}}}} data={enrollmentData} />
                </div>
                <div className="chart-container">
                    <Line options={{...commonOptions, plugins: {...commonOptions.plugins, title: {...commonOptions.plugins.title, text: 'Average Salary Trends (in Lakhs INR)'}}}} data={salaryData} />
                </div>
                <div className="chart-container">
                    <Doughnut options={{...commonOptions, plugins: {...commonOptions.plugins, title: {...commonOptions.plugins.title, text: 'Job Market Growth'}}}} data={marketGrowthData} />
                </div>
                <div className="chart-container">
                    <Doughnut options={{...commonOptions, plugins: {...commonOptions.plugins, title: {...commonOptions.plugins.title, text: 'Student-to-Teacher Ratio'}}}} data={ratioData} />
                </div>
            </div>
        </div>
    );
};
