import { useState } from "react";
import { 
  useAddNote, 
  useUpdateNoteTitle, 
  useUpdateNoteContent, 
  useDeleteNote, 
  useToggleComplete, 
  useToggleArchive,
  Todo, NotesState
} from "@/services/useMutation";
import { useFetchTodos } from "@/services/useQuery";
import { useLogout } from "@/services/useAuth";
import "@/styles/MainPage.css";
import "@/styles/NotePopup.css";
import "@/styles/ProfilePopup.css";
import { Link, useNavigate } from "react-router-dom";


const tabs = ["ToDo", "Done", "Archive"];

export default function MainPage() {
  const [selectedTab, setSelectedTab] = useState("ToDo");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Todo | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [noteDeadline, setNoteDeadline] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<Todo | null>(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Fetch notes using TanStack Query
  const { data: notes } = useFetchTodos();

  // ✅ Mutations for notes
  const addNoteMutation = useAddNote();
  const updateTitleMutation = useUpdateNoteTitle();
  const updateContentMutation = useUpdateNoteContent();

  const handleAddNote = async () => {
    if (selectedTab !== "ToDo") return;

    if (!noteTitle.trim() || !noteContent.trim() || !noteDeadline) {
      setErrorMessage("Please fill in all input fields");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    addNoteMutation.mutate({ title: noteTitle, content: noteContent, deadline: noteDeadline });

    // Reset input fields
    setNoteTitle("");
    setNoteContent("");
    setNoteDeadline("");
  };

  const handleSaveChanges = async () => {
    if (!selectedNote) return;

    try {
      updateTitleMutation.mutate({ id: selectedNote.id, newTitle: selectedNote.title });
      updateContentMutation.mutate({ id: selectedNote.id, newContent: selectedNote.content });

      setSelectedNote(null); // Close the popup
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const deleteNoteMutation = useDeleteNote();
  const toggleCompleteMutation = useToggleComplete();
  const toggleArchiveMutation = useToggleArchive();
  
  // ✅ Delete Note
  const handleDeleteNote = async (id: number) => {
    deleteNoteMutation.mutate(id);
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
  
  // ✅ Toggle Completion
  const handleToggleComplete = (id: number, is_done: boolean) => {
    toggleCompleteMutation.mutate({ id, is_done });
    if (!is_done){
      setSuccessMessage("Task Marked as Done")
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    
  
    // Close the popup if the toggled note was open
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      
    }
  };
  
  // ✅ Toggle Archive
  const handleToggleArchive = (id: number, is_archived: boolean) => {
    console.log("Toggling archive for note:", id, is_archived);
    toggleArchiveMutation.mutate({ id, is_archived });
  
    // Close popup after action
    setSelectedNote(null);
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
    {successMessage && (
  <div className="error-popup">
    <p>{successMessage}</p>
  </div>
)}
  

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
      {!notes || notes[selectedTab as keyof NotesState]?.length === 0 ? (
          <p className="empty-message">
        {selectedTab === "Done"
        ? "No completed tasks yet. Keep going!"
        : selectedTab === "Archive"
        ? "No archived notes. Archive a note to store it here."
        : "Its quiet around here....Start planning your life now!"}
    </p>
        ) : (
          notes[selectedTab as keyof NotesState]?.map((note) => (
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
            onClick={() => selectedNote && handleToggleArchive(selectedNote.id, selectedNote.is_archived)}
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
