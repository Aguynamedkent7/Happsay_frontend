import React, { useState } from "react";
import "@/styles/SignupPage.css";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useSignup } from "@/services/useMutation"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Toast from "@/components/ui/ToastContainer";

const InputField: React.FC<{ 
  type: string; 
  name: string;  
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordToggle?: boolean;
}> = ({ type, name, placeholder, value, onChange, showPasswordToggle = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-container">
      <input
        className="signup-input-field"
        type={showPasswordToggle && showPassword ? "text" : type}
        name={name}  
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {showPasswordToggle && (
        <button 
          type="button" 
          className="toggle" 
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
  const navigate = useNavigate();
  const { mutate: signup } = useSignup();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });



  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const errorMessagesMap: Record<string, string> = {
  username: "Username",
  password: "Password",
  email: "Email",
  confirmPassword: "Confirm Password", 
};

const handleSignup = (e: React.FormEvent) => {
  e.preventDefault();

  const errors: string[] = [];

  // 🔹 Check for empty fields
  Object.entries(formData).forEach(([key, value]) => {
    if (!value) {
      const friendlyKey = errorMessagesMap[key] || key;
      errors.push(`${friendlyKey} is required.`);
    }
  });

  // 🔹 Check for valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    errors.push("Email must be a valid email address.");
  }

  // 🔹 Check if passwords match
  if (formData.password !== formData.confirmPassword) {
    errors.push(`${errorMessagesMap.confirmPassword}: Passwords do not match.`);
  }

  // ❌ Show all errors and stop form submission
  if (errors.length > 0) {
    errors.forEach((error) => toast.error(error)); // Now all errors show
    return;
  }

  // ✅ Proceed with signup request
  signup(formData, {
    onSuccess: (response) => {
      const msg_key = Object.keys(response.data)[0];
      toast.success(response.data[msg_key]);
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (error: any) => {
      Object.entries(error.response.data).forEach(([key, message]) => {
        const friendlyKey = errorMessagesMap[key] || key;
        const errorMessage = Array.isArray(message) ? message.join(", ") : message;
        toast.error(`${friendlyKey}: ${errorMessage}`);
      });
    },
  });
};

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src="/static/images/Happsay Logo.webp" alt="App Logo" className="logo" />
        <h2 className="title">Happsay: Plan your life</h2>
        <p className="start">Start creating planned lists today!</p>
        <form onSubmit={handleSignup}>
          <InputField type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <InputField type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
          <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} showPasswordToggle />
          <InputField type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} showPasswordToggle />
          <Link to="/login" className="tet">Already have an account?</Link>
          <Button text="Sign Up" type="submit" />
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default SignupPage;
