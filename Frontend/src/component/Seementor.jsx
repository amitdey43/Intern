import axios from 'axios';
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --bg-color: #f0f2f5;
      --card-bg: #ffffff;
      --text-primary: #1a202c;
      --text-secondary: #4a5568;
      --accent-color: #4299e1;
      --accent-color-light: #ebf8ff;
      --border-color: #e2e8f0;
      --star-color: #f6e05e;
      --status-active-bg: #c6f6d5;
      --status-active-text: #2f855a;
      --status-pending-bg: #fed7d7;
      --status-pending-text: #c53030;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    * {
      box-sizing: border-box;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header-section {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .header-section h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .header-section p {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    .search-bar {
        display: flex;
        justify-content: center;
        margin-bottom: 2.5rem;
    }

    .search-input {
        width: 100%;
        max-width: 500px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        transition: box-shadow 0.2s;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px var(--accent-color-light);
    }

    .mentors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .mentor-card {
      background-color: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      display: flex;
      flex-direction: column;
    }

    .mentor-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
    }

    .mentor-card-content {
      padding: 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-grow: 1;
    }

    .mentor-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1rem;
      border: 3px solid var(--card-bg);
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .mentor-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .mentor-expertise {
      color: var(--accent-color);
      font-weight: 500;
      margin: 0.25rem 0 1rem 0;
    }
    
    .mentor-details {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-top: auto;
    }

    .mentor-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .mentor-rating svg {
        width: 20px;
        height: 20px;
        color: var(--star-color);
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-active {
      background-color: var(--status-active-bg);
      color: var(--status-active-text);
    }
    
    .status-pending {
      background-color: var(--status-pending-bg);
      color: var(--status-pending-text);
    }

    .footer {
        text-align: center;
        margin-top: 3rem;
        padding: 1.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
        border-top: 1px solid var(--border-color);
    }
  `}</style>
);

// --- Mock Data ---
// Based on your schema, here's some sample data for mentors.
const mockMentors = [
  { id: 1, user: 'user1', rate: 4.8, status: 'active', name: 'Anjali Sharma', expertise: 'Frontend Development', avatar: `https://i.pravatar.cc/150?img=1` },
  { id: 2, user: 'user2', rate: 4.9, status: 'active', name: 'Rohan Gupta', expertise: 'Backend & APIs', avatar: `https://i.pravatar.cc/150?img=3` },
  { id: 3, user: 'user3', rate: 4.7, status: 'pending', name: 'Priya Singh', expertise: 'UI/UX Design', avatar: `https://i.pravatar.cc/150?img=5` },
  { id: 4, user: 'user4', rate: 5.0, status: 'active', name: 'Vikram Choudhary', expertise: 'DevOps & Cloud', avatar: `https://i.pravatar.cc/150?img=7` },
  { id: 5, user: 'user5', rate: 4.6, status: 'active', name: 'Sameer Khan', expertise: 'Data Science', avatar: `https://i.pravatar.cc/150?img=8` },
  { id: 6, user: 'user6', rate: 4.8, status: 'active', name: 'Neha Reddy', expertise: 'Product Management', avatar: `https://i.pravatar.cc/150?img=10` },
  { id: 7, user: 'user7', rate: 4.5, status: 'pending', name: 'Amit Desai', expertise: 'Mobile Development', avatar: `https://i.pravatar.cc/150?img=12` },
  { id: 8, user: 'user8', rate: 4.9, status: 'active', name: 'Sunita Menon', expertise: 'AI & Machine Learning', avatar: `https://i.pravatar.cc/150?img=14` },
];


// --- Components ---

const StarIcon = () => (
    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
);

let addHandle= (mentorid,userid)=>{
    axios.post("http://localhost:8000/app/user/addmentor",{
        mentorid,userid
    },{
        withCredentials:true
    }).then((res)=>{
        alert("Request sent to the mentor")
    })
    .catch(()=>{
        alert("Internal issue")
    })
}

const MentorCard = ({ mentor,user }) => {
  let navigate = useNavigate()
  return (
    <div className="mentor-card">
      <div className="mentor-card-content">
        <img 
            src={mentor.profilePic} 
            alt={`${mentor.name}'s avatar`} 
            className="mentor-avatar" 
            onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/100x100/EBF8FF/4299E1?text=${mentor.name.charAt(0)}`; }}
        />
        <h3 className="mentor-name">{mentor.name}</h3>
        Expertise
        {mentor.expertiseAreas.map((ex,index)=><p className="mentor-expertise" key={index}>{ex}</p>)}
        {/* <p className="mentor-expertise">{mentor.expertiseAreas}</p> */}
        <div className="mentor-details">
            {/* <span className="mentor-rating">
                <StarIcon /> {mentor.rate.toFixed(1)}
            </span> */}
            {/* <span className={`status-badge status-${mentor.status}`}>
                {mentor.status}
            </span> */}
        </div>
      </div>

              {user?.mentorAssigned ? (
                user?.mentorAssigned?.toString() === mentor?._id?.toString() ? (
                  <button
                    style={{
                      backgroundColor: mentor.activechat.includes(user._id)
                        ? "green"
                        : "orange",
                    }}
                    onClick={() => {
                      if (mentor.activechat.includes(user._id)) {
                        // 👉 only navigate, don’t join room here
                        navigate(`/chat/${user._id}/${mentor._id}`);
                      } else {
                        alert("Your request is still pending!");
                      }
                    }}
                  >
                    {mentor.activechat.includes(user._id) ? "Start Chat" : "Request sent"}
                  </button>
                ) : (
                  <button>You can assign only one mentor</button>
                )
              ) : (
                <button onClick={() => addHandle(mentor._id, user._id)}>
                  Request to Add
                </button>
             )}
     {/* {user?.mentorAssigned?(user?.mentorAssigned?.toString()=== mentor?._id?.toString()?(<button   style={{
        backgroundColor: mentor.activechat.includes(user._id)
          ? "green"
          : "orange",
      }} >{mentor.activechat.includes(user._id)?"Start Chat":"Request sent"}</button>):(<button>You can assign only one mentor</button>)):(<button onClick={()=>addHandle(mentor._id,user._id)}>Request to Add</button>)} */}
      
      {/* <button onClick={()=>addHandle(mentor._id,user._id)}>Request to Add</button> */}
    </div>
  );
};




export const Seementor= function() {
  
  let [mentors,setMentor]= useState([]);  
  let [user,setUser]= useState("");
  useEffect(()=>{
    axios.get("http://localhost:8000/app/user/seementor",{
        withCredentials:true
    })
    .then((res)=>{
        setMentor(res.data?.mentors || []);
        setUser(res.data?.user)
    })
    .catch(()=>{
        alert("Can't fetch mentors data");
    })
  },[])
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = useMemo(() => {
    if (!searchTerm) {
      return mentors;
    }
    return mentors?.filter(mentor =>
      mentor?.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    //   mentor?.expertiseAreas.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mentors, searchTerm]);

  return (
    <>
      <GlobalStyles />
      <div className="container">
        <header className="header-section">
          <h1 style={{color:"white"}}>Find Your Mentor</h1>
          <p>Connect with industry experts who can guide you on your professional journey.</p>
        </header>

        <div className="search-bar">
            <input 
                type="text"
                style={{color:"white"}}
                placeholder="Search by name or expertise (e.g., 'Rohan' or 'Data Science')"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <main>
          <div className="mentors-grid">
            {filteredMentors?.map(mentor => (
              <MentorCard key={mentor._id} mentor={mentor} user={user}/>
            ))}
          </div>
        </main>
        
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} MentorConnect. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}