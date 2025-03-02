import { useState, useEffect } from "react";
import { fetchTodos, addNote, updateNoteTitle, updateNoteContent, deleteNote, toggleComplete, Todo, NotesState } from "@/services/API_calls";
import "@/styles/MainPage.css";
import "@/styles/NotePopup.css";
import "@/styles/ProfilePopup.css";
import { Link } from "react-router-dom";

const tabs = ["ToDo", "Done", "Archive"];

export default function MainPage() {
  const [selectedTab, setSelectedTab] = useState("ToDo");
  const [notes, setNotes] = useState<NotesState>({ ToDo: [], Done: [], Archive: [] });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Todo | null>(null);
  const [isTaskMode, setIsTaskMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [noteDeadline, setNoteDeadline] = useState("");

  useEffect(() => {
    async function loadTodos() {
      const fetchedNotes = await fetchTodos();
      setNotes(fetchedNotes);
    }
    loadTodos();
  }, []);

  const handleAddNote = async () => {
    if (selectedTab !== "ToDo" || !noteTitle.trim() || !noteContent.trim()) return;
    const newNote = await addNote(noteTitle, noteContent, noteDeadline);
    if (newNote) {
      setNotes((prevNotes) => ({
        ...prevNotes,
        ToDo: [...prevNotes.ToDo, newNote],
      }));
      setNoteTitle("");
      setNoteContent("");
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
  };

  

  return (
    <div className="container">
      <header className="header">
        <h1>Happsay!</h1>
        <img src="profile.jpg" alt="User Profile" className="profile-pic" onClick={() => setIsProfileOpen((prev) => !prev)} />
      </header>
      
      {/* Profile Popup */}
      {isProfileOpen && (
        <div className="profile-popup">
          <div className="profile-popup-content">
            <div className="profile-header">
              <div className="profile-pic-placeholder"></div>
              <span className="username">kerbsbual</span>
            </div>
            <div className="profile-options">
              <div className="option">🔍 View Profile</div>
              <Link to="/settings">⚙️ Settings</Link>
              <Link to="/">🚪 Log Out</Link>
            </div>
          </div>
        </div>
      )}

      <div className="main-layout">
        <aside className="sidebar fixed-sidebar">
          <nav>
            {tabs.map((tab) => (
              <div key={tab} className={`tab ${selectedTab === tab ? "active" : ""}`} onClick={() => setSelectedTab(tab)}>
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
              <input type="date" value={noteDeadline} onChange={(e) => setNoteDeadline(e.target.value)} placeholder="Select deadline..."/>
              <button onClick={handleAddNote}>Add</button>
            </div>
          )}

          {/* Notes List */}
          <div className="notes-container">
            {notes[selectedTab].map((note) => (
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
                  {note.deadline && <p className="note-deadline">📅 {note.deadline}</p>}
                </div>
              </div>
            ))}
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
                if (!selectedNote) return; // Ensure selectedNote is not null
                setSelectedNote((prev) => (prev ? { ...prev, title: e.target.value } : prev));
              }}
              className="note-title"
            />
            <button className="close-btn" onClick={handleSaveChanges}>✖</button>
          </div>
      
          <label className="task-toggle">
            <input type="checkbox" checked={isTaskMode} onChange={() => setIsTaskMode((prev) => !prev)} />
            Toggle Checkboxes
          </label>
      
          {isTaskMode ? (
            <div className="task-list">
              {selectedNote.content.split("\n").map((line, index) => (
                <div key={index} className="task-item">
                  <input type="checkbox" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={selectedNote.content}
              onChange={(e) => {
                if (!selectedNote) return; 
                setSelectedNote((prev) => (prev ? { ...prev, content: e.target.value } : prev)); // ✅ Correct, updates content
              }}
            />
          )}
      
          <div className="popup-footer">
            <button className="delete-btn" onClick={() => handleDeleteNote(selectedNote.id)}>Delete</button>
            <button className="save-btn" onClick={handleSaveChanges}>Save</button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
