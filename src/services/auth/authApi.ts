import { IUserData } from "@/interfaces/interfaces";
import api from "@/middleware/api";
import { useNavigate } from "react-router-dom";


export const loginUser = async (data: IUserData) => {
    try {
        const response = await api.post("/login/", data);
        return response;
    } catch (err) {
        throw err;
    }
};

export const useLogout = async (navigate: ReturnType<typeof useNavigate>) => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      await api.post("/logout/", { refresh_token });
      localStorage.clear();
      navigate("/login");

    } catch (error: any) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
      throw error;
    }
  };