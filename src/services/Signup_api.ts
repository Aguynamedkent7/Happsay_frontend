import axios from "axios";

const API_URL = "https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com";

export const signup = async (username: string, email: string, password: string, confirmPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, {
      username,
      email,
      password,
      password2: confirmPassword,
    });

    return response.data; // Return success message or data
  } catch (error: any) {
    throw error.response?.data || { error: "Signup failed. Please try again." };
  }
};
