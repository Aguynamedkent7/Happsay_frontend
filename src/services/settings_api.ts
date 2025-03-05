import api from "@/services/api";

export const updateUserProfile = async (
  userId: number,
  updatedData: { username: string; email: string; password?: string; password2?: string },
  token: string
) => {
  try {
    const response = await api.patch(`/users/${userId}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
