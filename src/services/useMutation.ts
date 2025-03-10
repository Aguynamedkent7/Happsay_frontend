import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../middleware/api";
import { IResetPass, IUserData } from "@/interfaces/interfaces";




export type Todo = { id: number; title: string; content: string; is_done: boolean; is_archived: boolean; deadline: string };
export type NotesState = { ToDo: Todo[]; Done: Todo[]; Archive: Todo[] };

// ✅ Add Note Mutation
export const useAddNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ title, content, deadline }: { title: string; content: string; deadline: string }) => {
        const response = await api.post<Todo>("todolist/", { title, content, completed: false, deadline });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] }); // Refetch notes after adding
      },
    });
  };

  
// ✅ Update Note Title Mutation
export const useUpdateNoteTitle = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, newTitle }: { id: number; newTitle: string }) => {
        return api.patch(`todolist/${id}/`, { title: newTitle });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  };
  
  
// ✅ Update Note Content Mutation
export const useUpdateNoteContent = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, newContent }: { id: number; newContent: string }) => {
        return api.patch(`todolist/${id}/`, { content: newContent });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  };
  
  
// ✅ Delete Note Mutation
export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: number) => {
        await api.delete(`todolist/${id}/`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  };
  
  // ✅ Toggle Complete Mutation
export const useToggleComplete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, is_done }: { id: number; is_done: boolean }) => {
        await api.patch(`todolist/${id}/`, { is_done: !is_done });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  };
  
  // ✅ Toggle Archive Mutation
  export const useToggleArchive = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, is_archived }: { id: number; is_archived: boolean }) => {
        await api.patch(`todolist/${id}/`, { is_archived: !is_archived });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        console.log("Note archived/unarchived successfully.");
      },
    });
  };

  
  export const useResetPassword = () => {
    return useMutation({
      mutationFn: async (data: IResetPass) => {
        const response = await api.post(`/reset-password/${data.token}/`, data);
        return response.data;
      },
    });
  };
  

  export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ userId, updatedData }: { userId: number; updatedData: IUserData }) => {
        const response = await api.patch(`/users/${userId}/`, updatedData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // Refresh user data
      },
    });
  };

  export const useSignup = () => {
  
    return useMutation({
      mutationFn: async ({ username, email, password, confirmPassword }: IUserData) => {
        const response = await api.post(`register/`, {
          username,
          email,
          password,
          password2: confirmPassword,
        });
        return response;
        
      },
    });
  };
  
  