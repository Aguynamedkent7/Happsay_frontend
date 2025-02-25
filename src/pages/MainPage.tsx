import { useState } from "react";
import "@/styles/MainPage.css";
import "@/styles/NotePopup.css"; // Separate CSS for modal
import "@/styles/ProfilePopup.css"; 

const tabs = ["ToDo", "Done", "Archive"];

type Note = { id: number; title: string; text: string; completed: boolean };
type NotesState = { [key: string]: Note[] };

export default function MainPage() {
  const [selectedTab, setSelectedTab] = useState("ToDo");
  const [notes, setNotes] = useState<NotesState>({
    ToDo: [],
    Done: [],
    Archive: [],
  });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isTaskMode, setIsTaskMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const addNote = () => {
    if (selectedTab !== "ToDo" || !noteText.trim() || !noteTitle.trim()) return;
    const newNote = { id: Date.now(), title: noteTitle, text: noteText, completed: false };
    setNotes((prevNotes) => ({
      ...prevNotes,
      ToDo: [...prevNotes.ToDo, newNote],
    }));
    setNoteTitle("");
    setNoteText("");
  };

  const updateNoteTitle = (id: number, newTitle: string) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedTab]: prevNotes[selectedTab].map((note) =>
        note.id === id ? { ...note, title: newTitle } : note
      ),
    }));
    setSelectedNote((prev) => (prev ? { ...prev, title: newTitle } : null));
  };

  const updateNoteText = (id: number, newText: string) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedTab]: prevNotes[selectedTab].map((note) =>
        note.id === id ? { ...note, text: newText } : note
      ),
    }));
    setSelectedNote((prev) => (prev ? { ...prev, text: newText } : null));
  };

  const deleteNote = (id: number) => {
    setNotes((prevNotes) => {
      const noteToDelete = prevNotes[selectedTab].find((note) => note.id === id);
      if (!noteToDelete) return prevNotes;

      return {
        ...prevNotes,
        [selectedTab]: prevNotes[selectedTab].filter((note) => note.id !== id),
        Archive: [...prevNotes.Archive, noteToDelete],
      };
    });
    setSelectedNote(null);
  };

  const toggleComplete = (id: number) => {
    setNotes((prevNotes) => {
      const noteToToggle = prevNotes[selectedTab].find((note) => note.id === id);
      if (!noteToToggle) return prevNotes;

      const updatedNote = { ...noteToToggle, completed: !noteToToggle.completed };
      const sourceTab = updatedNote.completed ? "ToDo" : "Done";
      const destinationTab = updatedNote.completed ? "Done" : "ToDo";

      return {
        ...prevNotes,
        [sourceTab]: prevNotes[sourceTab].filter((note) => note.id !== id),
        [destinationTab]: [...prevNotes[destinationTab], updatedNote],
      };
    });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Happsay!</h1>
        <img src="profile.jpg" alt="User Profile" className="profile-pic"  onClick={() => setIsProfileOpen((prev) => !prev)} />
      </header>
      {isProfileOpen && (
        <div className="profile-popup">
          <div className="profile-popup-content">
            <div className="profile-header">
              <div className="profile-pic-placeholder"></div>
              <span className="username">kerbsbual</span>
            </div>
            <div className="profile-options">
              <div className="option">🔍 View Profile</div>
              <div className="option">⚙️ Settings</div>
              <div className="option">🚪 Logout</div>
            </div>
          </div>
        </div>
      )}
      <div className="main-layout">
        <aside className="sidebar fixed-sidebar">
          <nav>
            {tabs.map((tab) => (
              <div
                key={tab}
                className={`tab ${selectedTab === tab ? "active" : ""}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </div>
            ))}
          </nav>
        </aside>
        <main className="content">
          {selectedTab === "ToDo" && (
            <div className="note-input">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Enter title..."
              />
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a Task..."
              />
              <button onClick={addNote}>Add</button>
            </div>
          )}
          <div className="notes-container">
            {notes[selectedTab].map((note) => (
              <div key={note.id} className="note-card">
                {selectedTab !== "Archive" && (
                  <input
                    type="checkbox"
                    checked={note.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleComplete(note.id);
                    }}
                    className="note-checkbox"
                  />
                )}
                <div className="note-info" onClick={() => setSelectedNote(note)}>
                  <strong className="note-title">{note.title}</strong>
                  <p className="note-preview">{note.text.slice(0, 30)}...</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      {selectedNote && (
        <div className="note-popup">
          <div className="note-popup-content">
            <div className="popup-header">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNoteTitle(selectedNote.id, e.target.value)}
                className="note-title"
              />
              <button className="close-btn" onClick={() => setSelectedNote(null)}>✖</button>
            </div>
            <label className="task-toggle">
              <input
                type="checkbox"
                checked={isTaskMode}
                onChange={() => setIsTaskMode((prev) => !prev)}
              />
              Toggle Checkboxes
            </label>
            {isTaskMode ? (
              <div className="task-list">
                {selectedNote.text.split("\n").map((line, index) => (
                  <div key={index} className="task-item">
                    <input type="checkbox" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                value={selectedNote.text}
                onChange={(e) => updateNoteText(selectedNote.id, e.target.value)}
              />
            )}
            <div className="popup-footer">
              <button className="delete-btn" onClick={() => deleteNote(selectedNote.id)}>
                Delete
              </button>
              <button className="save-btn" onClick={() => setSelectedNote(null)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
