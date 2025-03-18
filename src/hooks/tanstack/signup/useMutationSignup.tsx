import showToast from "@/components/ui/showToast";
import { IUserData } from "@/interfaces/interfaces";
import { registerUser } from "@/services/signup/signupApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useMutationSignup = () => {
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
