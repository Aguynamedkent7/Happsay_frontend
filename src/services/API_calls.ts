import api from './api';

const API_URL = "https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/todolist/";

export type Todo = { id: number; title: string; content: string; is_done: boolean; is_archive: boolean; deadline: string };
export type NotesState = { [key: string]: Todo[] };

export const fetchTodos = async (): Promise<NotesState> => {
  try {
    const response = await api.get<Todo[]>('todolist/');
    const data = response.data;

    return {
      ToDo: data.filter((note) => !note.is_done),
      Done: data.filter((note) => note.is_done),
      Archive: [],
    };
  } catch (error) {
    console.error("Error fetching todos:", error);
    return { ToDo: [], Done: [], Archive: [] };
  }
};

export const addNote = async (title: string, content: string, deadline: string): Promise<Todo | null> => {
  try {
    const response = await api.post<Todo>(API_URL, {
      title,
      content,
      completed: false,
      deadline,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding note:", error);
    return null;
  }
};

export const updateNoteTitle = async (id: number, newTitle: string) => {
  try {
    return await api.patch(`${API_URL}${id}/`, { title: newTitle });
  } catch (error) {
    console.error("Error updating title:", error);
    return null;
  }
};

export const updateNoteContent = async (id: number, newContent: string) => {
  try {
    return await api.patch(`${API_URL}${id}/`, { content: newContent });
  } catch (error) {
    console.error("Error updating content:", error);
    return null;
  }
};

export const deleteNote = async (id: number) => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

export const toggleComplete = async (id: number, is_done: boolean) => {
  try {
    await api.patch(`${API_URL}${id}/`, { is_done: !is_done });
  } catch (error) {
    console.error("Error updating completion status:", error);
  }
};

export const toggleArchive = async (id: number, is_archive: boolean) => {
  try {
    await api.patch(`${API_URL}${id}/`, { is_archive: !is_archive });
  } catch (error) {
    console.error("Error updating archive status:", error);
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("token"); 
    if (!token) return;

    await api.post("/api/logout", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/"; // Redirect to login
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
