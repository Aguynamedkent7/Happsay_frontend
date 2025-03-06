import { useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/ResetPass.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { resetPassword } from "@/services/reset_api"; 
import { useNavigate } from "react-router-dom";

const ResetPass = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
  
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      return;
    }
  
    if (!token) {
      setMessage("Invalid password reset token.");
      return;
    }
  
    const result = await resetPassword(token, newPassword, confirmPassword);
    setMessage(result.message);
  
    if (result.success) {
      setTimeout(() => {
        navigate("/login"); 
      }, 2000);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="logo"></div>
      <h2>Happsay: Plan your life</h2>

      <div className="form-box">
        <h3>Forgotten Password Reset Request Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <div className="input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {message && <p className="message">{message}</p>}

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
