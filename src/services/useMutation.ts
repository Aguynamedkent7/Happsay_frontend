import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../middleware/api";
import { IAddNote, IResetPass, IUpdateNote, IUserData } from "@/interfaces/interfaces";




export type Todo = { id: number; title: string; content: string; is_done: boolean; is_archived: boolean; deadline: string };
export type NotesState = { ToDo: Todo[]; Done: Todo[]; Archive: Todo[] };


export const addNote = (data:IAddNote) => {
    try {
      const res = api.post("todolist/", data)
      return res
    } catch (error) {
      console.error(error)
    }
  }


export const updateNoteTitle = (data: IUpdateNote) => {
  try {
    const res = api.patch(`todolist/${data.id}/`, { title: data.newTitle });
    return res;
  } catch (error) {
    console.error(error);
  }
}
  
  
export const updateNoteContent = (data: IUpdateNote) => {
    try {
      const res = api.patch(`todolist/${data.id}/`, { content: data.newContent })
      return res
    } catch (error) {
      console.error(error); 
    }
  }
  

export const deleteNote = (id: number) => {
  try {
      const res = api.delete(`todolist/${id}/`)
      return res;
  } catch (error) {
      console.error(error)
  }
}
  
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

  // TODO
  export const toggleComplete = (data: IUpdateNote) => {
    try {
      const res = api.patch(`todolist/${data.id}/`, { is_done: !data.is_done});
      return res;
    } catch (error) {
      console.error(error)
    }
  }
  
  // ✅ Toggle Archive Mutation TODO
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
          confirm_password: confirmPassword,
        });
        return response;
        
      },
    });
  };
  
  