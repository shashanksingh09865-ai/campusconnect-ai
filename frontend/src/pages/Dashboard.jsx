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

    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/notes"
        );

        setNotes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotes();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    alert("Logged Out Successfully");

    navigate("/");
  };

  return (
    <div>
      <h1>CampusConnect AI Dashboard</h1>

      <p>Welcome to CampusConnect AI 🚀</p>

      <h2>Quick Actions</h2>

      <button onClick={() => navigate("/upload-notes")}>
        📄 Upload Notes
      </button>

      <br />
      <br />

      <button onClick={() => navigate("/ai-chat")}>
        🤖 Open AI Chat
      </button>

      <br />
      <br />

      <button onClick={handleLogout}>
        🚪 Logout
      </button>

      <hr />

      <h2>Uploaded Notes</h2>

      {notes.length === 0 ? (
        <p>No notes uploaded yet.</p>
      ) : (
        notes.map((note) => (
          <div key={note.id}>
            <h3>{note.title}</h3>

            <p>
              <strong>Subject:</strong> {note.subject}
            </p>

            <p>
              <strong>File:</strong> {note.file_url}
            </p>

            <p>
              <strong>AI Summary:</strong>
            </p>

            <p>
              {note.summary || "No summary available yet"}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;