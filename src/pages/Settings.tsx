import "@/styles/Settings.css";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUpdateUserProfile } from "@/hooks/tanstack/updateprofile/useMutationUpdateUserProfile";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "@/components/ui/ToastContainer";
import { useGetUser } from "@/hooks/tanstack/getuser/useQueryGetUser";
import { IUserData } from "@/interfaces/interfaces";

const SettingsPage: React.FC = () => {
  const userId = Number(localStorage.getItem("userId"));
  const { data: user, isFetching } = useGetUser(userId);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IUserData>({
    user_id: user?.user_id,
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);



  useEffect(() => {
    if (user) {
      setFormData({
        user_id: userId,
        username: user.username || "",
        email: user.email || "",
        password: "",
        confirm_password: "",
      });
    }
  }, [user]);

  // Update user profile mutation
  const { mutate: updateUserProfile } = useUpdateUserProfile();

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    if (formData.password && formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    updateUserProfile(formData);
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="settings-container">
        <p className="change-password">Update Account</p>
        
        

        <form onSubmit={handleSaveChanges}>
          <div className="settings-section">
            <div className="input-group">
              <input type="text" name="username" placeholder="New Username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="input-group">
              <input type="email" name="email" placeholder="New Email" value={formData.email} onChange={handleChange} />
            </div>

            {/* New Password Input */}
            <div className="input-group">
              <input
                type={showPassword1 ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" className="toggle-password4" onClick={() => setShowPassword1(!showPassword1)}>
                {showPassword1 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="input-group">
              <input
                type={showPassword2 ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm New Password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
              <button type="button" className="toggle-password4" onClick={() => setShowPassword2(!showPassword2)}>
                {showPassword2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button className="confirm-button" type="submit">
            {isFetching ? <p>Loading user data...</p> : <p>Confirm</p>}
            </button>
          </div>
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default SettingsPage;
