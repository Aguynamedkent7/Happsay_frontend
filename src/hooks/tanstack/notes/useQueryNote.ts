import { useQuery } from "@tanstack/react-query";
import { INotesState } from "@/interfaces/interfaces";
import { queryNotes } from "@/services/note/notesApi";



// ✅ Fetch Todos with TanStack Query
export const useFetchTodos = () => {
    return useQuery<INotesState>({
      queryKey: ["todos"],
      queryFn: () => queryNotes()
    });
  };