import api from "@/middleware/api";

interface IUpdatedData {
  username: string;
  email: string;
  password?: string;
  password2?: string;
}

export const updateUserProfile = async (
  userId: number,
  updatedData: IUpdatedData,

) => {
  try {
    const response = await api.patch(`/users/${userId}/`, updatedData,);
    return response.data;
  } catch (error) {
    throw error;
  }
};
