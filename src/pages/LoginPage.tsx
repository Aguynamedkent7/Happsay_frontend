import React, { useState } from "react";
import "@/styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const InputField: React.FC<{ type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ type, placeholder, value, onChange }) => (
  <input className="input-field" type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

const Button: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
  <button className="login-button" onClick={onClick}>{text}</button>
);

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    const response = await fetch("http://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
      
      // Step 1: Store access and refresh tokens in local storage
      localStorage.setItem("userId", String(data.user.id))
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("email", data.user.email);
      
      navigate("/Mainpage");
      // Handle successful login (e.g., redirect to another page)
    } else {
      console.error("Login failed");
      // Handle login failure (e.g., show an error message)
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="src/assets/Happsay Logo.png" alt="App Logo" className="logo" />
        <h2 className="title">Happsay: Plan your life</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          <Button text="Log In" onClick={handleLogin} />
        </form>
        <p className="signup-text">
        Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
