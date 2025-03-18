import { useState } from "react";
import { INotesState, ITodoQuery } from "@/interfaces/interfaces";
import { useFetchTodos } from "@/hooks/tanstack/notes/useQueryNote";
import "@/styles/MainPage.css";
import "@/styles/NotePopup.css";
import "@/styles/ProfilePopup.css";
import { Link, useNavigate } from "react-router-dom";
import useMutationNote from "@/hooks/tanstack/notes/useMutationNote";
import Toast from "@/components/ui/ToastContainer";
import { toast } from "react-toastify";
import { useLogout } from "@/services/auth/authApi";
import { useGetUser } from "@/hooks/tanstack/getuser/useQueryGetUser";

const tabs = ["ToDo", "Done", "Archive"];

export default function MainPage() {
  const [selectedTab, setSelectedTab] = useState("ToDo");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<ITodoQuery | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [noteDeadline, setNoteDeadline] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<ITodoQuery | null>(null);
  const [noteToArchive, setNoteToArchive] = useState<ITodoQuery | null>(null);
  const navigate = useNavigate();

  const userId = Number(localStorage.getItem("userId"));
  const { data: notes } = useFetchTodos();
  const { data: user } = useGetUser(userId);

  // ✅ Mutations for notes
  const { useMutationUpdateNoteTitle } = useMutationNote();
  const { mutate: updateNoteTitle } = useMutationUpdateNoteTitle();

  const { useMutationUpdateNoteContent } = useMutationNote();
  const { mutate: updateNoteContent } = useMutationUpdateNoteContent();

  const { useMutationAddNote } = useMutationNote();
  const { mutate: addNote } = useMutationAddNote();

  const { useMutationDeleteNote } = useMutationNote();
  const { mutate: deleteNote } = useMutationDeleteNote();

  const { useMutationToggleComplete } = useMutationNote();
  const { mutate: toggleComplete } = useMutationToggleComplete();

  const { useMutationToggleArchive } = useMutationNote();
  const { mutate: toggleArchive } = useMutationToggleArchive();

  const handleAddNote = async () => {
    if (selectedTab !== "ToDo") return;

    if (!noteTitle.trim() || !noteContent.trim() || !noteDeadline) {
      toast.error("Please fill in all input fields");
      return;
    }

    addNote({ title: noteTitle, content: noteContent, deadline: noteDeadline });

    // Reset input fields
    setNoteTitle("");
    setNoteContent("");
    setNoteDeadline("");
  };

  const handleSaveChanges = async () => {
    if (!selectedNote) return;

    try {
      updateNoteTitle({ id: selectedNote.id, newTitle: selectedNote.title });
      updateNoteContent({ id: selectedNote.id, newContent: selectedNote.content });
      toast.success("Changes saved");
      setSelectedNote(null); // Close the popup
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // ✅ Delete Note
  const handleDeleteNote = async (id: number) => {
    deleteNote(id);
  };

  const confirmDeleteNote = (note: ITodoQuery) => {
    setNoteToDelete(note);
  };

  const handleDeleteConfirmed = async () => {
    if (noteToDelete) {
      await handleDeleteNote(noteToDelete.id);
      setSelectedNote(null); // Close the note popup
    }
    setNoteToDelete(null); // Close the delete confirmation popup
  };

  // ✅ Toggle Completion
  const handleToggleComplete = (id: number, is_done: boolean) => {
    toggleComplete({ id, is_done });

    // Close the popup if the toggled note was open
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  // ✅ Toggle Archive
  const handleToggleArchive = async (id: number, is_archived: boolean) => {
    toggleArchive({ id, is_archived });
    setSelectedNote(null);
  };

  const confirmArchiveNote = (note: ITodoQuery) => {
    setNoteToArchive(note);
  };

  const handleArchiveConfirmed = async () => {
    if (noteToArchive) {
      await handleToggleArchive(noteToArchive.id, noteToArchive.is_archived);
    }
    setNoteToArchive(null); // Close the archive confirmation popup
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Happsay!</h1>
        <button className="profile-pic" onClick={() => setIsProfileOpen((prev) => !prev)}>
          { user?.username }
        </button>
      </header>

      {/* Profile Popup */}
      {isProfileOpen && (
        <div className="profile-popup">
          <div className="profile-popup-content">
            <div className="profile-options">
              <Link to="/settings" className="option">⚙️ Settings</Link>
              <button onClick={() => useLogout(navigate)} className="option">🚪 Log Out</button>
            </div>
          </div>
        </div>
      )}

      <div className="main-layout">
        <aside className="sidebar fixed-sidebar">
          <nav>
            {tabs.map((tab) => (
              <div key={tab} className={`tab ${selectedTab === tab ? "active" : ""}`} onClick={() => { setSelectedTab(tab); setSelectedNote(null); }}>
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
            {!notes || notes[selectedTab as keyof INotesState]?.length === 0 ? (
              <p className="empty-message">
                {selectedTab === "Done"
                  ? "No completed tasks yet. Keep going!"
                  : selectedTab === "Archive"
                  ? "No archived notes. Archive a note to store it here."
                  : "It's quiet around here... Start planning your life now!"}
              </p>
            ) : (
              notes[selectedTab as keyof INotesState]
                ?.slice() // Prevent modifying the original array
                .sort((a, b) => a.id - b.id) // Sort notes by ID to keep a consistent order
                .map((note) => (
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
              <button className="close-btn" onClick={() => setSelectedNote(null)}>✖</button>
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
                onClick={() => {
                  return !selectedNote.is_archived ?
                    confirmArchiveNote(selectedNote!) :
                    handleToggleArchive(selectedNote.id, selectedNote.is_archived);
                }}
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
            <p>Are you sure you want to delete "{noteToDelete.title}"?</p>
            <button className="confirm-btn" onClick={handleDeleteConfirmed}>Yes, Delete</button>
            <button className="cancel-btn" onClick={() => setNoteToDelete(null)}>Cancel</button>
          </div>
        </div>
      )}
      {noteToArchive && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Are you sure you want to archive "{noteToArchive.title}"?</p>
            <button className="confirm-btn-archive" onClick={handleArchiveConfirmed}>Yes, Archive</button>
            <button className="cancel-btn" onClick={() => setNoteToArchive(null)}>Cancel</button>
          </div>
        </div>
      )}
      <Toast />
    </div>
  );
}
