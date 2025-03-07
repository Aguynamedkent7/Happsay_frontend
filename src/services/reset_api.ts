import api from "@/middleware/api";

interface IResetPass {
  token: string;
  password: string;
  password2: string;
}

export const resetPassword = async (data: IResetPass) => {
  try {
    await api.post(`/reset-password/${data.token}/`, { data });
    return { success: true, message: "Password reset successful! You can now log in." };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || "Failed to reset password.",
    };
  }
};

