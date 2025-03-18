import showToast from "@/components/ui/showToast";
import { IResetPass, IUserData } from "@/interfaces/interfaces"
import { loginUser } from "@/services/auth/authApi";
import { useForgotPasswordReset } from "@/services/forgetpassword/forgetpasswordresetApi";
import { useResetPassword } from "@/services/forgetpassword/resetpasswordApi";
import { registerUser } from "@/services/signup/signupApi";
import { useMutation } from "@tanstack/react-query"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useMutationAuth = () => {
    
    const useMutationLogin = () => {
        const [isPending, setIsPending] = useState(false);
        const navigate = useNavigate();
        
        const mutation = useMutation({
            mutationFn: async ( data: IUserData ) => {
                setIsPending(true);
                return loginUser(data)
            },
            onSuccess: (res) => {
                if (res?.status === 200) {
                    const data = res?.data;
                    localStorage.setItem("userId", data.user.id);
                    localStorage.setItem("username", data.user.username);
                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("refresh_token", data.refresh);
                    navigate("/");

                    setTimeout(() => {
                        toast.success("Login successful!");
                    }, 10);
                }

              },
            onError: (err: any) => {
                 const statusCode = err.response?.status;
                 if (statusCode === 400) {
                     showToast("Invalid username or password", "invalid_credentials");
                 } else {
                     showToast("An unexpected error occurred. Please try again.", "unexpected_err");
                     console.log(err);
                 }
              },
            onSettled: () => {
                setIsPending(false);
              },
            });

        return {...mutation, isPending};
    }

    const useMutationForgetPasswordReset = () => {
        return useMutation ({
            mutationFn: async (email: string) => useForgotPasswordReset(email),
            onSuccess: () => {
                toast.success("Password reset link sent to your email!", {autoClose: 3000})
            }, 
            onError: () => {
                showToast("No user is associated with this email address.", "error")
                console.error(Error)
            }
        })
    }

    const useMutationResetPassword = () => {
        return useMutation({
          mutationFn: async (data: IResetPass) => useResetPassword(data),
          onSuccess: () => {
            toast.success("Password reset successful! Redirecting to login page...");
          }, 
          onError: (error: any) => {
            if (error.response.status === 400) {
              showToast("Invalid reset password token!", "invalid_token");
            }
            else {
              showToast("Unexpected error occurred.", "error");
            }
          }
        });
      }

    const useMutationSignup = () => {
        return useMutation({
              mutationFn: async (data: IUserData) => registerUser(data),
              onSuccess: () => {
                toast.success("Registered successfully!");
              },
              onError: () => {
                showToast("Failed to register", "error");
              }
            });
    };

    return { 
        useMutationLogin,
        useMutationForgetPasswordReset,
        useMutationResetPassword,
        useMutationSignup
     }
}

export default useMutationAuth;