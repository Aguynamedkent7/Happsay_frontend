import "@/styles/Settings.css";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SettingsPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="settings-container">
      <div className="profile-section">
        <div className="file-input-container">
          <span>Change Profile Picture:</span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
        </div>
        <div className="profile-picture-container">
          {image ? (
            <img src={image} alt="Profile" className="profile-picture" />
          ) : (
            <span className="default-avatar">?</span>
          )}
        </div>
      </div>
      <p className="change-password">Change Password</p>
      <div className="password-section">
        {[{ label: "Old Password", value: oldPassword, setter: setOldPassword },
          { label: "New Password", value: newPassword, setter: setNewPassword },
          { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword }]
          .map(({ label, value, setter }, index) => (
            <div className="input-group" key={index}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={label}
                value={value}
                onChange={(e) => setter(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          ))}
        <button className="confirm-button">Confirm</button>
      </div>
    </div>
  );
};

export default SettingsPage;
