import React, { useState, useEffect } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://tjqsmkaiajdpotmafqvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcXNta2FpYWpkcG90bWFmcXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODA3NDIsImV4cCI6MjA3MTU1Njc0Mn0.9710q9W5EFfCagj340AizUSKiOXYApy0xkTFszFjO8o';

let supabase;
if (supabaseUrl !== 'https://tjqsmkaiajdpotmafqvw.supabase.co' && supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcXNta2FpYWpkcG90bWFmcXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODA3NDIsImV4cCI6MjA3MTU1Njc0Mn0.9710q9W5EFfCagj340AizUSKiOXYApy0xkTFszFjO8o') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase credentials are not set. Data will not be saved.");
}

// --- GEMINI API CONFIGURATION ---
// The API key is handled by the environment, so we can leave this empty.
const apiKey = "";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

// --- Icon Components (Inline SVGs) ---
const IconIdentify = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-indigo-500"><path d="m12 13.4-4.5 4.5" /><path d="m21.5 16.4-4.5 4.5" /><path d="m2.5 21.5 4.5-4.5" /><path d="m16.5 2.5-4.5 4.5" /><path d="m10.5 2.5 4.5 4.5" /><path d="m3.5 13.4 4.5-4.5" /><path d="M12 8.8 7.5 4.2" /><path d="M7.5 18.8 3 22" /><path d="M16.5 13.4 12 8.8" /></svg>
);
const IconRoadmap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-indigo-500"><path d="M18 6.2c-1.5-1-3.5-.2-4.5 1.3-1 1.5-1.5 3.5-.5 5 .5.8 1.3 1.2 2.2 1.2s1.7-.5 2.2-1.2c1-1.5 1-3.5-.5-5Z" /><path d="m6 11.8 4.5-4.5" /><path d="m14 18.8 4.5-4.5" /><path d="m6 18.8 4.5-4.5" /><path d="m14 11.8 4.5-4.5" /></svg>
);
const IconAchieve = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-indigo-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
);
const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-500"><path d="M20 6 9 17l-5-5" /></svg>
);
const AiSparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-indigo-500"><path d="M12 3L9.5 9.5 3 12l6.5 2.5L12 21l2.5-6.5L21 12l-6.5-2.5z" /></svg>
);

// --- Mock Data ---
const assessmentQuestions = [
    {
        question: "Which of the following best describes your coding experience?",
        options: ["Beginner (Just started learning)", "Intermediate (Built a few projects)", "Advanced (Comfortable with complex concepts)", "Expert (Professional experience)"],
    },
    {
        question: "Which area interests you the most?",
        options: ["Web Development (Frontend/Backend)", "AI / Machine Learning", "Cloud Computing & DevOps", "Business Analysis & Product Management"],
    },
    {
        question: "How do you prefer to solve problems?",
        options: ["Analytically, with data and logic", "Creatively, by brainstorming new ideas", "Collaboratively, by working in a team", "Independently, focusing on the task"],
    },
];

