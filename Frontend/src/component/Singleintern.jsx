import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, useNavigate, useParams } from 'react-router-dom';

// --- INTERNAL ICON COMPONENTS (Replacing lucide-react) ---
const IconArrowLeft = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);
const IconBuilding = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
  </svg>
);
const IconShare = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
  </svg>
);
const IconDollar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconMapPin = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClock = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCalendar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const IconCheckCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
const IconSparkles = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
  </svg>
);
const IconCpu = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
  </svg>
);
const IconAlertCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

const InternshipDetails = () => {
  // --- STATE & HOOKS ---
  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState("");
  const [formdata, setFormdata] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  
  const navigate = useNavigate();
  const { id } = useParams();

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("http://localhost:8000/app/user/internship", { id }, {
          withCredentials: true,
        });
        setFormdata(res.data?.internship || {});
        setUser(res.data?.user || {});
      } catch (error) {
        console.error("Failed to fetch data, falling back to mock for UI demo");
        // Fallback mock data
        setFormdata({
            _id: "123",
            title: "Frontend Developer",
            companyName: "Innovate Solutions Inc.",
            mode: "Hybrid",
            department: "Engineering",
            domain: "Web Development",
            skills: ["React", "JavaScript", "HTML", "CSS", "Tailwind"],
            stipend: 25000,
            numberOfOpenings: 5,
            city: "Bangalore",
            duration: 6,
            startDate: new Date("2024-09-15").toISOString(),
            endDate: new Date("2025-03-15").toISOString(),
            description: "Join our dynamic team to build and maintain user-facing web applications. You will work on cutting-edge projects and contribute to the entire software development lifecycle.",
        });
        setUser({ role: "Student", appliedInterships: [] });
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [id]);

  // --- HELPERS ---
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // --- HUGGING FACE API GENERATION LOGIC ---
  const generateInterviewQuestions = async () => {
    setIsLoading(true);
    setInterviewQuestions(null);
    setMessage(null);
    
    // 1. YOUR HUGGING FACE TOKEN HERE
    const hfToken = ""; // <--- PASTE YOUR HUGGING FACE TOKEN HERE (starts with 'hf_')
    
    // 2. Model Selection (Mistral is great for instructions)
    const model = "mistralai/Mistral-7B-Instruct-v0.2"; 
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

    // 3. Prompt Engineering for Mistral
    // We use [INST] to strictly instruct the model to return ONLY JSON.
    const prompt = `[INST] You are an expert technical recruiter. 
    Generate a list of 5-7 common interview questions for a ${formdata.title} position at ${formdata.companyName}.
    Required skills: ${formdata?.skills?.join(', ')}.
    
    STRICT REQUIREMENT: Return ONLY a raw JSON array of strings. 
    Do not include markdown formatting (like \`\`\`json). 
    Do not include any introductory text. 
    Example output format: ["Question 1", "Question 2"] 
    [/INST]`;

    try {
      if (!hfToken) {
         // UI Fallback if no token provided during testing
         setTimeout(() => {
            setInterviewQuestions([
                "Can you explain the virtual DOM in React? (Demo Mode)",
                "What are the differences between ES6 and ES5?",
                "How do you handle state management?",
                "Explain the concept of hoisting in JavaScript.",
                "How would you optimize React performance?"
            ]);
            setIsLoading(false);
            setMessage("Demo Mode: Add your HF Token to generate real AI results.");
         }, 1500);
         return;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500, // Limit response length
            return_full_text: false, // Don't return the prompt back
            temperature: 0.7, // Creativity balance
            do_sample: true
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        // Handle "Model is loading" specific HF error
        if (err.error && err.error.includes("loading")) {
            throw new Error("Model is currently loading on the server. Please try again in 30 seconds.");
        }
        throw new Error(err.error || `HTTP Error ${response.status}`);
      }

      const result = await response.json();
      
      // Hugging Face returns an array: [{ generated_text: "..." }]
      const textOutput = result[0]?.generated_text;

      if (textOutput) {
        // 4. Robust JSON Parsing
        // Sometimes open models add text like "Here is your JSON:". We use Regex to find the array.
        const jsonMatch = textOutput.match(/\[[\s\S]*\]/); 
        
        if (jsonMatch) {
            const parsedQuestions = JSON.parse(jsonMatch[0]);
            setInterviewQuestions(parsedQuestions);
        } else {
            // Fallback if JSON parsing fails but text exists (treat lines as questions)
            const fallbackList = textOutput.split('\n').filter(line => line.includes('?')).slice(0, 5);
            setInterviewQuestions(fallbackList.length > 0 ? fallbackList : ["Could not parse questions. Try again."]);
        }
      } else {
        throw new Error("Empty response from AI");
      }

    } catch (error) {
      console.error("HF API Error:", error);
      setInterviewQuestions([
        "Could not generate questions due to an error.",
        "1. Check your Hugging Face Token.",
        "2. The model might be busy (free tier limits).",
        `Error: ${error.message}`
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
      );
  }

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- GLASSMORPHIC HERO SECTION --- */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 pt-10 pb-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 text-sm font-medium"
          >
            <IconArrowLeft size={16} /> Back to Internships
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-3">
                 <IconBuilding size={12} /> {formdata.department || "Engineering"}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                {formdata.title}
              </h1>
              <h2 className="text-xl text-indigo-200 font-medium flex items-center gap-2">
                {formdata.companyName}
                <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                <span className="text-sm bg-indigo-800/50 px-2 py-0.5 rounded text-indigo-100 border border-indigo-700/50">
                    {formdata.mode}
                </span>
              </h2>
            </div>

            <div className="flex gap-3">
               <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-3 rounded-xl transition-all">
                  <IconShare size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT CARD --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
            
          {/* LEFT COLUMN: Details & Description */}
          <div className="flex-1 space-y-6">
            
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <IconDollar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Stipend</p>
                            <p className="text-gray-900 font-bold">₹{formdata.stipend}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                            <IconMapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Location</p>
                            <p className="text-gray-900 font-bold">{formdata.city}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                            <IconClock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Duration</p>
                            <p className="text-gray-900 font-bold">{formdata.duration} months</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <IconCalendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Start Date</p>
                            <p className="text-gray-900 font-bold">{formatDate(formdata.startDate)}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        About the Internship
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {formdata.description}
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                        {formdata.skills?.map((skill, index) => (
                            <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default">
                                <IconCheckCircle size={14} className="text-blue-500"/> {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Generation Section (Hugging Face) */}
            {user?.role === "Student" && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                <IconSparkles size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">AI Interview Prep (Hugging Face)</h3>
                        </div>
                        <p className="text-gray-600 mb-6 max-w-2xl">
                            Get ahead of the competition. Generate specific interview questions tailored to this role and your skills using the Mistral-7B AI model.
                        </p>

                        {!interviewQuestions && (
                            <button 
                                onClick={generateInterviewQuestions} 
                                disabled={isLoading}
                                className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Connecting to Hugging Face...
                                    </>
                                ) : (
                                    <>
                                        <IconCpu size={18} /> Generate Questions
                                    </>
                                )}
                            </button>
                        )}

                        {/* Generated Questions Output */}
                        {interviewQuestions && (
                            <div className="mt-6 bg-white rounded-xl border border-indigo-100 p-6 shadow-sm animate-fade-in">
                                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <IconSparkles size={14} /> Potential Questions
                                </h4>
                                <ul className="space-y-3">
                                    {interviewQuestions.map((q, idx) => (
                                        <li key={idx} className="flex gap-3 text-gray-700 text-sm md:text-base">
                                            <span className="font-bold text-indigo-400 select-none">{idx + 1}.</span>
                                            <span>{q}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => setInterviewQuestions(null)}
                                    className="mt-4 text-xs font-semibold text-gray-400 hover:text-gray-600 underline"
                                >
                                    Clear & Generate New
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar (Sticky) */}
          <div className="lg:w-1/3">
             <div className="sticky top-24 space-y-6">
                
                {/* Application Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-1">Interested in this role?</h3>
                    <p className="text-sm text-gray-500 mb-6">Review the key dates and apply before it expires.</p>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Department</span>
                            <span className="text-sm font-semibold text-gray-800">{formdata.department}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Openings</span>
                            <span className="text-sm font-semibold text-gray-800">{formdata.numberOfOpenings} Spots</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Apply By</span>
                            <span className="text-sm font-semibold text-red-500">{formatDate(formdata.endDate)}</span>
                        </div>
                    </div>

                    {user?.role === "Student" && (
                        user.appliedInterships?.map(app => app.internship.toString()).includes(formdata._id) ? (
                            <button disabled className="w-full bg-green-100 text-green-700 font-bold py-3.5 px-4 rounded-xl cursor-not-allowed flex justify-center items-center gap-2">
                                <IconCheckCircle size={18} /> Already Applied
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate(`/internship/apply/${formdata._id}`)}
                                className="w-full bg-gray-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:bg-gray-800 transform active:scale-95 transition-all flex justify-center items-center gap-2"
                            >
                                Apply Now <IconArrowLeft className="rotate-180" size={18} />
                            </button>
                        )
                    )}
                    
                    {!user && (
                        <button onClick={() => navigate('/login')} className="w-full bg-blue-50 text-blue-600 font-bold py-3.5 px-4 rounded-xl hover:bg-blue-100 transition-colors">
                            Login to Apply
                        </button>
                    )}
                </div>

                {/* Safety Card */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <h4 className="text-orange-800 font-bold text-sm mb-2 flex items-center gap-2">
                        <IconAlertCircle size={16} />
                        Safety Tip
                    </h4>
                    <p className="text-xs text-orange-700 leading-relaxed">
                        Never pay any money for internship opportunities. If a company asks for payment, please report it immediately.
                    </p>
                </div>

             </div>
          </div>

        </div>
      </div>
      
      {/* Toast Message */}
      {message && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            {message}
        </div>
      )}

    </div>
  );
};

// Main Export Wrapped with Router for Standalone Usage


export default InternshipDetails;