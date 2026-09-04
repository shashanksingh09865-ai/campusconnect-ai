import { useState } from "react";
import api from "../api";import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function UploadNotes() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
     toast.error("Please select a PDF file.");
      return;
    }


    if (!token) {
      toast.error("Please login first.");
      navigate("/");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await api.post("/notes", formData);

      toast.success("✅ PDF uploaded successfully!");

      console.log(response.data);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data.error || "Upload failed.");
      } else {
        toast.error("Unable to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h1>📄 Upload Notes</h1>

      <button onClick={() => navigate("/dashboard")}>
        ⬅ Back to Dashboard
      </button>

      <br />
      <br />

      <form onSubmit={handleUpload}>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload PDF"}
        </button>

      </form>
    </div>
  );
}

export default UploadNotes;