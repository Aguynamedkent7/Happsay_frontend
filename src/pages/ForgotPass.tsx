import { useState } from "react";
import "@/styles/ForgotPass.css";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="forget-password-container">
        <div className="logo"></div>
        <h2>Happsay: Plan your life</h2>
        
      <div className="form-box">
        <p className="enter">Enter your account email to send a password reset request form.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <button type="submit" disabled={isSent}>
            {isSent ? "Already Sent" : "Send Reset Request"}
          </button>
          <p className="info">Back to login</p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
