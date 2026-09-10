
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4 py-10">

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4">
            <span className="text-4xl">📄</span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Upload Notes
          </h1>

          <p className="text-blue-100 mt-2">
            Upload your PDF notes and let CampusConnect AI process them
          </p>

        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <div className="text-center mb-6">

            <h2 className="text-2xl font-bold text-gray-800">
              Upload Your PDF
            </h2>

            <p className="text-gray-500 mt-2">
              Select a PDF file from your computer
            </p>

          </div>

          <form onSubmit={handleUpload}>

            {/* File Upload Area */}
            <label
              htmlFor="pdf-upload"
              className="block border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            >

              <div className="text-5xl mb-4">
                📁
              </div>

              <p className="text-lg font-semibold text-gray-700">
                {file ? file.name : "Choose a PDF file"}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Click here to browse your files
              </p>

              <p className="text-xs text-gray-400 mt-3">
                Only PDF files are supported
              </p>

              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />

            </label>

            {/* Selected File */}
            {file && (
              <div className="mt-5 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">

                <div className="text-2xl">
                  📄
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {file.name}
                  </p>

                  <p className="text-xs text-green-600 mt-1">
                    PDF selected successfully
                  </p>
                </div>

              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Uploading..." : "📤 Upload PDF"}
            </button>

          </form>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full mt-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition"
          >
            ⬅ Back to Dashboard
          </button>

        </div>

        {/* Information */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <p className="text-sm text-blue-100">
            💡 Upload your study notes in PDF format to use CampusConnect AI
            features.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-sm mt-6">
          © 2026 CampusConnect AI
        </p>

      </div>

    </div>
  );
}

export default UploadNotes;

