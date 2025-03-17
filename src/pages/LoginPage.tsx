import React, { useState } from "react";
import "@/styles/LoginPage.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Toast from "@/components/ui/ToastContainer";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import useMutationAuth from "@/hooks/tanstack/auth/useMutationAuth";
import { IUserData } from "@/interfaces/interfaces";

const InputField: React.FC<{ 
  type: string; 
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
}> = ({ type, placeholder, value, onChange, showPasswordToggle = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-container2">
      <input
        className="signup-input-field2"
        type={showPasswordToggle && showPassword ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {showPasswordToggle && (
        <button 
          type="button" 
          className="toggle-password2" 
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

const Button: React.FC<{ text: string; type?: "button" | "submit" | "reset" }> = ({ text, type = "button" }) => (
  <button className="login-button" type={type}>{text}</button>
);

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const {useMutationLogin} = useMutationAuth();
  const {mutate: loginUser, isPending} = useMutationLogin();

  const handleLogin = (data: IUserData) => {
    loginUser(data);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/static/images/Happsay Logo.webp" alt="App Logo" className="logo" />
        <h2 className="title">Happsay: Plan your life</h2>
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleLogin({ username, password });
          }}
        >
          <InputField type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} showPasswordToggle />
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          <Button text={isPending ? "Logging in..." : "Log In"} type="submit" />
        </form>
        <p className="signup-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
      <Toast />
    </div>
  );
};

export default LoginPage;
