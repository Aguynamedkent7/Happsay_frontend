import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../middleware/api";
import { IUserData } from "@/interfaces/interfaces";
  

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
  
  