import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@/styles/ResetPass.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useResetPassword } from "@/services/useMutation"; 

const ResetPass = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use the TanStack Query mutation
  const { mutate: resetPassword,  isError, error, isSuccess, data } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    if (!token) {
      alert("Invalid password reset token.");
      return;
    }

    resetPassword(
      { token, password: newPassword, password2: confirmPassword },
      {
        onSuccess: () => {
          setTimeout(() => navigate("/login"), 1000);
        },
      }
    );
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

          {isError && <p className="message error">{error?.message || "Password reset failed."}</p>}
          {isSuccess && <p className="message success">{data?.message}</p>}

          <button type="submit" >
            
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
