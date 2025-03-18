import showToast from "@/components/ui/showToast";
import { IUserData } from "@/interfaces/interfaces"
import { loginUser } from "@/services/auth/authApi";
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
                    localStorage.setItem("userId", data.user.id)
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

    return { useMutationLogin }
}

export default useMutationAuth;