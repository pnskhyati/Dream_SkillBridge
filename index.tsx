/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { LandingPage } from './landing';
import { Dashboard } from './dashboard';
import { Filter } from './filter';
import { AnalysisPage } from './analysis';
import { StrengthsFinderPage } from './strengths';
import { ResumeAnalyzerPage } from './resumeAnalyzer';
import { AIPrepHubPage } from './aiPrepHub';
import { QuizPage } from './quiz';

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
