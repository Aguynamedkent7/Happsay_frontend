import { useQuery } from "@tanstack/react-query";
import api from "../../../middleware/api";
import { INotesState, ITodoQuery } from "@/interfaces/interfaces";



// ✅ Fetch Todos with TanStack Query
export const useFetchTodos = () => {
    return useQuery<INotesState>({
      queryKey: ["todos"],
      queryFn: async () => {
        const response = await api.get<ITodoQuery[]>("todolist/");
        const data = response.data;
        return {
          ToDo: data.filter((note) => !note.is_done && !note.is_archived),
          Done: data.filter((note) => note.is_done && !note.is_archived),
          Archive: data.filter((note) => note.is_archived),
        };
      },
    });
  };