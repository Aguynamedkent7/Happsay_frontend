import { useForgotPasswordReset } from "@/services/forgetpassword/forgetpasswordresetApi";
import { useMutation} from "@tanstack/react-query"

import { toast } from "react-toastify"

export const useMutationForgetPassword = () => {

    const useMutationForgetPasswordReset = () => {
        return useMutation ({
            mutationFn: async (email: string) => useForgotPasswordReset(email),
            onSuccess: () => {
                toast.success("Password reset link sent to your email!", {autoClose: 3000})
            }, 
            onError: () => {
                toast.error("No user is associated with this email address.")
                console.error(Error)
            }
        })
    }
    return {
        useMutationForgetPasswordReset
    }
}