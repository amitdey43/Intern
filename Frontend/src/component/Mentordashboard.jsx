
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const MessageSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const MoreVerticalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
);



const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* CSS Reset & Body Styles */
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f4f7fa;
      color: #1a202c;
    }

    /* Main Dashboard Layout */
    .mentor-dashboard {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 260px;
      background-color: #ffffff;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }
    .sidebar-header .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2563eb;
    }

    .profile-card {
        margin-top: 1.5rem;
        text-align: center;
    }
    .profile-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin: 0 auto 1rem;
        border: 3px solid #e2e8f0;
        object-fit: cover;
    }
    .profile-card h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #2d3748;
    }
    .profile-card p {
        margin: 0.25rem 0 0;
        color: #718096;
        font-size: 0.875rem;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    /* Header */
.headerrr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ffffffff, #c9d0dfff); /* modern dark gradient */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: #f8fafc;
}

.headerrr h1 {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #3b82f6; /* modern blue accent */
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #f8fafc;
  transition: transform 0.2s ease, color 0.2s ease;
}

.notification-bell:hover {
  transform: scale(1.1);
  color: #3b82f6;
}

.notification-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  background: #ef4444; /* red for notification */
  border-radius: 50%;
  border: 2px solid #1e293b; /* border matches background */
}


    /* Stats Cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .stat-card {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease-in-out;
    }
    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.05);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2563eb;
      background-color: #dbeafe;
    }
    .stat-info h4 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
    }
    .stat-info p {
      margin: 0;
      color: #718096;
      font-size: 0.875rem;
    }
    .stat-card.rating .stat-icon { background-color: #fef3c7; color: #d97706; }

    /* Assigned Students Table */
    .students-container {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    .students-container h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1.5rem 0;
      color: #2d3748;
    }
    .students-table {
      width: 100%;
      border-collapse: collapse;
    }
    .students-table th, .students-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    .students-table th {
      color: #718096;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .student-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .student-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }
     .student-info div {
        font-weight: 500;
        color: #4a5568;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      display: inline-block;
    }
    .status-active { background-color: #d1fae5; color: #065f46; }
    .status-pending { background-color: #ffedd5; color: #9a3412; }
    
    .action-button {
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .action-button:hover {
      background-color: #1d4ed8;
    }
    .action-menu {
      color: #a0aec0;
      cursor: pointer;
    }
  `}</style>
);


export const Mentordashboard = () => {
  let navigate = useNavigate();
  const [mentor, setMentor] = useState("");
  const [students, setStudents] = useState([]);
  const [mu,setMu]= useState([]);

   let logout= function(){

        axios.get("http://localhost:8000/app/mentor/logout",{
            withCredentials:true
        }).then((res)=>{alert(res.data?.message);
            navigate("/");
        })
        .catch(()=>{
            alert("There is problem to logout");
        })
    }
useEffect(() => {
  axios.get("http://localhost:8000/app/mentor/dashboard", { withCredentials: true })
    .then((res) => {
      setMentor(res.data?.mentor);
      setStudents(res.data?.users || []);
      setMu(res.data?.mu || []);
    })
    .catch((err) => {
      console.error("Dashboard fetch error:", err);
      alert("Can't fetch mentor data");
    });
}, []);

let handleAccept = (userid,mentorid)=>{
  axios.put("http://localhost:8000/app/mentor/acceptrequest",{
    userid,
    mentorid
  },{
    withCredentials:true
  }).then(()=>{
    alert("Accept request successfully");
  }).catch(()=>{
    alert("Internal Issue")
  })
}
 let av = mu.length > 0 
  ? (mu.reduce((n, m) => n + (m.rate || 0), 0) / mu.length).toFixed(1) 
  : "0.0";


  return (
    <>
      <GlobalStyles />
      <div className="mentor-dashboard">
        <aside className="sidebar">
          <div className="sidebar-header">
             <div className="logo">Mentor</div>
          </div>
          {mentor && (
            <>
             <div className="profile-card">
                <img src={mentor.profilePic} alt="Mentor Avatar" className="profile-avatar" />
                <h3>{mentor.name}</h3>
                <p>{mentor.organization}</p>
             </div>
             <div className="sidebar-footer" style={{backgroundColor:"green", borderRadius:"25px"}}>
                       <button onClick={logout} style={{display:"flex", justifyContent:"center"}}>Log Out</button>
              </div>
              <div className="sidebar-footer" style={{backgroundColor:"blue", borderRadius:"25px"}}>
                       <button onClick={()=>navigate("/")} style={{display:"flex", justifyContent:"center"}}>Home Page</button>
              </div>
              </>
          )}
        </aside>

        
        <main className="main-content">
          <header className="headerrr">
            <h1>Dashboard</h1>
            <div className="header-actions">
              <div className="notification-bell">
                 <BellIcon/>
                 <div className="notification-dot"></div>
              </div>
            </div>
          </header>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><UsersIcon/></div>
              <div className="stat-info">
                <h4>{mentor?.assignedStudents?.length}</h4>
                <p>Assigned Students</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><MessageSquareIcon/></div>
              <div className="stat-info">
                <h4>{mentor?.activechat?.length}</h4>
                <p>Active Chats</p>
              </div>
            </div>
            <div className="stat-card rating">
              <div className="stat-icon"><StarIcon/></div>
              <div className="stat-info">
                <h4>{av}</h4>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          <div className="students-container">
            <h2>Assigned Students</h2>
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Contact Field</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
               {mu?.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No student assigned to you yet
                    </td>
                  </tr>
                )  : (
                  mu?.map((use) => (
                    <tr key={use._id}>
                      <td>
                        <div className="student-info">
                          <img
                            src={use.user?.profilePic}
                            alt="Student Avatar"
                            className="student-avatar"
                          />
                          <div>{use.user?.name}</div>
                        </div>
                      </td>
                      <td>{use.user?.phone}</td>
                      <td>{use.status}</td>
                      <td>
                        {use.status === "pending" ? (
                          <button className="action-button" onClick={()=>handleAccept(use.user._id,use.mentor)}>Accept request</button>
                        ) : (
                          <button className="action-button" style={{backgroundColor:"green"}} onClick={()=>navigate(`/chatvideo/${use.user._id}/${use.mentor}`)}>Guide Student</button>
                        )}
                      </td>
                      <td>
                        <div className="action-menu">
                          <MoreVerticalIcon />
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {/* {mu?.map(use => (
                  <tr key={use._id}>
                    <td>
                        <div className="student-info">
                            <img src={use.profilePic} alt="Student Avatar" className="student-avatar" />
                            <div>{use.name}</div>
                        </div>
                    </td>
                    <td>{use.phone}</td>
                    <td>
                        {use.status}
                    </td>
                    <td>
                      {use.status==="pending"?<button className="action-button">Accept request</button>:<button className="action-button">Guide Student</button>}
                    </td>
                    <td>
                      <div className="action-menu"><MoreVerticalIcon/></div>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default Mentordashboard;