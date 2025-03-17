import { IAddNote, IUpdateNote } from "@/interfaces/interfaces"
import { addNote, deleteNote, toggleArchive, toggleComplete, updateNoteContent, updateNoteTitle } from "@/services/note/useMutationNote"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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
            onSuccess: (_, variables) => {
                if (variables.is_done){
                    toast.success("Task unmarked as done")
                } else{
                    toast.success("Task marked as done")
                }
                queryClient.invalidateQueries({ queryKey: ["todos"] });
            },
            onError: () => {
                toast.error("Failed to mark as done. Try again.")
            }
        });
    }

    const useMutationToggleArchive = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (data: IUpdateNote) => toggleArchive(data),
            onSuccess: (_, variables) => {
                if (variables.is_archived){
                    toast.success("Task unarchived")
                } else{
                    toast.success("Task archived successfully")
                }
                queryClient.invalidateQueries({ queryKey: ["todos"]});
            },
            onError: () => {
                toast.error("Failed to Archive.")
            }
        })
    }
    return {
        useMutationAddNote, 
        useMutationUpdateNoteTitle, 
        useMutationUpdateNoteContent,
        useMutationDeleteNote,
        useMutationToggleComplete,
        useMutationToggleArchive
    }


}
export default useMutationNote