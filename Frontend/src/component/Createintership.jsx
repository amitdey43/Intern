import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
export const SKILLS = [
  "C","C#","C++","Java","Python","PHP","Kotlin","R","Swift","Objective-C",
  "HTML","CSS","JavaScript","TypeScript",
  "React","Redux","Angular","Vue.js","Next.js",
  "Node.js","Express","Fastify","NestJS","REST API","REST APIs","GraphQL","Web Development",
  "APIs","WordPress",

  ".NET",".NET Core","ASP.NET",
  "Spring Boot","Hibernate",
  "Django","Flask","Laravel","Symfony",
  "Core Data",

  "MySQL","PostgreSQL","SQL","SQL Server","MongoDB",

  "Analysis","Analytics","BI",
  "Data Analysis","Data Science","Data Visualization",
  "Machine Learning","Deep Learning","NLP",
  "NumPy","Pandas","Keras","TensorFlow","PyTorch",
  "Statistics","Tableau","Power BI",
  "Financial Modeling","Excel","Risk Analysis",

  "AWS","Azure","GCP",
  "Docker","Kubernetes","Helm",
  "Terraform","Jenkins","CI/CD",
  "Microservices","Linux","Ansible",

  "Android","Android Development","Android SDK",
  "iOS","iOS Development","Xcode",

  "UI/UX","UI/UX Design",
  "Figma","Adobe","Adobe Illustrator","Adobe XD",
  "Photoshop","Sketch","Wireframing","Prototyping",
  "Design","3D Modeling",

  "Unity","Unreal","Unreal Engine",
  "Game Design","Game Physics",
  "VR","VR Development",

  "Blockchain","Ethereum","Solidity",
  "Smart Contracts","Web3","Web3.js",

  "Security","Network Security",
  "Ethical Hacking","Penetration Testing",
  "Firewalls","SIEM",

  "SEO","Google Analytics",
  "Digital Marketing","Marketing",
  "Marketing Strategy","Marketing Campaigns",
  "Content","Content Creation","PPC","Campaigns",

  "Agile","Scrum",
  "Project Management","Stakeholder Management",
  "Communication","Leadership","Teamwork","Problem Solving",
  "Jira","HR Management","HR Policies",
  "Recruitment","Employee Relations","Talent Management",
  "Training"
];

export const CreateInternship = () => {
  const [formData, setFormData] = useState({
    title: "",
    mode:"",
    // department: "",
    skills: [],
    domain:"",
    stipend:"",
    city:"",
    duration:"",
    numberOfOpenings: "",
    startDate: "",
    endDate: "",
    description: ""
  });
  const [domainInput, setDomainInput] = useState("");
  const [suggest,setSuggest]=useState([]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlesuggection= (e)=>{
    let value= e.target.value;
    setDomainInput(value)
    if(value.length==0){
      setSuggest([])
      return
    }
    let filtered = SKILLS.filter((skill)=>(skill.toLowerCase().startsWith(value.toLowerCase())))
    setSuggest(filtered.slice(0,5));
  }
 
  const handleAddDomain = (e) => {
    e.preventDefault();
    const trimmed = domainInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData({ ...formData, skills: [...formData.skills, trimmed] });
      setDomainInput("");
    }
  };

  
  const handleRemoveDomain = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((d) => d !== skill)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/app/hr/create-internship",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      alert("Internship created successfully!");

      setFormData({
        title: "",
        mode:"",
        department: "",
        skills: [],
        domain:"",
        stipend:"",
        city:"",
        duration:"",
        numberOfOpenings: "",
        startDate: "",
        endDate: "",
        description: ""
      });
    } catch (error) {
      // error.message = Object.values(err.errors)[0].message;

      toast.error(error.response?.data?.message || error.message);
      if (error.response && error.response.status === 401) {
          navigate("/login");
      }
      // toast.error("Failed to create internship");
    }
  };

  return (
    <div className="create-internship">
      <h2>📝 Create Internship</h2>
      <form className="internship-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Internship Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Frontend Developer"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Mode of Internship</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
          >
            <option value="">Select mode</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">Human Resources</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales & Business Development</option>
            <option value="Finance">Finance & Accounting</option>
            <option value="Operations">Operations & Management</option>
            <option value="Customer Support">Customer Support / Client Relations</option>
            <option value="Content Writing">Content Writing / Copywriting</option>
            <option value="Data Science">Data Science & Analytics</option>
            <option value="R&D">Research & Development (R&D)</option>
            <option value="Product Management">Product Management</option>
            <option value="Legal">Legal / Compliance</option>
            <option value="Supply Chain">Supply Chain & Logistics</option>
            <option value="Education">Education & Training</option>
          </select>
        </div> */}

        <div className="form-group">
          <label>Internship Stipend</label>
          <input
            type="Number"
            name="stipend"
            placeholder="e.g.,5000/per month"
            value={formData.stipend}
            onChange={handleChange}
            min={0}
          />
        </div>
        <div className="form-group">
          <label>Internship Duration</label>
          <input
            type="Number"
            name="duration"
            placeholder="in months"
            value={formData.duration}
            onChange={handleChange}
            min={1}
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="e.g.,Kolkata "
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Internship Role</label>
          <select
            name="domain"
            value={formData.domain}
            onChange={handleChange}
          >
              <option value="">Select Job Role</option>

              <option value="mobile developer">Mobile Developer</option>
              <option value="data scientist">Data Scientist</option>
              <option value="backend developer">Backend Developer</option>
              <option value="designer">Designer</option>
              <option value="full stack python developer">Full Stack Python Developer</option>
              <option value="frontend developer">Frontend Developer</option>
              <option value="php developer">PHP Developer</option>
              <option value="game developer">Game Developer</option>
              <option value="full stack java developer">Full Stack Java Developer</option>
              <option value="devops engineer">DevOps Engineer</option>
              <option value="marketing">Marketing</option>
              <option value="hr">HR</option>
              <option value="c# developer">C# Developer</option>
              <option value="blockchain developer">Blockchain Developer</option>
              <option value="software project manager">Software Project Manager</option>
              <option value="cybersecurity engineer">Cybersecurity Engineer</option>
              <option value="data analyst">Data Analyst</option>
              <option value="web developer">Web Developer</option>
              <option value="kubernetes operations engineer">Kubernetes Operations Engineer</option>
              <option value="aiml">AIML</option>
              <option value="finance">Finance</option>
              <option value="video game designer">Video Game Designer</option>

          </select>
          
        </div>



        <div className="form-group">
          <label>Skills Requirements</label>
          <div className="domain-input">
            <input
              type="text"
              placeholder="Type skill and select for suggestion"
              value={domainInput}
              onChange={handlesuggection}
            />
            {suggest.map((suu,i)=>(
              <span style={{backgroundColor:"yellowgreen",color:"black",cursor:true}} key={i} onClick={(e)=> {setDomainInput(suu);setSuggest([])}}>
                {suu}
              </span>
            ))}
            <button onClick={handleAddDomain}>+ Add</button>
          </div>
          <div className="domain-list">
            {formData.skills.map((d, idx) => (
              <span className="domain-item" key={idx}>
                {d}{" "}
                <span className="remove" onClick={() => handleRemoveDomain(d)}>
                  ✖
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Number of Openings</label>
          <input
            type="number"
            name="numberOfOpenings"
            placeholder="e.g., 5"
            min="1"
            value={formData.numberOfOpenings}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Application Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Application End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe the internship role, responsibilities, and requirements"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit">Create Internship</button>
      </form>
    </div>
  );
};


