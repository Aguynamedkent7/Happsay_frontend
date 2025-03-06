import React, { useState } from "react";
import "@/styles/SignupPage.css";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "@/services/Signup_api";

const InputField: React.FC<{ 
  type: string; 
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
}> = ({ type, placeholder, value, onChange, showPasswordToggle = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-container">
      <input
        className="signup-input-field"
        type={showPasswordToggle && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {showPasswordToggle && (
        <button 
          type="button" 
          className="toggle-password" 
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

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
    try {
      const data = await signup(username, email, password, confirmPassword);
      const msg_key = Object.keys(data)[0];
      const msg = data[msg_key];
      console.log("Signup successful:", msg);
      setMessage(`${msg} Redirecting to login...`);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Signup failed", error);
      const firstErrorKey = Object.keys(error)[0];
      setMessage(error[firstErrorKey] || "Failed to sign up. Please try again.");
    }
  };
  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src="/static/images/Happsay Logo.webp" alt="App Logo" className="logo" />
        <h2 className="title">Happsay: Plan your life</h2>
        <p className="start">Start creating planned lists today!</p>
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
        <InputField type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} showPasswordToggle />
        <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} showPasswordToggle />

          <Link to="/login" className="tet">Already have an account?</Link>
          <Button text="Sign Up" type="submit" />
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default SignupPage;
