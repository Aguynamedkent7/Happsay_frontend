import React, { useState } from "react";
import "@/styles/SignupPage.css";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import useMutationAuth from "@/hooks/tanstack/auth/useMutationAuth";
import "react-toastify/dist/ReactToastify.css"; 
import Toast from "@/components/ui/ToastContainer";
import showToast from "@/components/ui/showToast";

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


const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  
  const {useMutationSignup} = useMutationAuth();
  const { mutate: signup, isPending } = useMutationSignup();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
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
  confirm_password: "Confirm Password", 
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
  if (formData.password !== formData.confirm_password) {
    errors.push(`Passwords do not match.`);
  }

  // ❌ Show all errors and stop form submission
  if (errors.length > 0) {
    errors.forEach((error) => showToast(error, "error")); // Now all errors show
    return;
  }

  // ✅ Proceed with signup request
  signup(formData, {
    onSuccess: (response) => {
      const msg_key = Object.keys(response.data)[0];
      console.log(response.data[msg_key]);
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (error: any) => {
      Object.entries(error.response.data).forEach(([key, message]) => {
        const friendlyKey = errorMessagesMap[key] || key;
        const errorMessage = Array.isArray(message) ? message.join(", ") : message;
        console.log(`${friendlyKey}: ${errorMessage}`);
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
          <InputField type="password" name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} showPasswordToggle />
          <Link to="/login" className="tet">Already have an account?</Link>
          <button type="submit" disabled={isPending}>
            {isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default SignupPage;
