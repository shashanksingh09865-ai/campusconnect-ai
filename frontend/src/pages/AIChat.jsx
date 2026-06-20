import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AIChat() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/ask-ai",
        {
          question: question,
        }
      );

      setAnswer(response.data.answer);

    } catch (error) {
      console.log(error);

      alert("AI Request Failed!");
    }
  };

  return (
    <div>
      <h1>CampusConnect AI Chat</h1>

      <button onClick={() => navigate("/dashboard")}>
        ⬅ Back to Dashboard
      </button>

      <br />
      <br />

      <form onSubmit={handleAsk}>
        <input
          type="text"
          placeholder="Ask anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Ask AI
        </button>
      </form>

      <br />

      <h3>Answer:</h3>

      <p>{answer}</p>
    </div>
  );
}

export default AIChat;