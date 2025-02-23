import { useState } from "react";
import "@/styles/MainPage.css";

const tabs = ["ToDo", "Done", "Archive"];

type Note = { id: number; text: string; completed: boolean };
type NotesState = { [key: string]: Note[] };

export default function MainPage() {
  const [selectedTab, setSelectedTab] = useState("ToDo");
  const [notes, setNotes] = useState<NotesState>({
    ToDo: [],
    Done: [],
    Archive: [],
  });
  const [noteText, setNoteText] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const addNote = () => {
    if (selectedTab !== "ToDo" || !noteText.trim()) return;
    const newNote = { id: Date.now(), text: noteText, completed: false };
    setNotes((prevNotes) => ({
      ...prevNotes,
      ToDo: [...prevNotes.ToDo, newNote],
    }));
    setNoteText("");
  };

  const updateNote = (id: number, newText: string) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedTab]: prevNotes[selectedTab].map((note) =>
        note.id === id ? { ...note, text: newText } : note
      ),
    }));
    setSelectedNote((prev) => (prev ? { ...prev, text: newText } : null));
  };

  const deleteNote = (id: number) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [selectedTab]: prevNotes[selectedTab].filter((note) => note.id !== id),
    }));
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
        <img src="profile.jpg" alt="User Profile" className="profile-pic" />
      </header>
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
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Take a note..."
              />
              <button onClick={addNote}>Add</button>
            </div>
          )}
          <div className="notes-container">
            {notes[selectedTab].map((note) => (
              <div key={note.id} className="note-card">
                <input
                  type="checkbox"
                  checked={note.completed}
                  onChange={() => toggleComplete(note.id)}
                />
                <span onClick={() => setSelectedNote(note)}>{note.text}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
      {selectedNote && (
        <div className="note-popup">
          <div className="note-popup-content">
            <textarea
              value={selectedNote.text}
              onChange={(e) => updateNote(selectedNote.id, e.target.value)}
            />
            <button onClick={() => deleteNote(selectedNote.id)}>Delete</button>
            <button onClick={() => setSelectedNote(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
