import { useState } from "react";
import "@/styles/ForgotPass.css";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Import styles
import { useMutationForgetPassword } from "@/hooks/tanstack/forgetpassword/useMutationForgetPassword";
import Toast from "@/components/ui/ToastContainer";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { useMutationForgetPasswordReset } = useMutationForgetPassword();
  const { mutate: ForgotPass, isSuccess, isPending } = useMutationForgetPasswordReset();
  
  const handleForgotPass = async (email: string) => {
    ForgotPass(email, { 
      onSuccess: () => {
        console.log("Password Reset Link sent!")
        setTimeout(() => navigate('/'), 3000)
      }
    });
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
          
          <Link to="/login" className="info">
            Back to Login
          </Link>
        </form>
        <Toast/>
      </div>
    </div>
  );
};

export default ForgotPass;
