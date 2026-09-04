import { useState } from "react";
import api from "../api";import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function AIChat() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
    const askAI = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post("/chat", {
  message: question,
});
     setAnswer(response.data.ai);
    } catch (error) {
      console.error(error);
      alert("Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-green-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-8 py-5">

          <div>
            <h1 className="text-3xl font-bold">
              🤖 CampusConnect AI Chat
            </h1>

            <p className="text-green-100">
              Ask anything about your notes
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            ⬅ Dashboard
          </button>

        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto p-8">

        <div className="bg-white rounded-xl shadow-md p-6">

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask AI anything about your uploaded notes..."
            rows="6"
            className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            onClick={askAI}
            disabled={loading}
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Thinking..." : "🤖 Ask AI"}
          </button>

        </div>

        {answer && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">

            <h2 className="text-2xl font-bold mb-4">
              AI Response
            </h2>

            <div className="bg-gray-50 border rounded-lg p-4 whitespace-pre-wrap">
              {answer}
            </div>

          </div>
        )}

      </div>

      <Footer />

    </div>
  );
  }

export default AIChat;