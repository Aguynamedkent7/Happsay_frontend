import api from "@/services/api";

interface IResetPass {
  password: string;
  password2: string;
}

export const resetPassword = async (token: string, password: string, password2: string) => {
  try {
    await api.post(`/reset-password/${token}/`, { password, password2 });
    return { success: true, message: "Password reset successful! You can now log in." };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || "Failed to reset password.",
    };
  }
};

export const resetLng = async (data: IResetPass) => {
  try {
    const res = api.post('/api', data)
  } catch (error) {
    throw error
  }
}
