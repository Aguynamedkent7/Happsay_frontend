import React, { useState } from "react";
import "@/styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { AxiosError } from "axios";

const InputField: React.FC<{ type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ type, placeholder, value, onChange }) => (
  <input className="input-field" type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

const Button: React.FC<{ text: string; type?: "button" | "submit" | "reset" }> = ({ text, type = "button" }) => (
  <button className="login-button" type={type}>{text}</button>
);

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    /*const response = await fetch("https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });*/

    try {
      const response = await api.post("/login/", { 
        username, 
        password 
      });
      const data = response.data;
      console.log("Login successful:", data);
      
      // Step 1: Store access and refresh tokens in local storage
      localStorage.setItem("userId", String(data.user.id))
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("email", data.user.email);
      
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError && err.response && err.response.status === 400) {
        // Handle 400 Bad Request error
        setMessage('Invalid username or password');
      } else {
        // Handle other errors
        setMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/static/images/Happsay Logo.png" alt="App Logo" className="logo" />
        <h2 className="title">Happsay: Plan your life</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          <Button text="Log In" type="submit" />
        </form>
        {message && <p className="message">{message}</p>}
        <p className="signup-text">
        Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
