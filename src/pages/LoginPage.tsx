import React, { useState } from "react";
import "@/styles/LoginPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/services/useAuth";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

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

  const { mutate, isPending } = useLogin();

  const handleLogin = ({ username, password }: { username: string; password: string }) => {
    mutate(
      { username, password },
      {
        onSuccess: () => {
          toast.success("Login successful! 🎉");
        },
        onError: (error: Error) => {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
              toast.error("Invalid username or password!", {position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "light",
                closeButton: false, 
                transition: Bounce,});
            } else {
              toast.error("Something went wrong. Please try again.");
            }
          } else {
            toast.error("An unexpected error occurred.");
          }
        },
      }
    );
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
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;
