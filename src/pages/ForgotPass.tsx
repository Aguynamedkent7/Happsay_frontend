import { useState } from "react";
import "@/styles/ForgotPass.css";
import { Link } from "react-router-dom";
import { sendPasswordResetRequest } from "@/services/forgotpass_api"; // Import API function

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await sendPasswordResetRequest(email);
      setMessage(data.message);
      setError("");
      setIsSent(true);
    } catch (err: any) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="forget-password-container">
      <div className="logo"></div>
      <h2>Happsay: Plan your life</h2>

      <div className="form-box">
        <p className="enter">
          Enter your account email to send a password reset request form.
        </p>
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
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <Link to="/login" className="info">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
