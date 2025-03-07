import { useState, useEffect } from "react";
import { fetchTodos, addNote, updateNoteTitle, updateNoteContent, deleteNote, toggleComplete, Todo, NotesState, toggleArchive, logout } from "@/services/API_calls";
import "@/styles/MainPage.css";
import "@/styles/NotePopup.css";
import "@/styles/ProfilePopup.css";
import { Link, useNavigate } from "react-router-dom";

const tabs = ["ToDo", "Done", "Archive"];

export default function MainPage() {
  const [selectedTab, setSelectedTab] = useState("ToDo");
  const [notes, setNotes] = useState<NotesState>({ ToDo: [], Done: [], Archive: [] });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Todo | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [noteDeadline, setNoteDeadline] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<Todo | null>(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadTodos() {
      const fetchedNotes = await fetchTodos();
      setNotes(fetchedNotes);
    }
    loadTodos();
  }, []);

  const handleAddNote = async () => {
    if (selectedTab !== "ToDo") return;
  
    if (!noteTitle.trim() || !noteContent.trim() || !noteDeadline) {
      setErrorMessage("Please fill in all input fields");
      
      // Hide error message after 3 seconds
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
  
    const newNote = await addNote(noteTitle, noteContent, noteDeadline);
    if (newNote) {
      setNotes((prevNotes) => ({
        ...prevNotes,
        ToDo: [...prevNotes.ToDo, newNote],
      }));
      setNoteTitle("");
      setNoteContent("");
      setNoteDeadline("");
    }
  };
  

  const handleSaveChanges = async () => {
    if (!selectedNote) return;
  
    try {
      await updateNoteTitle(selectedNote.id, selectedNote.title);
      await updateNoteContent(selectedNote.id, selectedNote.content);
      
      setNotes((prevNotes) => ({
        ...prevNotes,
        [selectedTab]: prevNotes[selectedTab].map((note) =>
          note.id === selectedNote.id ? { ...note, title: selectedNote.title, content: selectedNote.content } : note
        ),
      }));
  
      setSelectedNote(null); // Close the popup
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    await deleteNote(id);
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedTab]: prevNotes[selectedTab].filter((note) => note.id !== id),
    }));
  };

  const confirmDeleteNote = (note: Todo) => {
    setNoteToDelete(note);
  };
  
  const handleDeleteConfirmed = async () => {
    if (noteToDelete) {
      await handleDeleteNote(noteToDelete.id);
      setSelectedNote(null); // Close the note popup
    }
    setNoteToDelete(null); // Close the delete confirmation popup
  };
  
  

  const handleToggleComplete = async (id: number, is_done: boolean) => {
    await toggleComplete(id, is_done);
    setNotes((prevNotes) => {
      const updatedNotes = { ...prevNotes };
      const sourceTab = is_done ? "Done" : "ToDo";
      const destinationTab = is_done ? "ToDo" : "Done";
  
      const noteToToggle = updatedNotes[sourceTab].find((note) => note.id === id);
      if (!noteToToggle) return updatedNotes;
  
      noteToToggle.is_done = !is_done;
  
      updatedNotes[sourceTab] = updatedNotes[sourceTab].filter((note) => note.id !== id);
      updatedNotes[destinationTab] = [...updatedNotes[destinationTab], noteToToggle];
  
      return updatedNotes;
    });
  
    // Close the popup if the toggled note was open
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };
  
  const handleToggleArchive = async (id: number, is_archive: boolean) => {
    await toggleArchive(id, is_archive);
  
    setNotes((prevNotes) => {
      const updatedNotes = { ...prevNotes };
  
      if (is_archive) {
        // Unarchiving: Move back to "ToDo" with is_done set to false
        const noteToUnarchive = updatedNotes["Archive"].find((note) => note.id === id);
        if (!noteToUnarchive) return updatedNotes;
  
        noteToUnarchive.is_archive = false;
        noteToUnarchive.is_done = false; // Ensure it's marked as not done
  
        // Remove from Archive tab
        updatedNotes["Archive"] = updatedNotes["Archive"].filter((note) => note.id !== id);
  
        // Add back to ToDo tab
        updatedNotes["ToDo"] = [...updatedNotes["ToDo"], noteToUnarchive];
      } else {
        // Archiving: Move the note to "Archive"
        const sourceTab = updatedNotes["ToDo"].find((note) => note.id === id) ? "ToDo" : "Done";
        const noteToArchive = updatedNotes[sourceTab].find((note) => note.id === id);
        if (!noteToArchive) return updatedNotes;
  
        noteToArchive.is_archive = true;
  
        // Remove from source tab
        updatedNotes[sourceTab] = updatedNotes[sourceTab].filter((note) => note.id !== id);
  
        // Add to Archive tab
        updatedNotes["Archive"] = [...updatedNotes["Archive"], noteToArchive];
      }
  
      return updatedNotes;
    });
  
    setSelectedNote(null); // Close popup after action
  };
  
  


  

  return (
    <div className="container">
  <header className="header">
    <h1>Happsay!</h1>
    <button className="profile-pic" onClick={() => setIsProfileOpen((prev) => !prev)}>
      {localStorage.getItem("username")}
    </button>
  </header>
   {errorMessage && (
  <div className="error-popup">
    <p>{errorMessage}</p>
  </div>
)}
  

  {/* Profile Popup */}
  {isProfileOpen && (
    <div className="profile-popup">
      <div className="profile-popup-content">
        <div className="profile-options">
          <Link to="/settings" className="option">⚙️ Settings</Link>
          <button onClick={() => logout(navigate)} className="option">🚪 Log Out</button>
        </div>
      </div>
    </div>
  )}

  <div className="main-layout">
    <aside className="sidebar fixed-sidebar">
      <nav>
        {tabs.map((tab) => (
          <div key={tab} className={`tab ${selectedTab === tab ? "active" : ""}`} onClick={() => { setSelectedTab(tab);
            setSelectedNote(null); }}>
            {tab}
          </div>
        ))}
      </nav>
    </aside>
   

    <main className="content">
      {/* Note Input */}
      {selectedTab === "ToDo" && (
        <div className="note-input">
        <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Enter title..." />
        
        <input type="text" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Add a Task..." />
        
        <div className="input-group">
          <label htmlFor="noteDeadline">Select deadline:</label>
          <input id="noteDeadline" type="date" value={noteDeadline} onChange={(e) => setNoteDeadline(e.target.value)} />
        </div>
      
        <button onClick={handleAddNote} className="add">Add</button>
      </div>
      )}

      {/* Notes List */}
      <div className="notes-container">
        {notes[selectedTab].length === 0 ? (
          <p className="empty-message">
        {selectedTab === "Done"
        ? "No completed tasks yet. Keep going!"
        : selectedTab === "Archive"
        ? "No archived notes. Archive a note to store it here."
        : "Its quiet around here....Start planning your life now!"}
    </p>
        ) : (
          notes[selectedTab].map((note) => (
            <div key={note.id} className="note-card">
              {selectedTab !== "Archive" && (
                <input
                  type="checkbox"
                  checked={note.is_done}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleToggleComplete(note.id, note.is_done);
                  }}
                  className="note-checkbox"
                />
              )}
              <div className="note-info" onClick={() => setSelectedNote(note)}>
                <strong className="note-title">{note.title}</strong>
                <p className="note-preview">{note.content.slice(0, 30)}...</p>
                <div className="note-deadline">
  <strong>Deadline:</strong> {note.deadline ? note.deadline : "No deadline"}
</div>

              </div>
            </div>
          ))
        )}
      </div>
    </main>
  </div>

  {/* Note Popup */}
  {selectedNote && (
    <div className="note-popup">
      <div className="note-popup-content">
        <div className="popup-header">
          <input
            type="text"
            value={selectedNote.title}
            onChange={(e) => {
              if (!selectedNote) return;
              setSelectedNote((prev) => (prev ? { ...prev, title: e.target.value } : prev));
            }}
            className="note-title"
          />
          <button className="close-btn" onClick={handleSaveChanges}>✖</button>
        </div>

        <textarea
          value={selectedNote.content}
          onChange={(e) => {
            if (!selectedNote) return;
            setSelectedNote((prev) => (prev ? { ...prev, content: e.target.value } : prev));
          }}
        />

        <div className="popup-footer">
          <button className="delete-btn" onClick={() => confirmDeleteNote(selectedNote!)}>Delete</button>
          <button 
            className="archive-btn" 
            onClick={() => selectedNote && handleToggleArchive(selectedNote.id, selectedNote.is_archive)}
          >
            {selectedTab === "Archive" ? "Unarchive" : "Archive"}
          </button>
          <button className="save-btn" onClick={handleSaveChanges}>Save</button>
        </div>
      </div>
    </div>
  )}
  {noteToDelete && (
  <div className="delete-popup">
    <div className="popup-content">
      <p>Are you sure you want w delete "{noteToDelete.title}"?</p>
      <button className="confirm-btn" onClick={handleDeleteConfirmed}>Yes, Delete</button>
      <button className="cancel-btn" onClick={() => setNoteToDelete(null)}>Cancel</button>
    </div>
  </div>
)}

</div>


      
  );
}
