import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchNotes();
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/notes");
      console.log(response.data);
      setNotes(response.data);
      
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎓 CampusConnect AI Dashboard</h1>

      <p>Welcome to CampusConnect AI 🚀</p>

      <hr />

      <h2>Quick Actions</h2>

      <button onClick={() => navigate("/upload-notes")}>
        📄 Upload Notes
      </button>

      <button
        onClick={() => navigate("/ai-chat")}
        style={{ marginLeft: "10px" }}
      >
        🤖 AI Chat
      </button>

      <button
        onClick={handleLogout}
        style={{ marginLeft: "10px" }}
      >
        🚪 Logout
      </button>

      <hr />

      <h2>📚 Uploaded Notes</h2>

      {notes.length === 0 ? (
        <p>No notes uploaded yet.</p>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "20px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h3>{note.title}</h3>

            <p>
              <strong>Subject:</strong> {note.subject}
            </p>

            <p>
              <strong>File Path:</strong> {note.file_url}
            </p>

            <p>
              <strong>AI Summary:</strong>
            </p>

            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "10px",
                borderRadius: "5px",
                whiteSpace: "pre-wrap",
              }}
            >
              {note.summary || "No summary available."}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;