import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Login = function () {
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");

  let handleSubmit = (e) => {
    e.preventDefault();
    let form = { email, password };

    axios
      .post(`http://localhost:8000/app/${role.toLowerCase()}/login`, form, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        navigate(`/${role.toLowerCase()}/dashboard`);
      })
      .catch((err) => {
        toast.error(err.response?.data.message);
      });
  };

  return (
    <div className="login-container" >
      <form className="login-box" onSubmit={handleSubmit} style={{width:"100%"}}>
        <h2>Login</h2>
        <input
          required
          type="text"
          name="email"
          placeholder="Enter your email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Enter your password here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          required
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">--Choose role--</option>
          <option value="User">User</option>
          <option value="Mentor">Mentor</option>
          <option value="HR">HR</option>
        </select>
        <button type="submit">Login</button>

        <button
          type="button"
          className="forgot-btn"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button>
        <button
          type="button"
          className="register-btn"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>
      </form>
    </div>
  );
};
