import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/middleware/api";

interface IUpdatedData {
  username: string;
  email: string;
  password?: string;
  password2?: string;
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updatedData }: { userId: number; updatedData: IUpdatedData }) => {
      const response = await api.patch(`/users/${userId}/`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // Refresh user data
    },
  });
};
