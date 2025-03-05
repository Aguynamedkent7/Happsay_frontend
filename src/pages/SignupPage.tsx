import React, { useState } from "react";
import "@/styles/SignupPage.css";
import { Link, useNavigate } from "react-router-dom";

const InputField: React.FC<{ type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ type, placeholder, value, onChange }) => (
  <input className="signup-input-field" type={type} placeholder={placeholder} value={value} onChange={onChange} />
);

const Button: React.FC<{ text: string; type?: "button" | "submit" | "reset" }> = ({ text, type = "button" }) => (
  <button className="signup-button" type={type}>{text}</button>
);

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const response = await fetch("https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/register/", {
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
      const msg_key = Object.keys(data)[0];
      const msg = data[msg_key];
      console.log("Signup successful:", msg);
      setMessage(`${msg} Redirecting to login...`);
      setTimeout(() => {
        navigate("/");
      }, 2000); // Redirect after 2 seconds
    } else {
      const error = await response.json();
      console.error("Signup failed", error);
      const firstErrorKey = Object.keys(error)[0];
      const errorMessage = error[firstErrorKey] || "Failed to sign up. Please try again.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src="src/public/static/images/Happsay Logo.png" alt="App Logo" className="logo" />
        <h2 className="title">Happsay: Plan your life</h2>
        <p className="start">Start creating planned lists today!</p>
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <InputField type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Link to="/" className="tet">Already have an account?</Link>
          <Button text="Sign Up" type="submit" />
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default SignupPage;
