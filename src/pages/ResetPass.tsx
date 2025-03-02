import { useState } from "react";
import { useParams } from "react-router-dom";  // ✅ Import useParams
import "@/styles/ResetPass.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPass = () => {
  const { token } = useParams();  // ✅ Get token from URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

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
  
    try {
      const response = await fetch(`http://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/reset-password/${token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword, password2: confirmPassword }),
      });
  
      const text = await response.text(); // Log response for debugging
      
  
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        const data = JSON.parse(text);
        if (response.ok) {
          setMessage("Password reset successful! You can now log in.");
        } else {
          setMessage(data.error || "Failed to reset password.");
        }
      } else {
        setMessage("Unexpected response from server. Please try again later.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessage("Something went wrong. Please try again.");
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