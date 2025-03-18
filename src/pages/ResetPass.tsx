import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@/styles/ResetPass.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useMutationResetForgottenPassword } from "@/hooks/tanstack/forgetpassword/useMutationResetPassword";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import Toast from "@/components/ui/ToastContainer";
import showToast from "@/components/ui/showToast";

const ResetPass = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use the TanStack Query mutation
  const { useMutationResetPassword } = useMutationResetForgottenPassword();
  const { mutate: resetPassword } = useMutationResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!", "pwnomatch");
      return;
    }


    if (!token) {
      showToast("Invalid reset password token!", "error");
      return;
    }

    resetPassword(
      { token, password: newPassword, confirm_password: confirmPassword },
      {
        onSuccess: () => {
          setTimeout(() => navigate("/login"), 2000);
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

          

          <button type="submit" >
            Reset
          </button>

        </form>
        <Toast/>
      </div>
    </div>
  );
};

export default ResetPass;
