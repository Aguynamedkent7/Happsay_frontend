import { IUserData } from "@/interfaces/interfaces";
import api from "@/middleware/api";

export const getUser = async (id: number) => {
    try {
        const res = await api.get(`users/${id}/`);
        console.log(res.data);
        const data = res.data
        const user: IUserData = {
            user_id: data.user_id,
            username: data.username,
            email: data.email
        }
        return user;
    } catch (error) {
        throw error;
    }
}