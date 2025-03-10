import { useState } from "react";
import "@/styles/ForgotPass.css";
import { Link } from "react-router-dom";
import { usePasswordReset } from "@/services/useAuth"; // Import API function
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  const { mutate, isSuccess, isPending, error } = usePasswordReset()
  
  const handleForgotPass = async(email: string) => {
      mutate(email);
      navigate("/");
  };
  return (
    <div className="forget-password-container">
      <div className="logo"></div>
      <h2>Happsay: Plan your life</h2>

      <div className="form-box">
        <p className="enter">
          Enter your account email to send a password reset request form.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleForgotPass(email);
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isSuccess || isPending}>
            {isPending ? "Sending..." : isSuccess ? "Already Sent" : "Send Reset Request"}
          </button>
          {isSuccess && <p className="success-message">Password reset email sent!</p>}
          {error && <p className="error-message">{(error as Error).message}</p>}
          <Link to="/login" className="info">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