// --- Reusable Components ---
const CTAButton = ({ children, onClick, className = '', type = 'button' }) => (
    <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px -5px rgba(99, 102, 241, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        type={type}
        className={`bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:bg-indigo-700 ${className}`}
    >
        {children}
    </motion.button>
);

const Card = ({ icon, title, children }) => (
    <motion.div
        className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-gray-200"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center gap-4 mb-3">
            {icon}
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{children}</p>
    </motion.div>
);

// --- Page Sections ---
const HeroSection = ({ onStart }) => (
    <div className="text-center py-20 md:py-32 px-4">
        <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            Your Career, <span className="text-indigo-600">Simplified.</span>
        </motion.h1>
        <motion.p
            className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
        >
            Confused about what to learn next? Our AI-powered Career Analysis tool gives you a personalized roadmap to success, based on real industry insights from Diverse Loopers.
        </motion.p>
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <CTAButton onClick={onStart}>Start Your Free Analysis →</CTAButton>
        </motion.div>
    </div>
);

const WhyAnalysisSection = () => (
    <section className="py-16 bg-indigo-50/50 px-4">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why AI-Powered Career Analysis?</h2>
                <p className="max-w-3xl mx-auto text-gray-600 text-lg">
                    70% of students graduate without a clear career pathway. We use AI to analyze your unique profile against market demand and generate a step-by-step plan tailored just for you.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <Card icon={<IconIdentify />} title="Identify Skill Gaps">Know what’s missing and what employers are looking for.</Card>
                <Card icon={<IconRoadmap />} title="Get Personalized Roadmap">Receive a step-by-step guide to your ideal career.</Card>
                <Card icon={<IconAchieve />} title="Achieve Your Goals">Land internships and jobs faster with a clear, AI-driven plan.</Card>
            </div>
        </div>
    </section>
);

const HowItWorksSection = () => (
    <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4 relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-gray-200 hidden md:block"></div>
                {['Tell Us About You', 'Take a Quick Assessment', 'AI-Powered Analysis', 'Get Your Report & Roadmap'].map((title, i) => (
                    <motion.div
                        key={title}
                        className="text-center relative bg-white p-4 rounded-lg"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                    >
                        <div className="mb-4 flex justify-center">
                            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-lg">{i + 1}</div>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                        <p className="text-sm text-gray-500">
                            {
                                [
                                    'Fill a short form about your college year, branch, and skills.',
                                    'A simple quiz to gauge your aptitude and technical skills.',
                                    'Our Gemini-powered AI matches your profile with industry benchmarks.',
                                    'Download a personalized PDF with your step-by-step learning path.'
                                ][i]
                            }
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const FeaturesSection = () => (
    <section className="py-16 bg-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Features of Your AI-Generated Report</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-left">
                {[
                    'Skill Proficiency Score (Technical, Soft Skills, Aptitude)',
                    'AI-Recommended Career Pathway Suggestions',
                    'Personalized Course Recommendations',
                    'Curated Projects & Internship Ideas',
                    'Overall Job Readiness Score',
                    'Personalized Summary & Action Plan'
                ].map(feature => (
                    <motion.div
                        key={feature}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <IconCheck />
                        <span>{feature}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const FinalCTASection = ({ onStart }) => (
    <section className="text-center py-20 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to unlock your future?</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            Stop the guesswork. Get a clear, AI-driven roadmap to your dream career. Start your free analysis today.
        </p>
        <CTAButton onClick={onStart}>Start Analysis Now</CTAButton>
    </section>
);

// --- Analysis Flow Components ---
const CareerAnalysisForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({ name: '', collegeYear: '', branch: '', skills: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
            <h2 className="text-2xl font-bold text-center mb-6">Step 1: Tell Us About You</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <select name="collegeYear" onChange={handleChange} required className="w-full p-3 border rounded-lg">
                    <option value="">Select College Year</option>
                    <option>First Year</option><option>Second Year</option><option>Third Year</option><option>Final Year</option><option>Graduate</option>
                </select>
                <input type="text" name="branch" placeholder="Your Branch (e.g., Computer Science)" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <input type="text" name="skills" placeholder="Your Skills (e.g., Python, React, Figma)" onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                <CTAButton type="submit" className="w-full">Next: Quick Assessment →</CTAButton>
            </form>
        </motion.div>
    );
};

const CareerAssessment = ({ onSubmit }) => {
    const [answers, setAnswers] = useState({});

    const handleSelect = (qIndex, option) => {
        setAnswers({ ...answers, [qIndex]: option });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.keys(answers).length === assessmentQuestions.length) {
            onSubmit(answers);
        } else {
            alert("Please answer all questions.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
            <h2 className="text-2xl font-bold text-center mb-6">Step 2: Quick Assessment</h2>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
                {assessmentQuestions.map((q, qIndex) => (
                    <div key={qIndex}>
                        <p className="font-semibold mb-3">{q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map(opt => (
                                <button key={opt} type="button" onClick={() => handleSelect(qIndex, opt)}
                                    className={`p-3 border rounded-lg text-left transition-all ${answers[qIndex] === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:border-indigo-400'}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <CTAButton type="submit" className="w-full">Generate My AI Report →</CTAButton>
            </form>
        </motion.div>
    )
};

const CareerReport = ({ reportData, onReset }) => {
    const { name, recommendedPath, skillScores, readiness, summary, projects, courses } = reportData;
    const radarData = skillScores.map(s => ({ subject: s.name, A: s.user, fullMark: 100 }));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">Your AI-Powered Career Report</h2>
                <p className="text-lg text-gray-600">Hello, {name}! Here's your personalized analysis.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border mb-8">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><AiSparkleIcon /> AI Summary & Recommendation</h3>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                    <h3 className="font-bold text-xl mb-4">Recommended Career Pathway</h3>
                    <div className="bg-indigo-100 text-indigo-800 p-6 rounded-lg text-center">
                        <p className="text-lg font-semibold">Our AI suggests this path for you:</p>
                        <p className="text-3xl font-bold my-2">{recommendedPath}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                    <h3 className="font-bold text-xl mb-4">Job Readiness Score</h3>
                    <div className="text-center">
                        <div className="relative w-40 h-40 mx-auto">
                            <svg className="w-full h-full" viewBox="0 0 36 36"><path className="text-gray-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /><motion.path className="text-indigo-600" strokeWidth="3" strokeDasharray={`${readiness}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 100 - readiness }} transition={{ duration: 1.5, ease: "easeInOut" }} /></svg>
                            <div className="absolute inset-0 flex items-center justify-center"><span className="text-4xl font-bold">{readiness}%</span></div>
                        </div>
                        <p className="mt-3 text-gray-600">Industry requires ~80% for entry-level roles.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border mb-8">
                <h3 className="font-bold text-xl mb-4 text-center">Skill Proficiency Analysis</h3>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div><ResponsiveContainer width="100%" height={300}><BarChart data={skillScores} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} /><Tooltip /><Legend /><Bar dataKey="user" name="Your Score" fill="#4f46e5" radius={[0, 5, 5, 0]} barSize={20} /><Bar dataKey="industry" name="Industry Average" fill="#a5b4fc" radius={[0, 5, 5, 0]} barSize={20} /></BarChart></ResponsiveContainer></div>
                    <div><ResponsiveContainer width="100%" height={300}><RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}><PolarGrid /><PolarAngleAxis dataKey="subject" /><PolarRadiusAxis angle={30} domain={[0, 100]} /><Radar name="Your Skills" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} /></RadarChart></ResponsiveContainer></div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                    <h3 className="font-bold text-xl mb-4">Suggested Projects</h3>
                    <ul className="space-y-3 list-disc list-inside text-gray-700">{projects.map(p => <li key={p}>{p}</li>)}</ul>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                    <h3 className="font-bold text-xl mb-4">Recommended Courses</h3>
                    <ul className="space-y-3 list-disc list-inside text-gray-700">{courses.map(c => <li key={c}>{c}</li>)}</ul>
                </div>
            </div>

            <div className="text-center mt-12"><CTAButton onClick={onReset}>Start a New Analysis</CTAButton></div>
        </motion.div>
    );
};

// --- Main App Component ---
export default function CareerAnalysisTool() {
    const [view, setView] = useState('landing');
    const [userData, setUserData] = useState(null);
    const [reportData, setReportData] = useState(null);

    const handleStart = () => setView('form');
    const handleFormSubmit = (data) => {
        setUserData(data);
        setView('assessment');
    };

    const generateAiReport = async (submissionData) => {
        const { name, collegeYear, branch, skills, assessment_answers } = submissionData;

        const systemPrompt = "You are a world-class career counselor for tech students. Your goal is to provide a concise, actionable, and encouraging career analysis based on the user's input. Generate a report in a valid JSON format, adhering strictly to the provided schema.";

        const userQuery = `
        Please generate a career analysis report for the following student:
        - Name: ${name}
        - College Year: ${collegeYear}
        - Branch: ${branch}
        - Self-reported Skills: ${skills}
        - Assessment Answers:
          - Coding Experience: ${assessment_answers[0]}
          - Area of Interest: ${assessment_answers[1]}
          - Problem Solving Style: ${assessment_answers[2]}

        Based on this, provide a personalized report. The scores should be realistic estimations. The summary should be encouraging. Project and course suggestions should be specific and relevant to the recommended path.
      `;

        const payload = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: userQuery }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        recommendedPath: { type: "STRING" },
                        jobReadinessScore: { type: "NUMBER" },
                        skillScores: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, userScore: { type: "NUMBER" } } } },
                        personalizedSummary: { type: "STRING" },
                        suggestedProjects: { type: "ARRAY", items: { type: "STRING" } },
                        recommendedCourses: { type: "ARRAY", items: { type: "STRING" } },
                    },
                },
            },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);

            const result = await response.json();
            const jsonText = result.candidates[0].content.parts[0].text;
            const aiData = JSON.parse(jsonText);

            setReportData({
                name: name,
                recommendedPath: aiData.recommendedPath,
                readiness: aiData.jobReadinessScore,
                summary: aiData.personalizedSummary,
                projects: aiData.suggestedProjects,
                courses: aiData.recommendedCourses,
                skillScores: aiData.skillScores.map(score => ({
                    ...score,
                    user: score.userScore, // Map userScore to 'user' for the chart
                    industry: { 'Aptitude': 75, 'Soft Skills': 80, 'Technical': 85, 'Projects': 70 }[score.name] || 80,
                })),
            });
            setView('report');

        } catch (error) {
            console.error("Error generating AI report:", error);
            alert("The AI analysis failed. Please try again later. We'll show you a sample report for now.");
            // Fallback to a sample report on AI failure
            setReportData({
                name,
                recommendedPath: "Full-Stack Development",
                readiness: 72,
                summary: "This is a sample report. Based on your interest in web technologies and intermediate experience, a Full-Stack role is a great fit. Focusing on backend skills and deploying a full-scale project will significantly boost your profile.",
                projects: ["Develop a blog platform with user authentication.", "Create a real-time chat application using WebSockets."],
                courses: ["Advanced Node.js and Express", "React State Management (Redux/Zustand)"],
                skillScores: [
                    { name: 'Aptitude', user: 70, industry: 75 },
                    { name: 'Soft Skills', user: 60, industry: 80 },
                    { name: 'Technical', user: 65, industry: 85 },
                    { name: 'Projects', user: 50, industry: 70 },
                ]
            });
            setView('report');
        }
    };

    const handleAssessmentSubmit = async (answers) => {
        setView('loading');
        const submissionData = { ...userData, assessment_answers: answers };

        if (supabase) {
            const { error } = await supabase.from('career_analyses').insert([submissionData]);
            if (error) {
                console.error('Error saving to Supabase:', error);
                alert('There was an error saving your analysis. Please try again.');
                setView('assessment');
                return;
            }
            console.log("Data saved to Supabase successfully!");
        }

        await generateAiReport(submissionData);
    };

    const handleReset = () => {
        setView('landing');
        setUserData(null);
        setReportData(null);
    }

    const renderView = () => {
        switch (view) {
            case 'form': return <CareerAnalysisForm onSubmit={handleFormSubmit} />;
            case 'assessment': return <CareerAssessment onSubmit={handleAssessmentSubmit} />;
            case 'loading': return (
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold">Your AI-Powered Report is Being Generated...</h2>
                    <p>Our Gemini AI is crafting your personalized career roadmap.</p>
                </div>
            );
            case 'report': return <CareerReport reportData={reportData} onReset={handleReset} />;
            default: return (
                <>
                    <HeroSection onStart={handleStart} />
                    <WhyAnalysisSection />
                    <HowItWorksSection />
                    <FeaturesSection />
                    <FinalCTASection onStart={handleStart} />
                </>
            );
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="text-2xl font-bold text-gray-900">
                            Diverse <span className="text-indigo-600">Loopers</span>
                        </div>
                        <CTAButton onClick={handleStart}>Start Analysis</CTAButton>
                    </div>
                </div>
            </header>

            <main>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={view !== 'landing' ? 'py-16 px-4' : ''}
                    >
                        {renderView()}
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto py-8 px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} Diverse Loopers. All rights reserved.</p>
                    <p className="text-sm text-gray-400">Your Partner in Career Growth</p>
                </div>
            </footer>
        </div>
    );
}

