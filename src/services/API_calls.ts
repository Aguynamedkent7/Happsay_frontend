import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../middleware/api";
import { useNavigate } from "react-router-dom";

const API_URL = "https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/todolist/";

export type Todo = { id: number; title: string; content: string; is_done: boolean; is_archived: boolean; deadline: string };
export type NotesState = { ToDo: Todo[]; Done: Todo[]; Archive: Todo[] };

// ✅ Fetch Todos with TanStack Query
export const useFetchTodos = () => {
  return useQuery<NotesState>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await api.get<Todo[]>("todolist/");
      const data = response.data;
      return {
        ToDo: data.filter((note) => !note.is_done && !note.is_archived),
        Done: data.filter((note) => note.is_done && !note.is_archived),
        Archive: data.filter((note) => note.is_archived),
      };
    },
  });
};

// ✅ Add Note Mutation
export const useAddNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, content, deadline }: { title: string; content: string; deadline: string }) => {
      const response = await api.post<Todo>(API_URL, { title, content, completed: false, deadline });
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
      return api.patch(`${API_URL}${id}/`, { title: newTitle });
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
      return api.patch(`${API_URL}${id}/`, { content: newContent });
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
      await api.delete(`${API_URL}${id}/`);
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
      await api.patch(`${API_URL}${id}/`, { is_done: !is_done });
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
      await api.patch(`${API_URL}${id}/`, { is_archived: !is_archived });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      console.log("Note archived/unarchived successfully.");
    },
  });
};

// ✅ Logout Function
export const logout = async (navigate: ReturnType<typeof useNavigate>) => {
  try {
    const refresh_token = localStorage.getItem("refresh_token");
    await api.post("/logout/", { refresh_token });
    localStorage.clear();
    navigate("/login");
  } catch (error: any) {
    console.error("Logout failed:", error.response ? error.response.data : error.message);
  }
};
