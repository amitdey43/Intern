import { useEffect, useState } from "react";
import { CreateInternship } from "./Createintership";
import { Internships } from "./internships";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export const Hrdashboard = function () {
  const [activeTab, setActiveTab] = useState("overview");
  const [domains, setDomains] = useState([]);
  const [domainInput, setDomainInput] = useState("");
  const [Hr,setHr]= useState("");
  const [total,setTotal]= useState(0);
  const [shortlisted,setShortlisted]= useState(0);
  const [pending,setPending]= useState("");
  const [rejected,setRejected]= useState("");
  const [uh,setUh]= useState("");
  const [shortlistUh,setShortlistUh]= useState("");
  let navigate= useNavigate();

     let logout= function(){

        axios.get("http://localhost:8000/app/hr/logout",{
            withCredentials:true
        }).then((res)=>{alert(res.data?.message);
            navigate("/");
        })
        .catch(()=>{
            alert("There is problem to logout");
        })
    }

useEffect(() => {
  axios.get("http://localhost:8000/app/hr/hrdetails", {
    withCredentials: true,
  })
  .then((res) => {
    setHr(res.data?.hr);
    setTotal(res.data?.totalc);
    setShortlisted(res.data?.shortlisted);
    setPending(res.data?.pending);
    setRejected(res.data?.rejected);
    setUh(res.data?.uh);
    setShortlistUh(res.data?.shortlistUh);
  })
  .catch(() => {
    alert("There is problem to fetch user details");
  });
}, []);

// useEffect(() => {
//   axios.get("http://localhost:8000/app/hr/getuserforhr", {
//     withCredentials: true,
//   })
//   .then((res) => {
//     setAppuser(res.data?.applyUsers);
//   })
//   .catch(() => {
//     alert("There is problem to fetch user details");
//   });
// }, []);


  const handleAddDomain = (e) => {
    e.preventDefault();
    const trimmed = domainInput.trim();
    if (trimmed && !domains.includes(trimmed)) {
      setDomains([...domains, trimmed]);
      setDomainInput("");
    }
  };

  const handleRemoveDomain = (domain) => {
    setDomains(domains.filter((d) => d !== domain));
  };

  return (
    <div className="dashboard" style={{fontWeight:"600", fontSize:"1.5rem"}}>
      {/* Header */}
      <header className="header">
        <h1>Internship Recommendation - HR Dashboard</h1>
        <div className="profile">
          <span className="profile-pic">👩‍💼</span>
          <span className="profile-name">Welcome, HR Manager</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">⚙️ Menu</h2>
        <nav>
          <button onClick={() => setActiveTab("overview")} className={activeTab === "overview" ? "active" : ""}>
            📊 Overview
          </button>
          <button onClick={() => setActiveTab("candidates")} className={activeTab === "candidates" ? "active" : ""}>
            👥 Candidates
          </button>
          <button onClick={() => setActiveTab("notifications")} className={activeTab === "notifications" ? "active" : ""}>
            🔔 Notifications
          </button>
          <button onClick={() => setActiveTab("createInternship")} className={activeTab === "createInternship" ? "active" : ""}>
            📝 Create Internship
          </button>
          <button onClick={() => setActiveTab("interviews")} className={activeTab === "interviews" ? "active" : ""}>
            📅 Interviews
          </button>
          <button onClick={() => setActiveTab("internships")} className={activeTab === "internships" ? "active" : ""}>
            📑 Interships
          </button>
          <button onClick={() => setActiveTab("settings")} className={activeTab === "settings" ? "active" : ""}>
            ⚙️ Settings
          </button>
          <div className="sidebar-footer">
                       <button onClick={logout}>Log Out</button>
            </div>
             <div className="sidebar-footer">
                       <button onClick={()=>navigate("/")}>Home Page</button>
                    </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="main">
        {activeTab === "overview" && (
            <div className="overview">
            <h2>📊 Overview</h2>
            <div className="cards">
                <div className="card">
                <div className="card-header">
                    <span>Total Candidates</span>
                    <span className="icon">👥</span>
                </div>
                <h3>{total || "No entry yet"}</h3>
                <div className="progress">
                    <div className="progress-bar" style={{ width: "100%" }}></div>
                </div>
                </div>

                <div className="card">
                <div className="card-header">
                    <span>Shortlisted</span>
                    <span className="icon">✅</span>
                </div>
                <h3>{shortlisted}</h3>
                <div className="progress">
                    <div className="progress-bar" style={{ width: "40%" }}></div>
                </div>
                </div>

                <div className="card">
                <div className="card-header">
                    <span>Pending</span>
                    <span className="icon">⏳</span>
                </div>
                <h3>{pending}</h3>
                <div className="progress">
                    <div className="progress-bar" style={{ width: "31%" }}></div>
                </div>
                </div>

                <div className="card">
                <div className="card-header">
                    <span>Rejected</span>
                    <span className="icon">❌</span>
                </div>
                <h3>{rejected}</h3>
                <div className="progress">
                    <div className="progress-bar" style={{ width: "28%" }}></div>
                </div>
                </div>
            </div>
            </div>

        )}

        {activeTab === "candidates" && (
              <div style={{
                background: "#ffffff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                margin: "20px auto",
                maxWidth: "900px",
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
              }}>
                <h2 style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  fontSize: "24px",
                  color: "#4f46e5"
                }}>👥 Candidates</h2>

                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}>
                  <thead style={{ background: "#4f46e5", color: "#fff" }}>
                    <tr>
                      <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Applied For</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                      <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody style={{color:"black"}}>
                    {uh?.map((intern,index)=>
                      <tr key={index} style={{
                        background: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                        transition: "background 0.3s"
                      }}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{intern?.user?.name}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{intern?.internship?.title}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{intern?.status}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                          <button 
                            onClick={()=>navigate(`/user/details/${intern?.user?._id}/${intern?.internship?._id}`)}
                            style={{
                              background: "#4f46e5",
                              color: "white",
                              padding: "8px 14px",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "600",
                              transition: "all 0.3s ease"
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "#4338ca"}
                            onMouseOut={e => e.currentTarget.style.background = "#4f46e5"}
                          >
                            See Details
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

        )}

                  {activeTab === "notifications" && (
                    <div style={{color:"black"}}>
                      <h2>🔔 Notifications</h2>
                      <ul className="notifications">
                        <li>New candidate applied for Backend Intern</li>
                        <li>HR round scheduled for Amit Kumar</li>
                        <li>Reminder: Final interviews tomorrow</li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "createInternship" && (
                        <CreateInternship/>
                  )}

                  {activeTab === "interviews" && (
                    <div className="mx-auto my-5 max-w-[700px] rounded-xl bg-white p-5 font-sans shadow-lg flex flex-col gap-2">
                      <h2 className="mb-5 text-center text-[22px] text-green-600">
                        📋 Interview Management
                      </h2>

                      {/* Scheduled Interviews Section */}
                      <div className="mb-8">
                        <h3 className="mb-3 text-lg font-semibold text-blue-700">
                          ✅ Scheduled Interviews
                        </h3>
                        <ul className="m-0 list-none p-0">
                          {shortlistUh
                            ?.filter((uh) => uh?.interviewtime) // only those with interviewtime set
                            .map((uh, index) => (
                              <li
                                key={index}
                                className={`mb-3 flex items-center justify-between rounded-lg border border-gray-200 p-4 
                                  transition-all duration-200 hover:scale-[1.02] hover:shadow-md
                                  ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                              >
                                <span className="text-base font-medium text-gray-700">
                                  <strong className="text-blue-600">{uh?.user?.name}</strong> has an interview scheduled for the{" "}
                                  <strong className="text-green-700">{uh?.internship?.title}</strong> role at{" "}
                                  <strong className="text-blue-600">{uh?.internship?.companyname}</strong> <br />
                                  <span className="text-sm text-gray-500">
                                    📅 {new Date(uh?.interviewtime).toLocaleString()}
                                  </span>
                                </span>
                              </li>
                            ))}
                          {shortlistUh?.filter((uh) => uh?.interviewtime).length === 0 && (
                            <p className="text-gray-500">No interviews scheduled yet.</p>
                          )}
                        </ul>
                      </div>

                      {/* Not Scheduled Section */}
                      <div>
                        <h3 className="mb-3 text-lg font-semibold text-orange-600">
                          ⏳ Shortlisted (Not Scheduled)
                        </h3>
                        <ul className="m-0 list-none p-0">
                          {shortlistUh
                            ?.filter((uh) => !uh?.interviewtime) // only those without interviewtime
                            .map((uh, index) => (
                              <li
                                key={index}
                                className={`mb-3 flex items-center justify-between rounded-lg border border-gray-200 p-4 
                                  transition-all duration-200 hover:scale-[1.02] hover:shadow-md
                                  ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                              >
                                <span className="text-base font-medium text-gray-700">
                                  Schedule time for <strong className="text-blue-600">{uh?.user?.name}</strong> for the{" "}
                                  <strong className="text-green-700">{uh?.internship?.title}</strong> role at{" "}
                                  <strong className="text-blue-600">{uh?.internship?.companyname}</strong>
                                </span>
                                <button
                                  className="cursor-pointer rounded-lg border-none bg-blue-600 px-3.5 py-2 
                                    font-semibold text-white transition-all duration-300 ease-in-out 
                                    hover:bg-blue-700"
                                    onClick={()=> navigate(`/interview/${uh._id}`)}
                                >
                                  Schedule Time
                                </button>
                              </li>
                            ))}
                          {shortlistUh?.filter((uh) => !uh?.interviewtime).length === 0 && (
                            <p className="text-gray-500">All shortlisted candidates have been scheduled.</p>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}


                  {activeTab === "internships" && (
                    <Internships uh={uh} hr={Hr}/>
                  )}

                  {activeTab === "settings" && (
                    <div>
                      <h2>⚙️ Settings</h2>
                      <form className="settings-form">
                        <input type="text" placeholder="HR Name" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Change Password" />
                        <button type="submit">Save Changes</button>
                      </form>
                    </div>
                  )}
                </main>
              </div>
            );
          };
