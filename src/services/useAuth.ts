import api from "../middleware/api";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";





export type Todo = { id: number; title: string; content: string; is_done: boolean; is_archived: boolean; deadline: string };
export type NotesState = { ToDo: Todo[]; Done: Todo[]; Archive: Todo[] };



// ✅ Logout Function
export const useLogout = async (navigate: ReturnType<typeof useNavigate>) => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      await api.post("/logout/", { refresh_token });
      localStorage.clear();
      navigate("/login");
    } catch (error: any) {
      console.error("Logout failed:", error.response ? error.response.data : error.message);
    }
  };

  
  
  export const useLogin = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const Navigate = useNavigate();
  
    const mutation = useMutation({
      mutationFn: async ({ username, password }: { username: string; password: string }) => {
        setIsPending(true);
        setError(null);
        try {
            const response = await api.post("/login/", { username, password });
            return response.data;
          } catch (err: any) {
            setError(err.response ? err.response.data : err.message);
            throw err;
          } finally {
            setIsPending(false);
          }
        },
        onSuccess: (data) => {
          console.log("Login successful:", data);
          localStorage.setItem("userId", String(data.user.id));
          localStorage.setItem("username", data.user.username);
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          localStorage.setItem("email", data.user.email);
          Navigate("/")
        },
      });
    
      return { ...mutation, isPending, error };
    };

    export const usePasswordReset = () => {
        return useMutation({
          mutationFn: async (email: string) => {
            try {
              const response = await api.post(`password-reset/`, { email: email.trim() });
              return response.data; // Returns success message
            } catch (error: any) {
              throw new Error(error.response?.data?.message || "No user is associated with this email address.");
            }
          },
        });
      };