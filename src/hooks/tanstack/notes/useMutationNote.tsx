import { IAddNote, IUpdateNote } from "@/interfaces/interfaces"
import { addNote, deleteNote, toggleComplete, updateNoteContent, updateNoteTitle } from "@/services/useMutation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { toast } from "react-toastify"

const useMutationNote = () => {

    const useMutationAddNote = () => {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn: async (data:IAddNote) => addNote(data),
            onSuccess: () => {
                toast.success("Successfully Added Note!")
                queryClient.invalidateQueries({ queryKey: ["todos"] })
            },
            onError: () => {
                toast.error("Failed to add note")
            }
        })
    }

    const useMutationUpdateNoteTitle = () => {
        const queryClient = useQueryClient();
        return useMutation ( {
            mutationFn: async (data: IUpdateNote) => updateNoteTitle(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["todos"] })
            },
            onError: () => {
                toast.error("Failed to update title")
            }
        })
    }

    const useMutationUpdateNoteContent = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (data: IUpdateNote) => updateNoteContent(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["todos"] });
            },
            onError: () => {
                toast.error("Failed to update note content")
            }
        });
    }

    const useMutationDeleteNote = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (id: number) => deleteNote(id),
            onSuccess: () => {
                toast.success("Successfully deleted note!")
                queryClient.invalidateQueries({ queryKey: ["todos"] });
            },
            onError: () => {
                toast.error("Failed to delete note")
            }
        });
    }

    const useMutationToggleComplete = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (data: IUpdateNote) => toggleComplete(data),
            onSuccess: () => {
                toast.success("Task marked as done!")
            },
            onError: () => {
                toast.error("Failed to mark as done. Try again.")
                queryClient.invalidateQueries({ queryKey: ["todos"] });
            }
        });
    }

    return {
        useMutationAddNote, 
        useMutationUpdateNoteTitle, 
        useMutationUpdateNoteContent,
        useMutationDeleteNote,
        useMutationToggleComplete
    }


}
export default useMutationNote