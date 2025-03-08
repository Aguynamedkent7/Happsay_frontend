import { useState } from "react";
import "@/styles/ForgotPass.css";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetRequest } from "@/services/forgotpass_api"; // Import API function

const ForgotPass = () => {
  const [email, setEmail] = useState("");

  const { mutate, isSuccess, isPending, error } = useMutation({
    mutationFn: sendPasswordResetRequest,
  });

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
            mutate(email);
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
