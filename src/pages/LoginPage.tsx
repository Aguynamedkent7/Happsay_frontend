import React, { useState } from "react";
import "src/styles/LoginPage.css";

const InputField: React.FC<{ type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ type, placeholder, value, onChange }) => (
  <input className="input-field" type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

const Button: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
  <button className="login-button" onClick={onClick}>{text}</button>
);

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("https://your-api-endpoint.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
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
          <a href="#" className="forgot-password">Forgot Password?</a>
          <Button text="Log In" onClick={handleLogin} />
        </form>
        <p className="signup-text">
          Don’t have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;