import React, { useState } from "react";
import "@/styles/SignupPage.css";
import { Link } from "react-router-dom";

const InputField: React.FC<{ type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ type, placeholder, value, onChange }) => (
  <input className="signup-input-field" type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

const Button: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
  <button className="signup-button" onClick={onClick}>{text}</button>
);

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    const response = await fetch("http://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        password2: confirmPassword,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Signup successful:", data);
      // Handle successful signup (e.g., redirect to login)
    } else {
      console.error("Signup failed");
      // Handle signup failure (e.g., show an error message)
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src="src/assets/Happsay Logo.png" alt="App Logo" className="logo" />
        <h2 className="title">Happsay: Plan your life</h2>
        <p className="start">Start creating planned lists today!</p>
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <InputField type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Link to="/">Already have an account?</Link>
          <Button text="Sign Up" onClick={handleSignup} />
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
