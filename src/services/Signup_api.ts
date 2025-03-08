import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com";

interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useSignup = () => {
  
  return useMutation({
    mutationFn: async ({ username, email, password, confirmPassword }: SignupData) => {
      const response = await axios.post(`${API_URL}/register/`, {
        username,
        email,
        password,
        password2: confirmPassword,
      });
      return response.data;
    },
  });
};
