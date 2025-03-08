import { useMutation } from "@tanstack/react-query";
import api from "@/middleware/api";

interface IResetPass {
  token: string;
  password: string;
  password2: string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: IResetPass) => {
      const response = await api.post(`/reset-password/${data.token}/`, data);
      return response.data;
    },
  });
};
