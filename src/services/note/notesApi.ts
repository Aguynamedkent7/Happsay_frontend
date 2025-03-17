import { IAddNote, IUpdateNote } from "@/interfaces/interfaces";
import api from "@/middleware/api";

type ToggleCompleteData = Pick<IUpdateNote, "id" | "is_done">
type ToggleArchiveData = Pick<IUpdateNote, "id" | "is_archived">

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

  export const toggleComplete = (data: ToggleCompleteData) => {
    try {
      const res = api.patch(`todolist/${data.id}/`, { is_done: !data.is_done});
      return res;
    } catch (error) {
      console.error(error)
    }
  }

  export const toggleArchive = (data: ToggleArchiveData) => {
    try {
        const res = api.patch(`todolist/${data.id}/`, {is_archived: !data.is_archived});
        return res;
    } catch (error) {
        console.error(error)
    }
  }