import { useState } from "react";
import "@/styles/ForgotPass.css";
import { Link } from "react-router-dom";
import { usePasswordReset } from "@/services/useAuth"; // Import API function
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  const { mutate, isSuccess, isPending } = usePasswordReset()
  
  const handleForgotPass = async (email: string) => {
    mutate(email, {
      onSuccess: () => {
        toast.success("Password reset link sent!", { position: "top-center", autoClose: 2000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: false, progress: undefined, theme: "light", closeButton: false, transition: Bounce }
        );
        setTimeout(() => navigate("/"), 1500);
        
      },
      onError: (error) => {
        toast.error(` ${error.message || "Something went wrong"}`, { position: "top-center", autoClose: 2000, hideProgressBar: true, closeOnClick: true, pauseOnHover: true, draggable: false, progress: undefined, theme: "light", closeButton: false, transition: Bounce }
        );
      },
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
        <ToastContainer/>
      </div>
    </div>
  );
};

export default ForgotPass;
