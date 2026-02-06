import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { 
  Sparkles, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Zap,
  Target
} from "lucide-react";

// --- COMPONENT: RecommendedJobCard ---

const RecommendedJobCard = ({ job }) => {
    console.log("srgbbbb");
    
  const navigate = useNavigate();

  const getMatchColor = (score) => {
    if (score >= 95) return "text-emerald-500 bg-emerald-50 border-emerald-100";
    if (score >= 85) return "text-blue-600 bg-blue-50 border-blue-100";
    return "text-purple-600 bg-purple-50 border-purple-100";
  };

  const matchTheme = getMatchColor(job.matchScore);

  return (
    <div 
      onClick={() => navigate(`/intership/details/${job._id}`)}
      className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Banner for very high matches */}


      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            
          </div>
          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
            <Briefcase size={14} />
            {job.companyName || "Top Company"}
          </p>
        </div>
        
        {/* Match Score Badge */}
        
      </div>

      {/* Tags / Why this job? */}
      <div className="flex flex-wrap gap-2 mb-4">
        
      </div>

      <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-semibold">
            <DollarSign size={12} /> ₹{job.stipend}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {job.mode}
          </span>
        </div>
        <button className="text-blue-600 font-semibold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
          View Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE CONTENT ---
const RecommendedJobsContent = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const {role,pre} = useParams();
  const [huu,setHuu]= useState();
  
  // Fake "User Profile" for the demo


 
useEffect(() => {
  if (!role) return;

  const fetchAndProcessJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/app/user/internships/${encodeURIComponent(role)}`,
        { huu },
        { withCredentials: true }
      );

      setJobs(res.data?.intern || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchAndProcessJobs();
}, [role, huu]);


  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-blue-600" /> AI Recommendations
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* --- GLASSMORPHIC HERO / INSIGHTS --- */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 overflow-hidden shadow-2xl">
           {/* Animated blobs */}
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20"></div>

           <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
             <div className="text-white space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-2">
                 <Star size={12} className="fill-blue-200" /> Personalized for you
               </div>
               <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                 We found <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{role}</span> role <br/>
                 matching your profile.
               </h1>
               <p className="text-indigo-200 max-w-lg">
                 Based on your skills, these opportunities are your best bet for you in this growing industry
               </p>
             </div>

             {/* Stats Cards inside Glass */}
             <div className="flex gap-4 w-full md:w-auto">
               <div className="flex-1 md:w-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all cursor-default">
                 <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                 <div className="text-2xl font-bold text-white">{pre}%</div>
                 <div className="text-xs text-indigo-200">Profile Match</div>
               </div>
               {/* <div className="flex-1 md:w-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all cursor-default">
                 <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                 <div className="text-2xl font-bold text-white">12</div>
                 <div className="text-xs text-indigo-200">New Today</div>
               </div> */}
             </div>
           </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="text-blue-600" size={20}/> Top Picks
            </h3>
            
            {/* Simple Sort Dropdown */}
            <div className="relative group">
              <select onChange={(e)=>setHuu(e.target.value)} value={huu} className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer text-sm font-medium hover:border-blue-400 transition-colors">
                <option value="">Sort by Salary</option>
                <option value="-1">Highest</option>
                <option value="+1">Lowest</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1, 2, 3, 4, 5, 6].map((n) => (
                 <div key={n} className="h-48 bg-gray-100 rounded-2xl animate-pulse"></div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <RecommendedJobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Wrapper for Router context
const RecommendedJobsPage = () => {
  return (
      <RecommendedJobsContent />

  );
};

export default RecommendedJobsPage;