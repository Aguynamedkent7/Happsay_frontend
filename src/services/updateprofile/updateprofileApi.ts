import { IUserData } from "@/interfaces/interfaces";
import api from "@/middleware/api";

export const updateUserProfile = async (data: IUserData) =>  {
    try {
        const response = await api.patch(`/users/${data.user_id}/`, data);
        return response.data;
    } catch (err) {
        throw err;
    }
}