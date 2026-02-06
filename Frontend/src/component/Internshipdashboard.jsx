import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Filter, 
  Sparkles, 
  TrendingUp, 
  ArrowRight
} from "lucide-react";

const InternshipCard = ({ intern, isFeatured = false }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/intership/details/${intern._id}`)}
      className={`relative group bg-white rounded-2xl p-5 cursor-pointer transition-all duration-300 border border-gray-100
      ${isFeatured ? 'hover:shadow-purple-200 shadow-lg border-l-4 border-l-purple-500' : 'hover:shadow-xl hover:-translate-y-1 shadow-md'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`font-bold text-gray-800 line-clamp-1 ${isFeatured ? 'text-xl' : 'text-lg'}`}>
            {intern.title}
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-1">
            <Briefcase size={12} /> {intern.department}
          </span>
        </div>
        {isFeatured && (
           <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
             <Sparkles size={12} /> AI Pick
           </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <span>{intern.mode}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-green-500" />
          <span className="font-medium text-gray-900">₹{intern.stipend} / month</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>Starts: {intern.startDate?.substring(0, 10)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {intern.skills?.slice(0, 3).map((skill, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            {skill}
          </span>
        ))}
        {intern.skills?.length > 3 && (
          <span className="text-xs text-gray-400 px-1">+{intern.skills.length - 3}</span>
        )}
      </div>
    </div>
  );
};



export const InternshipsList = () => {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [department, setDepartment] = useState("");
  const [mode, setMode] = useState("");
  const [minStipend, setMinStipend] = useState("");
  const [maxStipend, setMaxStipend] = useState("");
  const [sort, setSort] = useState("newest");
  const [skills,setSkills]= useState([]);
  const [role,setRole]= useState("")

  // --- NEW STATE FOR AI RECOMMENDATIONS ---
  const [recommendations, setRecommendations] = useState([]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      let query = [];

      if (keyword) query.push(`keyword=${keyword}`);
      if (department) query.push(`department=${department}`);
      if (mode) query.push(`mode=${mode}`);
      if (minStipend) query.push(`stipendgte=${minStipend}`);
      if (maxStipend) query.push(`stipendlte=${maxStipend}`);

      if (sort === "stipend-high") query.push("sort=-stipend");
      else if (sort === "stipend-low") query.push("sort=stipend");
      else query.push("sort=-createdAt");

      const res = await axios.get(
        `http://localhost:8000/app/user/internships?${query.join("&")}`,
        { withCredentials: true }
      );

      setInternships(res.data?.products || []);
      setSkills(res.data?.skills);
      setRole(res.data?.role)
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };
  const fetchRecommendation= async()=>{
    let res= await axios.post("http://127.0.0.1:5000/predict",{
      skills
    })
    setRecommendations(res.data)
  }
  useEffect(() => {
    fetchInternships();
  }, []);

useEffect(() => {
  if (skills.length > 0) {
    fetchRecommendation();
  }
}, [skills]);

  

  const handleFilter = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  // --- AI RECOMMENDATION LOGIC ---
 

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Briefcase className="text-blue-600" /> CareerConnect
          </h2>
          <div className="text-sm text-gray-500 hidden sm:block">
            Find your dream internship today
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* --- SECTION 1: AI RECOMMENDATIONS --- */}
        {role=="Student" && !loading && recommendations.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Sparkles className="text-yellow-300 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AI Recommendations</h3>
                  <p className="text-purple-200 text-sm">Curated top roles based on market trends</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{rec.role}</h4>
                        <p className="text-xs text-indigo-200 uppercase tracking-wider mt-1">Top Match</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold text-green-400">{(rec.predict*100).toFixed(2)}%</span>
                        <span className="text-xs text-white/60">Match</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">
                        Available Positions ({rec.internships.length})
                      </div> */}
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20">
              
                              <button onClick={()=>navigate(`/recommended/${rec.role}/${(rec.predict*100).toFixed(2)}`)} className="font-semibold text-sm truncate">Find job for <span className="text-xl font-bold text-green-400">{rec.role}</span></button>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION 2: FILTERS --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
                <Filter size={20} />
                <h3 className="font-semibold text-lg">Filters</h3>
            </div>
            
            <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, dept, domain..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white"
                        />
                    </div>
                </div>

                <select 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                >
                    <option value="">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">Human Resources</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Content Writing">Content Writing</option>
                    <option value="Data Science">Data Science</option>
                    <option value="R&D">R&D</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Legal">Legal</option>
                    <option value="Supply Chain">Supply Chain</option>
                    <option value="Education">Education</option>
                </select>

                <select 
                    value={mode} 
                    onChange={(e) => setMode(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                >
                    <option value="">Any Mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                </select>

                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min ₹"
                        value={minStipend}
                        onChange={(e) => setMinStipend(e.target.value)}
                        className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <input
                        type="number"
                        placeholder="Max ₹"
                        value={maxStipend}
                        onChange={(e) => setMaxStipend(e.target.value)}
                        className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>

                <div className="flex gap-2 col-span-1 sm:col-span-2 lg:col-span-1">
                     <select 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    >
                        <option value="newest">Newest</option>
                        <option value="stipend-high">Highest Stipend</option>
                        <option value="stipend-low">Lowest Stipend</option>
                    </select>
                </div>
                
                <button 
                    type="submit" 
                    className="col-span-1 sm:col-span-2 lg:col-span-4 bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 active:scale-[0.99] transition-all shadow-lg shadow-gray-200"
                >
                    Apply Filters
                </button>
            </form>
        </div>

        {/* --- SECTION 3: MAIN LIST --- */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-600"/> All Opportunities
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {internships.length} results
                </span>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p>Loading internships...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
                    {error}
                </div>
            )}

            {!loading && internships.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No internships found matching your criteria.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((intern) => (
                    <InternshipCard key={intern._id} intern={intern} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

/* ---------- Plain CSS ---------- */
// Paste this into a CSS file and import it
/*
.page-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.heading {
  text-align: center;
  margin-bottom: 20px;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.search-bar, select {
  padding: 8px;
  font-size: 14px;
  flex: 1;
}
.internship-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}
.internship-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.internship-card:hover {
  transform: scale(1.02);
}
.apply-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
.apply-btn:hover {
  background: #0056b3;
}
.no-results {
  text-align: center;
  font-style: italic;
}
*/
