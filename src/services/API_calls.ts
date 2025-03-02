const API_URL = "http://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/todolist/";

export type Todo = { id: number; title: string; content: string; is_done: boolean; deadline: string };
export type NotesState = { [key: string]: Todo[] };

const getAuthHeaders = (): HeadersInit => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  "Content-Type": "application/json",
});

export const fetchTodos = async (): Promise<NotesState> => {
  try {
    const response = await fetch(API_URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Failed to fetch todos");

    const data: Todo[] = await response.json();
    
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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, content, completed: false , deadline}),
    });

    if (!response.ok) throw new Error("Failed to add note");

    return await response.json();
  } catch (error) {
    console.error("Error adding note:", error);
    return null;
  }
};

export const updateNoteTitle = async (id: number, newTitle: string) => {
  try {
    const response = await fetch(
      `http://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/todolist/${id}/`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: newTitle }),
      }
    );
    return response; // Return response to check status
  } catch (error) {
    console.error("Error updating title:", error);
    return null;
  }
};

export const updateNoteContent = async (id: number, newContent: string) => {
  try {
    const response = await fetch(
      `http://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/todolist/${id}/`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: newContent }),
      }
    );
    return response; // Return response to check status
  } catch (error) {
    console.error("Error updating content:", error);
    return null;
  }
};


export const deleteNote = async (id: number) => {
  try {
    await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

export const toggleComplete = async (id: number, is_done: boolean) => {
  try {
    await fetch(`${API_URL}${id}/`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_done: !is_done }),
    });
    
  } catch (error) {
    console.error("Error updating completion status:", error);
  }
};

