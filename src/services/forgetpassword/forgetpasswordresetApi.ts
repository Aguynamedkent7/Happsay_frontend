import api from "@/middleware/api";

export const useForgotPasswordReset = (email: string) => {
    try {
      const res = api.post(`password-reset/`, {email: email.trim()});
      return res;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "No user is associated with this email address.");
    }
  }