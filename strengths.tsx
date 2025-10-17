/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Type } from "@google/genai";
import { ai } from './common';

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

export const StrengthsFinderPage = ({ navigateTo }) => {
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
