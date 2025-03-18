import showToast from "@/components/ui/showToast";
import { IUserData } from "@/interfaces/interfaces";
import { updateUserProfile } from "@/services/updateprofile/updateprofileApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: IUserData) => updateUserProfile(data),
      onSuccess: (res) => {
        console.log(res);
        toast.success("User information updated successfully");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // Refresh user data
      },
      onError: () => {
        showToast("Failed to update user information", "error");
      }
    });
  };