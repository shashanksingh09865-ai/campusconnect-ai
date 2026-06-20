import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadNotes from "./pages/UploadNotes";
import AIChat from "./pages/AIChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-notes" element={<UploadNotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;