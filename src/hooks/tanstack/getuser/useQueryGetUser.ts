import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/services/getuser/getUserApi";



// ✅ Fetch Todos with TanStack Query
export const useGetUser = (id: number) => {
    return useQuery({
        queryKey: ["userProfile"],
        queryFn: () => getUser(id), // Fetches user data
    });
  };