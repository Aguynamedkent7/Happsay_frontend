import "@/styles/Settings.css";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "@/services/settings_api";
import { AxiosError } from "axios";

const SettingsPage: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [existingData, setExistingData] = useState<{ username: string; email: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUserId) setUserId(parseInt(storedUserId, 10));
    if (storedUsername && storedEmail) {
      setUsername(storedUsername);
      setEmail(storedEmail);
      setExistingData({ username: storedUsername, email: storedEmail });
    }
  }, []);

  const handleSaveChanges = async () => {
    if (!userId) {
      setMessage("User ID not found. Please log in again.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("Authorization token missing. Please log in.");
      return;
    }

    const updatedData = {
      username: username.trim() || existingData?.username || "",
      email: email.trim() || existingData?.email || "",
      password: password.trim(),
      password2: password2.trim(),
    };

    try {
      await updateUserProfile(userId, updatedData, token);
      setMessage("Profile updated successfully!");
      localStorage.setItem("username", updatedData.username);
      localStorage.setItem("email", updatedData.email);
    } catch (error) {
      console.error("Profile Update Error:", error);
      if (error instanceof AxiosError && error.response) {
        setMessage(`Error: ${error.response.status} - ${error.response.data}`);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <div className="settings-container">
        <p className="change-password">Update Account</p>
        <div className="settings-section">
          <div className="input-group">
            <input type="text" placeholder="New Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <input type="email" placeholder="New Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {[{ label: "New Password", value: password, setter: setPassword },
            { label: "Confirm New Password", value: password2, setter: setPassword2 }
          ].map(({ label, value, setter }, index) => (
            <div className="input-group" key={index}>
              <input type={showPassword ? "text" : "password"} placeholder={label} value={value} onChange={(e) => setter(e.target.value)} />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          ))}

          <button className="confirm-button" onClick={handleSaveChanges}>Save Changes</button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;
