import { IResetPass } from "@/interfaces/interfaces";
import { useResetPassword } from "@/services/forgetpassword/resetpasswordApi";
import { useMutation} from "@tanstack/react-query"
import { toast } from "react-toastify";

export const useMutationResetForgottenPassword = () => {

  const useMutationResetPassword = () => {
    return useMutation({
      mutationFn: async (data: IResetPass) => useResetPassword(data),
      onSuccess: () => {
        toast.success("Password reset successful! Redirecting to login page...");
      }, 
      onError: (error: any) => {
        if (error.response.status === 400) {
          toast.error("Invalid reset password token!");
        }
        else {
          toast.error("Unexpected error occurred.");
        }
      }
    });
  }
      
  return {
    useMutationResetPassword
  }
}

