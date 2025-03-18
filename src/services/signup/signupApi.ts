import { IUserData } from "@/interfaces/interfaces";
import api from "@/middleware/api";

export const registerUser = (data: IUserData) => {
    try {
        const response = api.post(`register/`, data);
        return response;
    } catch (error) {
        throw error;
    }
}