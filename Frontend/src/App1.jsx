// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { RegisterMentor } from "./component/RegisterMentor";
import { RegisterHR } from "./component/RegistrationHR";

import { Register } from "./component/Register";
import { Login } from "./component/Login";
import { Userdashboard } from "./component/Userdashboard";
import { Mentordashboard } from "./component/Mentordashboard";
import {Hrdashboard} from "./component/Hrdashboard"
import { Forgotpassword } from "./component/Forgotpassword";
import { Resetforgotpassword } from "./component/Resetpassword";
import { Home } from "./component/Home";
import { InternshipsList } from "./component/Internshipdashboard";
import InternshipDetails from "./component/Singleintern";
import Internapply from "./component/Internapply";
import UserProfileForHR from "./component/Getuserforhr";
import { Editinternship } from "./Editinternship";
import { Seementor } from "./component/Seementor";
import { Usermentorchat } from "./component/Usermentorchat";
import { MentorUserChat } from "./component/Mentoruserchat";
import { Scheduletime } from "./component/Scheduletime";




function App1() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<App />} />
        <Route path="/mentor/register" element={<RegisterMentor/>}/>
        <Route path="/hr/register" element={<RegisterHR/>}/>
        {/* <Route path="/hr/register" element={<RegisterHR/>}/> */}
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/user/dashboard" element={<Userdashboard/>}/>
        <Route path="/hr/dashboard" element={<Hrdashboard/>}/>
        <Route path="/mentor/dashboard" element={<Mentordashboard/>}/>
        <Route path="/forgot-password" element={<Forgotpassword/>}/>
        <Route path="/reset-password/:role/:token" element={<Resetforgotpassword/>}/>
        <Route path="/internships" element={<InternshipsList/>}/>
        <Route path="/intership/details/:id" element={<InternshipDetails/>}/>
        <Route path="/internship/apply/:id" element={<Internapply/>}/>
        <Route path="/user/details/:id/:internid" element={<UserProfileForHR/>}/>
        <Route path="/edit/:internid" element={<Editinternship/>}/>
        <Route path="/seementor" element={<Seementor/>}/>
        <Route path="/chat/:userId/:mentorId" element={<Usermentorchat/>}/>
        <Route path="/chatvideo/:userId/:mentorId" element={<MentorUserChat/>}/>
        <Route path="/schedule" element={<Scheduletime/>}/>
        <Route path="/interview/:uhid" element={<Scheduletime/>}/>
      </Routes>
    </Router>
  );
}

export default App1;
