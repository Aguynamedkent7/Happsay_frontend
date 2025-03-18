import showToast from "@/components/ui/showToast"
import { IAddNote, IUpdateNote } from "@/interfaces/interfaces"
import { addNote, deleteNote, toggleArchive, toggleComplete, updateNoteContent, updateNoteDeadline, updateNoteTitle } from "@/services/note/notesApi"
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
                showToast("Failed to add note", "error")
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
                showToast("Failed to update title", "error")
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
                showToast("Failed to update note content", "error")
            }
        });
    }

    const useMutationUpdateNoteDeadline = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (data: IUpdateNote) => updateNoteDeadline(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["todos"] });
            },
            onError: () => {
                showToast("Failed to update deadline", "error");
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
                showToast("Failed to delete note", "error")
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
                showToast("Failed to mark as done. Try again.", "error")
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
                showToast("Failed to Archive.", "error")
            }
        })
    }
    return {
        useMutationAddNote, 
        useMutationUpdateNoteTitle, 
        useMutationUpdateNoteContent,
        useMutationUpdateNoteDeadline,
        useMutationDeleteNote,
        useMutationToggleComplete,
        useMutationToggleArchive
    }


}
export default useMutationNote