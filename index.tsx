/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type, Chat } from "@google/genai";
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
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SVG Icon Components ---
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 16.5v-11A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 1 4 14.5v-1z"></path></svg>
);
const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"></path></svg>
);
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const LaptopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.7 20H3.3a1 1 0 0 1-.58-1.45L4 16"></path></svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const FocusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line></svg>
);
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16.5l4-4L12 3 4 12.5l4 4"></path><path d="M2 17h20"></path><path d="M12 3v18"></path><path d="M8.5 12.5L4 17"></path><path d="M15.5 12.5L20 17"></path></svg>;
const TrustedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const CareerScopeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const CompetitionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const LearningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const ThumbsUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12 M18 10V5a2 2 0 0 0-2-2h-1a4 4 0 0 0-4 4v8 M18 10h3.5a2 2 0 0 1 2 1.5v1a2 2 0 0 1-2 2H18"/></svg>;
const ThumbsDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 14V2 M18 14v5a2 2 0 0 1-2 2h-1a4 4 0 0 1-4-4v-8 M18 14h3.5a2 2 0 0 0 2-1.5v-1a2 2 0 0 0-2-2H18"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const BrainCircuitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2.5 2.5 0 0 1 2.5 2.5v.5c0 .32.06.63.17.92a2.5 2.5 0 0 0 4.66 1.42A2.5 2.5 0 0 1 21 8.5v.5c0 .32.06.63.17.92a2.5 2.5 0 0 0 1.76 2.4c.7.25 1.07.99 1.07 1.75v.26c0 .76-.37 1.5-1.07 1.75a2.5 2.5 0 0 0-1.76 2.4c-.11.29-.17.6-.17.92v.5a2.5 2.5 0 0 1-1.67 2.33A2.5 2.5 0 0 0 19.33 21c-.42.27-.9.4-1.4.4h-1.87a2.5 2.5 0 0 1-2.33-1.67A2.5 2.5 0 0 0 12.3 18c-.29-.1-.6-.17-.92-.17h-.76c-.32 0-.63.06-.92.17a2.5 2.5 0 0 0-1.42 4.66A2.5 2.5 0 0 1 8.5 21H7.7a2.5 2.5 0 0 1-2.33-1.67A2.5 2.5 0 0 0 3.95 18c-.29-.1-.6-.17-.92-.17h-.06c-.32 0-.63.06-.92.17a2.5 2.5 0 0 0-1.42 4.66A2.5 2.5 0 0 1 3 21H2.5A2.5 2.5 0 0 1 0 18.5v-.5c0-.32.06-.63.17-.92a2.5 2.5 0 0 0-1.76-2.4C-1.35 14.42-2 13.68-2 13s.65-1.42 1.4-1.67a2.5 2.5 0 0 0 1.76-2.4c.11-.29.17-.6.17-.92v-.5A2.5 2.5 0 0 1 3.95 5.17A2.5 2.5 0 0 0 5.17 3c.42-.27.9-.4 1.4-.4h1.87a2.5 2.5 0 0 1 2.33 1.67A2.5 2.5 0 0 0 12.12 6c.29.1.6.17.92.17h.92c.32 0 .63-.06.92-.17a2.5 2.5 0 0 0 1.42-4.66A2.5 2.5 0 0 1 15.5 3H16a2.5 2.5 0 0 1 2.5-2.5h-6.5Z"></path></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16.5 3.51a4 4 0 0 1 0 6.98"></path></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const CheckCircleIconSolid = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const WarningIconSolid = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="24" height="24"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a12 12 0 0116 16" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 4a12 12 0 00-16 16" /></svg>;

