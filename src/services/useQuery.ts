import { useQuery } from "@tanstack/react-query";
import api from "../middleware/api";




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