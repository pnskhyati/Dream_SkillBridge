/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Type } from "@google/genai";
import { ai } from './common';

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

export const QuizPage = ({ navigateTo }) => {
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
