import axios from "axios";

const API_URL = "https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com";

export const sendPasswordResetRequest = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/password-reset/`, { email: email.trim() });
    return response.data; // Returns success message
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "No user is associated with this email address.");
    } else {
      throw new Error("Network error");
    }
  }
};
