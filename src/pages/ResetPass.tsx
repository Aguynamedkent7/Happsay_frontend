import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@/styles/ResetPass.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useResetPassword } from "@/services/useMutation"; 
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const ResetPass = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use the TanStack Query mutation
  const { mutate: resetPassword } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center", autoClose: 2000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: false, progress: undefined, theme: "light", closeButton: false, transition: Bounce }
      );
      return;
    }


    if (!token) {
      toast.error("Invalid reset password token!", { position: "top-center", autoClose: 2000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: false, progress: undefined, theme: "light", closeButton: false, transition: Bounce }
      );
      return;
    }

    resetPassword(
      { token, password: newPassword, confirm_password: confirmPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successful! Redirecting to login page...",  { position: "top-center", autoClose: 2000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: false, progress: undefined, theme: "light", closeButton: false, transition: Bounce }
          );
          setTimeout(() => navigate("/login"), 1000);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Password reset failed." ,{ position: "top-center", autoClose: 2000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: false, progress: undefined, theme: "light", closeButton: false, transition: Bounce }
          );
        }
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

          

          <button type="submit" >
            Reset
          </button>

        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPass;
