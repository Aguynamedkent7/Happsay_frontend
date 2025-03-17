import { IResetPass } from "@/interfaces/interfaces";
import { useResetPassword } from "@/services/forgetpassword/resetpasswordApi";
import { useMutation} from "@tanstack/react-query"
import { toast } from "react-toastify";

export const useMutationResetForgottenPassword = () => {

  const useMutationResetPassword = () => {
    return useMutation({
      mutationFn: async (data: IResetPass) => useResetPassword(data),
      onSuccess: () => {
        toast.success("Password reset successful")
      }, onError: () => {
        toast.error("Password reset failed.")
      }
    });
  }
      
  return {
    useMutationResetPassword
  }
}

