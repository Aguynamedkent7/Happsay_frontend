import { toast } from "react-toastify";

const showToast = (message: string, id: string) => {
  if (!toast.isActive(id)) {
    toast.error(message, { toastId: id }); // Prevent duplicate notifications
  }
};

export default showToast;