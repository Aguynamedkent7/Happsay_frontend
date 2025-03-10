import "@/styles/Settings.css";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUpdateUserProfile } from "@/services/settings_api";
import { useQuery } from "@tanstack/react-query";
import api from "@/middleware/api";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [message, setMessage] = useState("");

  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  // Fetch user data
  const { data: user, isLoading: isFetching } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await api.get(`/users/${userId}/`);
      return res.data;
    },
    enabled: !!userId, // Only fetch if userId exists
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        password2: "",
      });
    }
  }, [user]);

  // Update user profile mutation
  const { mutate: updateUserProfile,  isError, error, isSuccess } = useUpdateUserProfile();

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated profile
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User ID not found. Please log in again.");
      
      return;
    }

    if (formData.password && formData.password !== formData.password2) {
      setMessage("Passwords do not match.");
      console.log(message);
      return;
    }

    updateUserProfile({ userId, updatedData: formData });
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="settings-container">
        <p className="change-password">Update Account</p>
        
        {isFetching ? <p>Loading user data...</p> : null}

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
                name="password2"
                placeholder="Confirm New Password"
                value={formData.password2}
                onChange={handleChange}
              />
              <button type="button" className="toggle-password4" onClick={() => setShowPassword2(!showPassword2)}>
                {showPassword2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {isError && <p className="message error">{(error as any)?.message || "Update failed."}</p>}
            {isSuccess && <p className="message success">Profile updated successfully!</p>}

            <button className="confirm-button" type="submit" >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
