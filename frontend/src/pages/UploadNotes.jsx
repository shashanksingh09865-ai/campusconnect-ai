import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadNotes() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/notes",
        {
          title: title,
          subject: subject,
          file_url: fileUrl
        }
      );

      console.log(response.data);

      alert("Note Uploaded Successfully!");

      setTitle("");
      setSubject("");
      setFileUrl("");

    } catch (error) {
      console.log(error);

      alert("Upload Failed!");
    }
  };

  return (
    <div>
      <h1>Upload Notes</h1>
    <button onClick={() => navigate("/dashboard")}>
  ⬅ Back to Dashboard
</button>

<br />
<br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Enter File URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Upload Note
        </button>
      </form>
    </div>
  );
}

export default UploadNotes;