import { useState } from "react";
import "@/styles/ForgotPass.css";
import { Link } from "react-router-dom";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim()  }),
      });

      

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
        setIsSent(true);
        
      } 
      else if (response.status === 400) {
        console.error("Signup failed: No account with email found");
        
        setMessage("No user is associated with this email address.");
      }
    } catch (err) {
      setError("Network error");
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
          <Link to="/" className="info">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
