import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
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

    const formData = new FormData();
    formData.append("file", file);

    try {
  setLoading(true);

  const response = await api.post("/upload", formData);

  console.log("Upload Response:", response.data);

  toast.success("✅ PDF uploaded successfully!");

  navigate("/dashboard");

} catch (error) {

  console.error("Upload Error:", error);

  if (error.response) {
    console.log("Server Response:", error.response.data);
    toast.error(
      error.response.data?.error ||
      error.response.data?.detail ||
      "Upload failed."
    );
  } else if (error.request) {
    toast.error("Server connection error.");
  } else {
    toast.error("Upload failed.");
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