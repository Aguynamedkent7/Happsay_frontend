import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../middleware/api";
import { IResetPass, IUserData } from "@/interfaces/interfaces";

  
  export const useResetPassword = () => {
    return useMutation({
      mutationFn: async (data: IResetPass) => {
        const response = await api.post(`/reset-password/${data.token}/`, data);
        return response.data;
      },
    });
  };
  

  export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ userId, updatedData }: { userId: number; updatedData: IUserData }) => {
        const response = await api.patch(`/users/${userId}/`, updatedData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // Refresh user data
      },
    });
  };

  export const useSignup = () => {
  
    return useMutation({
      mutationFn: async ({ username, email, password, confirmPassword }: IUserData) => {
        const response = await api.post(`register/`, {
          username,
          email,
          password,
          confirm_password: confirmPassword,
        });
        return response;
        
      },
    });
  };
  
  