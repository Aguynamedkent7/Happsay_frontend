import { IResetPass } from "@/interfaces/interfaces";
import api from "@/middleware/api";

export const useResetPassword = (data: IResetPass) => {
    try {
        const res = api.post(`/reset-password/${data.token}/`, data);
        return res;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Password reset failed.");
    }
  }