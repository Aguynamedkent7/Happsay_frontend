import React, { useState } from "react";
import "@/styles/SignupPage.css";

const InputField: React.FC<{ type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ type, placeholder, value, onChange }) => (
  <input className="signup-input-field" type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

const Button: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
  <button className="signup-button" onClick={onClick}>{text}</button>
);

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  
  const handleSignup = async () => {
    const response = await fetch("https://your-api-endpoint.com/Signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Signup successful:", data);
      // Handle successful Signup (e.g., redirect to another page)
    } else {
      console.error("Signup failed");
      // Handle Signup failure (e.g., show an error message)
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src="src/assets/Happsay Logo.png" alt="App Logo" className="logo" />
        <h2 className="title">Happsay: Plan your life</h2>
        <p className="start">Start creating planned lists today!</p>
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
            <InputField type="text" placeholder="Email" value={username} onChange={(e) => setEmail(e.target.value)} />
          <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputField type="password" placeholder="Confirm Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <a href="#" className="forgot-password">Already have an account?</a>
          <Button text="Sign Up" onClick={handleSignup} />
        </form>
      </div>
    </div>
  );
};

export default SignupPage;