// --- Visual Components for AI Content ---
const CareerScopeView = ({ data }) => (
    <div className="info-grid">
        <div className="info-card"><div className="info-card-icon"><BriefcaseIcon/></div><h4>Potential Job Roles</h4><div className="skill-tags">{data.jobRoles?.map(role => <span key={role} className="skill-tag">{role}</span>)}</div></div>
        <div className="info-card"><div className="info-card-icon"><TrendingUpIcon/></div><h4>Industry Growth</h4><ul>{data.industryGrowth?.map(point => <li key={point}>{point}</li>)}</ul></div>
        <div className="info-card"><div className="info-card-icon"><DollarSignIcon/></div><h4>Salary Expectations</h4><ul>{data.salaryExpectations?.map(point => <li key={point}>{point}</li>)}</ul></div>
        <div className="info-card"><div className="info-card-icon"><BrainCircuitIcon/></div><h4>Future Trends</h4><ul>{data.futureTrends?.map(point => <li key={point}>{point}</li>)}</ul></div>
    </div>
);
const CompetitionView = ({ data }) => (
     <div className="info-grid">
        <div className="info-card"><div className="info-card-icon"><UsersIcon/></div><h4>Market Saturation</h4><ul>{data.marketSaturation?.map(point => <li key={point}>{point}</li>)}</ul></div>
        <div className="info-card"><div className="info-card-icon"><CheckCircleIcon/></div><h4>Key Skills to Stand Out</h4><div className="skill-tags">{data.keySkills?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}</div></div>
        <div className="info-card"><div className="info-card-icon"><TargetIcon/></div><h4>Top Hiring Companies</h4><div className="skill-tags">{data.topCompanies?.map(company => <span key={company} className="skill-tag">{company}</span>)}</div></div>
    </div>
);
const LearningRoadmapView = ({ data }) => (
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
const ProsAndConsView = ({ data }) => (
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
const FactsView = ({ data }) => (
    <div className="facts-grid">
        {data.map((fact, index) => (
            <div key={index} className="fact-card">
                <p className="fact-header">Did you know?</p>
                <p className="fact-body">{fact}</p>
            </div>
        ))}
    </div>
);
const UniversitiesView = ({ data }) => (
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
const ComparisonView = ({ data }) => (
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
const TrustedInfoView = ({ data }) => {
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

const DataDrivenInsightsView = ({ courseName, textData, onRefresh }) => {
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


const AnalysisPage = ({ navigateTo, course }) => {
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


const Filter = ({ navigateTo, selectCourseAndNavigate }) => {
  const careerData = [
    { name: 'MBA', sub: 'Master of Business Administration', initial: 'M', color: 'bg-mba' },
    { name: 'B.TECH', sub: 'Bachelor of Technology', initial: 'B', color: 'bg-btech' },
    { name: 'FINE ARTS', sub: 'Creative Arts & Design', initial: 'F', color: 'bg-fine-arts' },
    { name: 'DESIGNING', sub: 'UI/UX & Graphic Design', initial: 'D', color: 'bg-designing' },
    { name: 'B.Arch', sub: 'Bachelor of Architecture', initial: 'B', color: 'bg-barch' },
    { name: 'B.Com', sub: 'Bachelor of Commerce', initial: 'B', color: 'bg-bcom' },
  ];

  const courseOptions = ["AI/ML", "Data Analytics", "Web Development", "Design", "Management", "Finance", "Marketing", "Engineering", "B.Tech"];

  const handleCourseSelect = (event) => {
    const courseName = event.target.value;
    if (courseName && courseName !== "Select a course") {
      selectCourseAndNavigate({ name: courseName });
    }
  };

  return (
    <div className="filter-container">
      <header className="header filter-header">
        <button onClick={() => navigateTo('dashboard')} className="back-button" aria-label="Go back">
          ← Back
        </button>
        <h1 className="header-title-filter">Dream</h1>
        <div style={{ width: '80px' }}></div>
      </header>
      <main>
        <section className="filters-section">
          <div className="filter-group">
            <label className="filter-label courses-label">Courses:</label>
            <div className="select-wrapper">
              <select className="course-select" onChange={handleCourseSelect}>
                <option>Select a course</option>
                {courseOptions.map(course => <option key={course} value={course}>{course}</option>)}
              </select>
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label good-at-label">I'm Good at:</label>
            <button className="strength-button" onClick={() => navigateTo('strengths')}>Explore My Strengths</button>
          </div>
          <div className="filter-group">
            <label className="filter-label quiz-label">Take a Quiz:</label>
            <button className="quiz-button" onClick={() => navigateTo('quiz')}>Start Career Quiz</button>
          </div>
        </section>

        <section className="career-section">
          <h2 className="career-title">Choose a Career</h2>
          <div className="career-grid">
            {careerData.map((career, index) => (
              <div key={index} className="career-card" tabIndex={0} onClick={() => selectCourseAndNavigate(career)}>
                <div className={`career-icon ${career.color}`}>{career.initial}</div>
                <h3 className="career-name">{career.name}</h3>
                <p className="career-sub">{career.sub}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <div className="fab-container">
        <div className="fab" role="button" aria-label="Open AI Assistant" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" className="fab-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,3C16.42,3 20,4.34 20,6C20,7.66 16.42,9 12,9C7.58,9 4,7.66 4,6C4,4.34 7.58,3 12,3M13,9.5V12.5H15.65C15.22,13.34 14.5,14 12,14C8.45,14 6.5,12.5 6.5,12.5V10.5C6.5,10.5 8.45,9 12,9C12.35,9 12.68,9.04 13,9.1V9.5M17.5,10.5C17.5,10.5 19.55,12 19.55,14C19.55,16 17.5,17.5 17.5,17.5C17.5,17.5 15.45,16 15.45,14C15.45,12 17.5,10.5 17.5,10.5M10.35,14.5H13.65C13.8,15.22 14.25,15.82 14.88,16.25L13,18V21H11V18L9.12,16.25C9.75,15.82 10.2,15.22 10.35,14.5Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ navigateTo }) => {
  return (
    <div className="dashboard-container">
      <div className="content-wrapper">
        <header className="header">
          <button
            onClick={() => navigateTo('landing')}
            className="back-button"
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 className="header-title">Dream</h1>
          <div style={{width: '80px'}}></div> {/* Spacer */}
        </header>

        <main className="main-content">
          <section className="welcome-section">
            <h2>Welcome! What would you like to do?</h2>
            <p>Choose a tool below to start your career journey.</p>
          </section>

          <div className="main-cards-grid">
            <div className="tool-card large-card">
              <div className="card-header">
                <div className="card-icon-wrapper"><BookIcon /></div>
                <h3>Explore Courses</h3>
              </div>
              <p className="card-description">
                Dive deep into various courses, compare them, and find the perfect fit for you.
              </p>
              <button className="button primary" onClick={() => navigateTo('filter')}>Explore Now</button>
            </div>
            <div className="tool-card large-card">
              <div className="card-header">
                <div className="card-icon-wrapper"><PencilIcon /></div>
                <h3>Take a Quiz</h3>
              </div>
              <p className="card-description">
                Answer a few questions to find career paths that match your personality and skills.
              </p>
              <button className="button primary" onClick={() => navigateTo('quiz')}>Take Quiz</button>
            </div>
          </div>

          <section className="ai-tools-section">
            <h2>AI-Powered Tools</h2>
            <div className="ai-cards-grid">
              <div className="tool-card">
                <div className="card-header">
                  <div className="card-icon-wrapper"><PlusIcon /></div>
                  <h3>AI Career Advisor</h3>
                </div>
                <p className="card-description">Get personalized career advice and analyze your fit for specific job roles.</p>
                <button className="button primary" onClick={() => navigateTo('strengths')}>Start Advising</button>
              </div>
              <div className="tool-card">
                <div className="card-header">
                  <div className="card-icon-wrapper"><DocumentIcon /></div>
                  <h3>AI Resume Analyzer</h3>
                </div>
                <p className="card-description">Get your resume analyzed for a target job and receive an improved version from AI.</p>
                <button className="button primary" onClick={() => navigateTo('resumeAnalyzer')}>Analyze Resume</button>
              </div>
              <div className="tool-card">
                <div className="card-header">
                  <div className="card-icon-wrapper"><LaptopIcon /></div>
                  <h3>AI Prep Hub</h3>
                </div>
                <p className="card-description">Practice mock interviews, test your skills, and get ready for your dream job.</p>
                <button className="button primary" onClick={() => navigateTo('aiPrepHub')}>Start Prepping</button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className="fab-container">
        <div className="fab" role="button" aria-label="Open AI Assistant">
          <svg xmlns="http://www.w3.org/2000/svg" className="fab-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,3C16.42,3 20,4.34 20,6C20,7.66 16.42,9 12,9C7.58,9 4,7.66 4,6C4,4.34 7.58,3 12,3M13,9.5V12.5H15.65C15.22,13.34 14.5,14 12,14C8.45,14 6.5,12.5 6.5,12.5V10.5C6.5,10.5 8.45,9 12,9C12.35,9 12.68,9.04 13,9.1V9.5M17.5,10.5C17.5,10.5 19.55,12 19.55,14C19.55,16 17.5,17.5 17.5,17.5C17.5,17.5 15.45,16 15.45,14C15.45,12 17.5,10.5 17.5,10.5M10.35,14.5H13.65C13.8,15.22 14.25,15.82 14.88,16.25L13,18V21H11V18L9.12,16.25C9.75,15.82 10.2,15.22 10.35,14.5Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const strengthsData = {
    subjects: ["Art", "Science", "Commerce", "Maths", "English", "History", "Geography", "Physics", "Chemistry", "Biology"],
    interests: ["AI", "Design", "Finance", "Sustainability", "Healthcare", "Technology", "Education", "Entertainment"],
    skills: ["Problem-solving", "Coding", "Communication", "Leadership", "Creativity", "Analytics", "Management", "Research"]
};

const StrengthsResultView = ({ data }) => (
    <div className="strengths-result-view">
        <h3 className="result-title">Your Recommended Career Path</h3>
        <div className="result-card">
            <h4>{data.career}</h4>
            <p><strong>Why this path is a good fit:</strong></p>
            <ul>{data.explanation?.map((point, i) => <li key={i}>{point}</li>)}</ul>
            <p><strong>Key Skills to Develop:</strong></p>
            <div className="skill-tags">
                {data.skills?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
            </div>
        </div>
    </div>
);

const StrengthsSection = ({ title, items, selectedItems, onToggle }) => (
    <div className="strengths-section">
        <h3>{title}</h3>
        <div className="strengths-grid">
            {items.map(item => (
                <button
                    key={item}
                    className={`strength-tag ${selectedItems.includes(item) ? 'active' : ''}`}
                    onClick={() => onToggle(item)}
                >
                    {item}
                </button>
            ))}
        </div>
    </div>
);

const StrengthsFinderPage = ({ navigateTo }) => {
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleToggle = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleGenerateAdvice = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        const prompt = `Based on the following user profile, recommend a single, specific career path.
        Subjects the user is good at: ${selectedSubjects.join(', ') || 'None specified'}.
        User's interests: ${selectedInterests.join(', ') || 'None specified'}.
        User's skills: ${selectedSkills.join(', ') || 'None specified'}.
        User's detailed explanation of their strengths and aspirations: "${explanation || 'None provided'}".

        Please provide:
        1. The name of the recommended career path.
        2. A detailed explanation (as a list of 3-4 bullet points) of why this career is a great fit.
        3. A list of key skills required to succeed in this career.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                career: { type: Type.STRING },
                explanation: { type: Type.ARRAY, items: { type: Type.STRING } },
                skills: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        };

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema },
            });
            setResult(JSON.parse(response.text));
        } catch (err) {
            console.error("AI call failed", err);
            setError("Failed to generate career advice. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setSelectedSubjects([]);
        setSelectedInterests([]);
        setSelectedSkills([]);
        setExplanation('');
        setResult(null);
        setError(null);
    }

    return (
        <div className="strengths-finder-container">
            <header className="header filter-header">
                <button onClick={() => navigateTo('filter')} className="back-button" aria-label="Go back">← Back</button>
                <h1 className="header-title-filter">Explore Your Strengths</h1>
                <div style={{ width: '80px' }}></div>
            </header>
            <main className="strengths-finder-main">
                {isLoading && <div className="loader"></div>}
                {error && <div className="error-message">{error}</div>}

                {result && !isLoading && (
                    <div>
                        <StrengthsResultView data={result} />
                        <button onClick={handleReset} className="start-over-btn">Start Over</button>
                    </div>
                )}

                {!result && !isLoading && (
                    <>
                        <p className="strengths-intro">
                            Select your strengths, interests, and skills to get a personalized career recommendation from our AI advisor.
                        </p>
                        <StrengthsSection
                            title="Which subjects are you good at?"
                            items={strengthsData.subjects}
                            selectedItems={selectedSubjects}
                            onToggle={(item) => handleToggle(item, selectedSubjects, setSelectedSubjects)}
                        />
                        <StrengthsSection
                            title="What are your interests?"
                            items={strengthsData.interests}
                            selectedItems={selectedInterests}
                            onToggle={(item) => handleToggle(item, selectedInterests, setSelectedInterests)}
                        />
                        <StrengthsSection
                            title="What are your skills?"
                            items={strengthsData.skills}
                            selectedItems={selectedSkills}
                            onToggle={(item) => handleToggle(item, selectedSkills, setSelectedSkills)}
                        />

                        {selectedSkills.length > 0 && (
                            <div className="explanation-box">
                                <h3>Tell us more about yourself</h3>
                                <p>Explain your strengths, what you enjoy doing, and what you're looking for in a career.</p>
                                <textarea
                                    value={explanation}
                                    onChange={(e) => setExplanation(e.target.value)}
                                    placeholder="e.g., I love solving complex puzzles and am passionate about using technology to build creative solutions..."
                                    rows={5}
                                ></textarea>
                            </div>
                        )}
                        <button
                            className="generate-advice-btn"
                            onClick={handleGenerateAdvice}
                            disabled={selectedSubjects.length === 0 && selectedInterests.length === 0 && selectedSkills.length === 0}
                        >
                            Generate Career Advice
                        </button>
                    </>
                )}
            </main>
        </div>
    );
};

const ResumeAnalyzerPage = ({ navigateTo }) => {
    const [activeTab, setActiveTab] = useState('enhance'); // 'enhance' or 'bridge'
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeDataUrl, setResumeDataUrl] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [dreamJob, setDreamJob] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setResumeFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeDataUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const formatText = (text = '') => {
        const html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .split('\n')
            .map(line => line.trim())
            .reduce((acc, line) => {
                if (line.startsWith('### ')) {
                    return acc + `<h4>${line.substring(4)}</h4>`;
                }
                if (line.startsWith('## ')) {
                    return acc + `<h3>${line.substring(3)}</h3>`;
                }
                if (line.startsWith('# ')) {
                    return acc + `<h2>${line.substring(2)}</h2>`;
                }
                if (line.startsWith('* ')) {
                    const item = `<li>${line.substring(2)}</li>`;
                    if (acc.endsWith('</ul>')) {
                        return acc.substring(0, acc.length - 5) + item + '</ul>';
                    } else {
                        return acc + `<ul>${item}</ul>`;
                    }
                } else if (line) { // to avoid empty <p> tags
                    return acc + `<p>${line}</p>`;
                }
                return acc;
            }, '');
        return html;
    };


    const handleEnhance = async () => {
        if (!resumeFile || !dreamJob) {
            setError('Please upload your resume and enter your dream job role.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');

        const filePart = {
            inlineData: {
                data: resumeDataUrl.split(',')[1],
                mimeType: resumeFile.type,
            },
        };

        const textPart = {
            text: `Please analyze the provided resume. Then, enhance it for the job role of a "${dreamJob}". Rewrite the resume to highlight the most relevant skills and experiences, using strong action verbs and a professional tone. Ensure the output is a complete, well-formatted resume.`
        };

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [filePart, textPart] },
            });
            setResult(response.text);
        } catch (err) {
            console.error("AI call failed", err);
            setError("Failed to enhance the resume. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBridgeGap = async () => {
        if (!resumeFile || !jobDescription) {
            setError('Please upload your resume and provide the job description.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');

        const filePart = {
            inlineData: {
                data: resumeDataUrl.split(',')[1],
                mimeType: resumeFile.type,
            },
        };

        const textPart = {
            text: `First, analyze the provided resume. Then, analyze the following job description:\n\n${jobDescription}\n\nPlease identify the skill gaps between the resume and the job description. Provide a clear list of missing skills and suggest specific changes to the resume to better align it with the job description. Format your response with clear headings for "Skill Gaps" and "Resume Suggestions".`
        };


        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [filePart, textPart] },
            });
            setResult(response.text);
        } catch (err) {
            console.error("AI call failed", err);
            setError("Failed to analyze. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="resume-analyzer-container">
            <header className="header filter-header">
                <button onClick={() => navigateTo('dashboard')} className="back-button" aria-label="Go back">← Back</button>
                <h1 className="header-title-filter">AI Resume Analyzer</h1>
                <div style={{ width: '80px' }}></div>
            </header>
            <main className="resume-analyzer-main">
                <div className="tabs-container">
                    <button className={`tab-button ${activeTab === 'enhance' ? 'active' : ''}`} onClick={() => setActiveTab('enhance')}>
                        <PencilIcon /> Enhance Resume
                    </button>
                    <button className={`tab-button ${activeTab === 'bridge' ? 'active' : ''}`} onClick={() => setActiveTab('bridge')}>
                        <ScaleIcon /> Bridge the Gap
                    </button>
                </div>

                <div className="input-section">
                    <h4>Upload Your Resume</h4>
                    <div className="file-upload-wrapper">
                        <input type="file" id="resume-upload" accept=".txt,.pdf,.doc,.docx" onChange={handleFileChange} style={{display: 'none'}} />
                        <label htmlFor="resume-upload" className="file-upload-label">
                            <DocumentIcon />
                            <span>{resumeFile ? resumeFile.name : 'Choose a file (.txt, .pdf, .docx)'}</span>
                        </label>
                    </div>
                     {resumeFile && <p className="file-success">Resume loaded successfully!</p>}
                </div>

                {activeTab === 'enhance' && (
                    <div className="tab-content">
                        <div className="input-section">
                            <h4>Enter Your Dream Job Role</h4>
                            <input
                                type="text"
                                className="text-input"
                                placeholder="e.g., Senior Software Engineer"
                                value={dreamJob}
                                onChange={(e) => setDreamJob(e.target.value)}
                            />
                        </div>
                        <button className="analyze-button" onClick={handleEnhance} disabled={isLoading || !resumeFile || !dreamJob}>
                            {isLoading ? 'Enhancing...' : 'Enhance My Resume'}
                        </button>
                    </div>
                )}

                {activeTab === 'bridge' && (
                     <div className="tab-content">
                         <div className="input-section">
                            <h4>Paste the Job Description</h4>
                            <textarea
                                className="textarea-input"
                                rows={10}
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            ></textarea>
                         </div>
                         <button className="analyze-button" onClick={handleBridgeGap} disabled={isLoading || !resumeFile || !jobDescription}>
                            {isLoading ? 'Analyzing...' : 'Bridge the Gap'}
                         </button>
                    </div>
                )}

                {isLoading && <div className="loader"></div>}
                {error && <div className="error-message">{error}</div>}

                {result && !isLoading && (
                    <div className="result-container">
                        <h3>Analysis Result</h3>
                        <div className="result-content" dangerouslySetInnerHTML={{ __html: formatText(result) }}></div>
                    </div>
                )}

            </main>
        </div>
    );
};

const AIPrepHubPage = ({ navigateTo }) => {
    const [activeTab, setActiveTab] = useState('interview'); // interview, skills, resume
    const [error, setError] = useState('');
    const chatWindowRef = useRef(null);

    // --- Mock Interview State ---
    const [jobRole, setJobRole] = useState('');
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [userResponse, setUserResponse] = useState('');
    const [interviewChat, setInterviewChat] = useState<Chat | null>(null);
    const [isInterviewLoading, setIsInterviewLoading] = useState(false);
    const [interviewStarted, setInterviewStarted] = useState(false);

    // --- Skill Tester State ---
    const [selectedSkill, setSelectedSkill] = useState('JavaScript');
    const [skillQuestion, setSkillQuestion] = useState('');
    const [skillAnswer, setSkillAnswer] = useState('');
    const [skillFeedback, setSkillFeedback] = useState('');
    const [isSkillLoading, setIsSkillLoading] = useState(false);
    const skillOptions = ["JavaScript", "Python", "SQL", "Project Management", "Data Analysis", "UI/UX Principles"];

    // --- Resume Q&A State ---
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeDataUrl, setResumeDataUrl] = useState(null);
    const [resumeQuestion, setResumeQuestion] = useState('');
    const [resumeChatHistory, setResumeChatHistory] = useState([]);
    const [isResumeLoading, setIsResumeLoading] = useState(false);
    
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [interviewHistory, resumeChatHistory]);
    
    const formatTextToHtml = (text = '') => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br />');
    };

    // --- Mock Interview Handlers ---
    const handleStartInterview = async () => {
        if (!jobRole) {
            setError("Please enter a job role to start the interview.");
            return;
        }
        setIsInterviewLoading(true);
        setError('');
        setInterviewHistory([]);
        
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
              systemInstruction: `You are a professional but friendly interviewer for the role of a "${jobRole}". Your goal is to assess the candidate's suitability for the role. Start by greeting the candidate and asking your first interview question. After the candidate responds, provide brief, constructive feedback on their answer, and then ask the next logical question. Ask only one question at a time. Keep the interview flowing naturally.`,
          },
        });
        setInterviewChat(chat);
        
        const initialResponse = await chat.sendMessage({ message: "Start the interview." });
        setInterviewHistory([{ role: 'ai', text: initialResponse.text }]);
        setInterviewStarted(true);
        setIsInterviewLoading(false);
    };

    const handleSendResponse = async (e) => {
        e.preventDefault();
        if (!userResponse.trim() || !interviewChat) return;

        setIsInterviewLoading(true);
        const currentHistory = [...interviewHistory, { role: 'user', text: userResponse }];
        setInterviewHistory(currentHistory);
        setUserResponse('');

        try {
            const response = await interviewChat.sendMessage({ message: userResponse });
            setInterviewHistory([...currentHistory, { role: 'ai', text: response.text }]);
        } catch (err) {
            console.error("Interview chat failed", err);
            setError("Sorry, an error occurred during the interview. Please try again.");
            setInterviewHistory(currentHistory); // Keep user message on error
        } finally {
            setIsInterviewLoading(false);
        }
    };

    // --- Skill Tester Handlers ---
    const handleGenerateSkillQuestion = async () => {
        setIsSkillLoading(true);
        setError('');
        setSkillQuestion('');
        setSkillAnswer('');
        setSkillFeedback('');
        
        const prompt = `Generate one technical or situational question to test a candidate's proficiency in "${selectedSkill}". The question should be clear and concise.`;
        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setSkillQuestion(response.text);
        } catch (err) {
            console.error("Skill question generation failed", err);
            setError("Failed to generate a question. Please try again.");
        } finally {
            setIsSkillLoading(false);
        }
    };
    
    const handleCheckAnswer = async () => {
        if (!skillAnswer) {
            setError("Please provide an answer to the question.");
            return;
        }
        setIsSkillLoading(true);
        setError('');
        setSkillFeedback('');
        
        const prompt = `A candidate was asked the following question about ${selectedSkill}: "${skillQuestion}". The candidate provided this answer: "${skillAnswer}". Please evaluate the answer for correctness, clarity, and completeness. Provide constructive feedback.`;
        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setSkillFeedback(response.text);
        } catch (err) {
            console.error("Skill answer check failed", err);
            setError("Failed to check the answer. Please try again.");
        } finally {
            setIsSkillLoading(false);
        }
    };

    // --- Resume Q&A Handlers ---
     const handleResumeFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setResumeFile(file);
            setResumeChatHistory([]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeDataUrl(reader.result as string);
                setResumeChatHistory([{role: 'ai', text: 'Your resume is loaded. What would you like to know? Feel free to ask me anything about its content or for suggestions to improve it.'}]);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAskResumeQuestion = async (e) => {
        e.preventDefault();
        if (!resumeQuestion.trim() || !resumeFile) return;
        
        setIsResumeLoading(true);
        const currentHistory = [...resumeChatHistory, {role: 'user', text: resumeQuestion}];
        setResumeChatHistory(currentHistory);
        setResumeQuestion('');
        
        const filePart = { inlineData: { data: resumeDataUrl.split(',')[1], mimeType: resumeFile.type } };
        const textPart = { text: `Based on the provided resume, answer the following question: "${resumeQuestion}"` };
        
        try {
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [filePart, textPart] } });
            setResumeChatHistory([...currentHistory, { role: 'ai', text: response.text }]);
        } catch (err) {
             console.error("Resume Q&A failed", err);
             setError("Sorry, I couldn't answer that question. Please try again.");
             setResumeChatHistory(currentHistory);
        } finally {
            setIsResumeLoading(false);
        }
    }


    return (
        <div className="ai-prep-hub-container">
            <header className="header filter-header">
                <button onClick={() => navigateTo('dashboard')} className="back-button" aria-label="Go back">← Back</button>
                <h1 className="header-title-filter">AI Prep Hub</h1>
                <div style={{ width: '80px' }}></div>
            </header>
            <main className="ai-prep-hub-main">
                <div className="tabs-container">
                    <button className={`tab-button ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}><UsersIcon /> Mock Interview</button>
                    <button className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}><CheckCircleIcon /> Skill Tester</button>
                    <button className={`tab-button ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}><DocumentIcon /> Resume Q&A</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {activeTab === 'interview' && (
                    <div className="tab-content">
                        <p className="tool-description">Practice a real-time interview with an AI for any job role.</p>
                        {!interviewStarted ? (
                            <div className="input-section">
                                <h4>Enter a Job Role to Begin</h4>
                                <input type="text" className="text-input" placeholder="e.g., Product Manager" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
                                <button className="action-button" onClick={handleStartInterview} disabled={isInterviewLoading || !jobRole}>
                                    {isInterviewLoading ? 'Starting...' : 'Start Interview'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="chat-window" ref={chatWindowRef}>
                                    {interviewHistory.map((msg, index) => (
                                        <div key={index} className={`chat-message ${msg.role}`} dangerouslySetInnerHTML={{ __html: formatTextToHtml(msg.text) }}></div>
                                    ))}
                                    {isInterviewLoading && <div className="loader" style={{alignSelf: 'flex-start'}}></div>}
                                </div>
                                <form className="chat-input-form" onSubmit={handleSendResponse}>
                                    <input type="text" className="text-input" placeholder="Type your answer..." value={userResponse} onChange={(e) => setUserResponse(e.target.value)} disabled={isInterviewLoading} />
                                    <button type="submit" className="action-button" disabled={isInterviewLoading || !userResponse.trim()}>Send</button>
                                </form>
                            </>
                        )}
                    </div>
                )}
                
                {activeTab === 'skills' && (
                    <div className="tab-content">
                         <p className="tool-description">Test your knowledge in a specific skill area with AI-generated questions.</p>
                         <div className="skill-tester-controls">
                             <div className="select-wrapper">
                                 <select className="location-select" value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
                                     {skillOptions.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                                 </select>
                             </div>
                             <button className="action-button" onClick={handleGenerateSkillQuestion} disabled={isSkillLoading}>
                                 {isSkillLoading ? '...' : 'New Question'}
                            </button>
                         </div>
                         {isSkillLoading && !skillQuestion && <div className="loader"></div>}
                         {skillQuestion && (
                             <>
                                <div className="skill-question-box">
                                    <h4>Question:</h4>
                                    <p>{skillQuestion}</p>
                                </div>
                                <textarea className="textarea-input" rows={6} placeholder="Your answer..." value={skillAnswer} onChange={(e) => setSkillAnswer(e.target.value)}></textarea>
                                <button className="action-button" onClick={handleCheckAnswer} disabled={isSkillLoading || !skillAnswer}>
                                    {isSkillLoading ? 'Checking...' : 'Check My Answer'}
                                </button>
                             </>
                         )}
                         {isSkillLoading && skillFeedback && <div className="loader"></div>}
                         {skillFeedback && (
                             <div className="result-container">
                                 <div className="skill-feedback-box">
                                     <h4>Feedback:</h4>
                                     <p dangerouslySetInnerHTML={{ __html: formatTextToHtml(skillFeedback) }}></p>
                                 </div>
                             </div>
                         )}
                    </div>
                )}

                {activeTab === 'resume' && (
                     <div className="tab-content">
                        <p className="tool-description">Upload your resume and ask the AI interviewer questions about it.</p>
                        <div className="input-section">
                             <div className="file-upload-wrapper">
                                <input type="file" id="resume-upload-prep" accept=".txt,.pdf,.doc,.docx" onChange={handleResumeFileChange} style={{display: 'none'}} />
                                <label htmlFor="resume-upload-prep" className="file-upload-label">
                                    <DocumentIcon />
                                    <span>{resumeFile ? resumeFile.name : 'Choose a resume file (.txt, .pdf, .docx)'}</span>
                                </label>
                            </div>
                            {resumeFile && <p className="file-success">Resume loaded successfully!</p>}
                        </div>
                        {resumeFile && (
                           <>
                                <div className="chat-window" ref={chatWindowRef}>
                                    {resumeChatHistory.map((msg, index) => (
                                        <div key={index} className={`chat-message ${msg.role}`} dangerouslySetInnerHTML={{ __html: formatTextToHtml(msg.text) }}></div>
                                    ))}
                                    {isResumeLoading && <div className="loader" style={{alignSelf: 'flex-start'}}></div>}
                                </div>
                                <form className="chat-input-form" onSubmit={handleAskResumeQuestion}>
                                    <input type="text" className="text-input" placeholder="Ask about your resume..." value={resumeQuestion} onChange={(e) => setResumeQuestion(e.target.value)} disabled={isResumeLoading} />
                                    <button type="submit" className="action-button" disabled={isResumeLoading || !resumeQuestion.trim()}>Ask</button>
                                </form>
                           </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

const quizQuestions = [
    { question: "When starting a new project, what's your first move?", options: ["Jump right in and start experimenting.", "Create a detailed plan and schedule.", "Brainstorm creative ideas with a team.", "Research existing solutions and data."] },
    { question: "Which work environment sounds most appealing?", options: ["A fast-paced, dynamic startup.", "A stable, well-organized corporate office.", "A collaborative and creative studio.", "A quiet, independent research lab."] },
    { question: "How do you prefer to solve difficult problems?", options: ["Through trial and error, learning as I go.", "By breaking it down into smaller, logical steps.", "By discussing different perspectives with others.", "By analyzing all available information first."] },
    { question: "You have a free afternoon. What are you most likely to do?", options: ["Build something with my hands or code a small project.", "Organize my closet or plan my week.", "Visit an art gallery or write a story.", "Read a non-fiction book or watch a documentary."] },
    { question: "What role do you naturally take in a group setting?", options: ["The one who gets things done and pushes for action.", "The organizer who keeps everyone on track.", "The idea generator who inspires others.", "The analyst who ensures decisions are well-informed."] },
    { question: "Which of these tasks would you enjoy the most?", options: ["Assembling furniture or fixing a broken gadget.", "Creating a budget or managing a project timeline.", "Designing a logo or brainstorming a marketing campaign.", "Conducting a scientific experiment or analyzing market trends."] },
    { question: "How do you feel about rules and procedures?", options: ["They're useful, but I'm not afraid to bend them.", "They are essential for efficiency and order.", "They can sometimes limit creativity.", "They should be based on evidence and logic."] },
    { question: "What's more important in a job?", options: ["Seeing tangible results from my work.", "Having structure and clear expectations.", "Having the freedom to express my creativity.", "The opportunity to learn and discover new things."] },
    { question: "When faced with a setback, you tend to:", options: ["Quickly try a different approach.", "Analyze what went wrong to prevent it from happening again.", "Look for a creative, unconventional solution.", "Gather more data to understand the root cause."] },
    { question: "Which school subject did you enjoy the most?", options: ["Shop class, computer science, or hands-on labs.", "Math or economics.", "Art, music, or literature.", "Physics, chemistry, or history."] },
    { question: "I am most effective when I can:", options: ["Work with concrete things and see immediate results.", "Follow a clear and structured process.", "Imagine new possibilities and inspire others.", "Deeply analyze complex information."] },
    { question: "A perfect day at work would involve:", options: ["Building, creating, or producing something tangible.", "Organizing systems, data, or people efficiently.", "Collaborating on innovative and original ideas.", "Solving a complex puzzle or conducting research."] },
    { question: "I prefer information to be presented:", options: ["As practical demonstrations or case studies.", "In organized charts, graphs, and outlines.", "As visual stories or metaphors.", "As detailed reports with supporting data."] },
    { question: "What kind of feedback is most valuable to you?", options: ["Feedback on the functionality and efficiency of my work.", "Feedback on my adherence to the plan and process.", "Feedback on the originality and impact of my ideas.", "Feedback on the accuracy and depth of my analysis."] },
    { question: "When learning a new skill, I prefer to:", options: ["Learn by doing and practicing.", "Follow a structured course with clear steps.", "Explore and connect it to other ideas.", "Understand the underlying theory and principles."] },
    { question: "Which movie genre do you prefer?", options: ["Action or Sci-Fi.", "Drama or Historical.", "Fantasy or Comedy.", "Mystery or Documentary."] },
    { question: "I feel most satisfied when I:", options: ["Complete a challenging task successfully.", "Bring order to a chaotic situation.", "Come up with an idea no one else has thought of.", "Finally understand a difficult concept."] },
    { question: "My ideal manager is someone who:", options: ["Gives me goals and gets out of my way.", "Provides clear instructions and expectations.", "Encourages experimentation and new ideas.", "Is an expert in the field and can answer my questions."] },
    { question: "I am drawn to careers that involve:", options: ["Technology, engineering, or skilled trades.", "Management, finance, or administration.", "Arts, communication, or design.", "Science, research, or data analysis."] },
    { question: "Ultimately, I want my work to be:", options: ["Practical and useful.", "Organized and reliable.", "Innovative and inspiring.", "Accurate and insightful."] }
];


const QuizPage = ({ navigateTo }) => {
    const [quizStage, setQuizStage] = useState('landing'); // 'landing', 'taking', 'loading', 'results'
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [quizResults, setQuizResults] = useState(null);
    const [error, setError] = useState('');

    const handleBack = () => {
        if (quizStage === 'landing') {
            navigateTo('dashboard');
        } else {
            // Reset state when going back to landing from an active quiz
            setQuizStage('landing');
            setCurrentQuestionIndex(0);
            setAnswers([]);
            setQuizResults(null);
            setError('');
        }
    };

    const startQuiz = () => {
        setQuizStage('taking');
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setQuizResults(null);
        setError('');
    };
    
    const handleAnswerSelect = (answer) => {
        const newAnswers = [...answers, { question: quizQuestions[currentQuestionIndex].question, answer }];
        setAnswers(newAnswers);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Last question answered, get results
            getCareerSuggestions(newAnswers);
        }
    };
    
    const getCareerSuggestions = async (finalAnswers) => {
        setQuizStage('loading');
        
        const prompt = `You are an expert career counselor. Based on the following 20 quiz answers, suggest 3 to 5 career paths that would be a great fit for the user. For each suggested career, provide a concise, one-paragraph explanation detailing why it aligns with their answers.

        Here are the user's answers:
        ${finalAnswers.map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`).join('\n\n')}
        `;

        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    careerName: { type: Type.STRING, description: "The name of the recommended career path." },
                    reason: { type: Type.STRING, description: "A paragraph explaining why this career is a good fit based on the quiz answers." },
                }
            }
        };

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema },
            });
            const results = JSON.parse(response.text);
            setQuizResults(results);
            setQuizStage('results');
        } catch (err) {
            console.error("AI call for quiz results failed", err);
            setError("Sorry, we couldn't generate your career suggestions. Please try the quiz again.");
            setQuizStage('results'); // Go to results to show error
        }
    };
    
    const progress = (currentQuestionIndex / quizQuestions.length) * 100;

    return (
        <div className="quiz-page-container">
            <button onClick={handleBack} className="quiz-back-button" aria-label="Go back">← Back</button>
            {quizStage === 'landing' && (
                <div className="quiz-landing-view">
                    <h1 className="quiz-landing-title">Choose a Quiz to Begin</h1>
                    <div className="quiz-options-grid">
                        <div className="quiz-option-card quiz-card-1" onClick={startQuiz}>
                            <h3>Know Your Personality Type</h3>
                            <p>Discover whether you’re more analytical, creative, social, or detail-oriented, and instantly match your traits to the most suitable career paths for you.</p>
                        </div>
                        <div className="quiz-option-card quiz-card-2" onClick={startQuiz}>
                            <h3>Take a General Personalized Quiz</h3>
                            <p>Answer a set of tailored questions about your strengths, interests, and goals to get career suggestions uniquely aligned with who you are.</p>
                        </div>
                        <div className="quiz-option-card quiz-card-3" onClick={startQuiz}>
                             <h3>Take a Quiz Based on Your Academics</h3>
                            <p>Get career recommendations based on your academic performance, favorite subjects, and learning style to see which paths fit you best.</p>
                        </div>
                    </div>
                </div>
            )}
            
            {quizStage === 'taking' && (
                <div className="quiz-taking-view">
                     <div className="quiz-progress-container">
                        <p className="quiz-progress-text">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                        <div className="quiz-progress-bar-background">
                            <div className="quiz-progress-bar-foreground" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <p className="quiz-question-text">{quizQuestions[currentQuestionIndex].question}</p>
                    <div className="quiz-answer-options">
                        {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                            <button key={index} className="quiz-answer-btn" onClick={() => handleAnswerSelect(option)}>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {quizStage === 'loading' && <div className="loader"></div>}
            
            {quizStage === 'results' && (
                 <div className="quiz-results-view">
                    <h2 className="quiz-results-title">Here Are Your Results!</h2>
                    <p className="quiz-results-subtitle">Based on your answers, here are a few career paths that might be a great fit for you.</p>
                    {error && <div className="error-message">{error}</div>}
                    {quizResults && (
                        <div className="quiz-results-grid">
                            {quizResults.map((result, index) => (
                                <div key={index} className="quiz-result-card">
                                    <h4>{result.careerName}</h4>
                                    <p>{result.reason}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={startQuiz} className="retake-quiz-btn">Take Quiz Again</button>
                 </div>
            )}

        </div>
    );
};


const LandingPage = ({ navigateTo }) => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1 className="landing-title">Dream</h1>
                <h2 className="landing-subtitle">Personalized Career and Skills Advisor</h2>
                <p className="landing-description">
                    Discover your perfect career path with AI-powered insights tailored to your unique
                    skills and passions
                </p>
                <button className="get-started-btn" onClick={() => navigateTo('dashboard')}>
                    Get Started
                </button>
            </div>
            <div className="landing-features">
                <div className="feature-highlight-card">
                    <h3>AI-Powered</h3>
                    <p>Smart recommendations based on your skills and interests</p>
                </div>
                <div className="feature-highlight-card">
                    <h3>Personalized</h3>
                    <p>Tailored career paths that match your unique profile</p>
                </div>
                <div className="feature-highlight-card">
                    <h3>Future-Ready</h3>
                    <p>Stay ahead with insights into emerging career opportunities</p>
                </div>
            </div>
        </div>
    );
};


const App = () => {
  const [page, setPage] = useState('landing');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const navigateTo = (targetPage) => {
    setPage(targetPage);
  };

  const selectCourseAndNavigate = (course) => {
    setSelectedCourse(course);
    setPage('analysis');
  }

  return (
    <>
      {page === 'landing' && <LandingPage navigateTo={navigateTo} />}
      {page === 'dashboard' && <Dashboard navigateTo={navigateTo} />}
      {page === 'filter' && <Filter navigateTo={navigateTo} selectCourseAndNavigate={selectCourseAndNavigate} />}
      {page === 'analysis' && <AnalysisPage navigateTo={navigateTo} course={selectedCourse} />}
      {page === 'strengths' && <StrengthsFinderPage navigateTo={navigateTo} />}
      {page === 'resumeAnalyzer' && <ResumeAnalyzerPage navigateTo={navigateTo} />}
      {page === 'aiPrepHub' && <AIPrepHubPage navigateTo={navigateTo} />}
      {page === 'quiz' && <QuizPage navigateTo={navigateTo} />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);