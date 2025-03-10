import React, { useState } from "react";
import "@/styles/SignupPage.css";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useSignup } from "@/services/useMutation"; // Updated import

const InputField: React.FC<{ 
  type: string; 
  name: string;  // Added name prop
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
        name={name}  // Added this line
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

  const [message, setMessage] = useState("");

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle signup submission
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    signup(formData, {
      onSuccess: (response) => {
        const msg_key = Object.keys(response)[0];
        setMessage(`${response.data[msg_key]} Redirecting to login...`);
        setTimeout(() => navigate("/login"), 2000);
      },
      onError: (error: any) => {
        const firstErrorKey = Object.keys(error.response.data)[0];
        setMessage(error.response.data[firstErrorKey] || "Signup failed. Please try again.");
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
        <form onSubmit={handleSignup}>
  <InputField type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
  <InputField type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
  <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} showPasswordToggle />
  <InputField type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} showPasswordToggle />
</form>


          <Link to="/login" className="tet">Already have an account?</Link>
          <Button text="Sign Up" type="submit" />
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default SignupPage;
