import { useEffect, useState } from "react";
import api from "../api";import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";

function Dashboard() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]); 
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 4;
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stats, setStats] = useState({
  total_notes: 0,
  summarized_notes: 0,
  latest_upload: null,
});

  useEffect(() => {
     const token = localStorage.getItem("token");
   

    if (!token) {
      navigate("/");
      return;
    }

    Promise.all([
  fetchNotes(),
  fetchStats(),
  fetchNotices(),
]).finally(() => {
  setLoading(false);
});
  }, [navigate]);

  useEffect(() => {

    const timer = setTimeout(() => {

        setDebouncedSearch(search);

    }, 500);

    return () => clearTimeout(timer);

}, [search]);

useEffect(() => {
  if (debouncedSearch === "") {
    fetchNotes();
  } else {
    searchNotes(debouncedSearch);
  }
}, [debouncedSearch]);
   
  const searchNotes = async (text) => {

  console.log("Searching:", text);

  try {

    const response = await api.get(
      `/notes`
    );

    console.log("Search Result:", response.data);

    setNotes(response.data);

  } catch (error) {
  handleApiError(error);
}
};
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/notes");

      setNotes(response.data);
      setStats({
        total_notes: response.data.length,
        summarized_notes: response.data.filter((note) => note.summarized).length,
        latest_upload: response.data.length > 0 ? new Date(Math.max(...response.data.map((note) => new Date(note.created_at)))) : null,
      });
    } catch (error) {
  handleApiError(error);
}
  };
  const fetchStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/notes");

    
setStats(
  response.data || {
    total_notes: 0,
    summarized_notes: 0,
    latest_upload: null,
  }
);
  } catch (error) {
  handleApiError(error);
}
};

const fetchNotices = async () => {
  try {
    const response = await api.get(
      `/notices`
    );

    setNotices(response.data);

  } catch (error) {
  handleApiError(error);
}
};

  const deleteNote = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/notes/${id}`);
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully!");
      fetchNotes();
      fetchStats();
    } catch (error) {
  handleApiError(error);
}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

 const filteredNotes = notes
  .filter((note) => {
    const matchesSubject =
      subjectFilter === "All" ||
      note.subject === subjectFilter;

    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.subject.toLowerCase().includes(search.toLowerCase());

    return matchesSubject && matchesSearch;
  })
  .sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.created_at) - new Date(a.created_at);

    if (sortBy === "oldest")
      return new Date(a.created_at) - new Date(b.created_at);

    if (sortBy === "az")
      return a.title.localeCompare(b.title);

    if (sortBy === "za")
      return b.title.localeCompare(a.title);

    return 0;
  });

const indexOfLastNote = currentPage * notesPerPage;
const indexOfFirstNote = indexOfLastNote - notesPerPage;

const currentNotes = filteredNotes.slice(
  indexOfFirstNote,
  indexOfLastNote
);

const totalPages = Math.ceil(
  filteredNotes.length / notesPerPage
);
  console.log("Notes:", notes);
console.log("Filtered Notes:", filteredNotes);
if (loading) {
  return <Loading />;
}
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          <div>
            <h1 className="text-3xl font-bold">
              🎓 CampusConnect AI
            </h1>

            <p className="text-blue-100">
              AI Powered Student Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold">
              📚 Total Notes
            </h2>

            <p className="text-4xl font-bold text-blue-700 mt-3">
              {stats?.total_notes || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold">
              🤖 AI Summaries
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-3">
              {stats?.summarized_notes || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold">
              🔍 Search Notes
            </h2>

            <input
              type="text"
              placeholder="Search title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-4 w-full border rounded-lg p-2"
            />

            <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="mt-4 w-full border rounded-lg p-2"
>
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
  <option value="az">Title A-Z</option>
  <option value="za">Title Z-A</option>
</select>

<select
  value={subjectFilter}
  onChange={(e) => setSubjectFilter(e.target.value)}
  className="mt-4 w-full border rounded-lg p-2"
>
  <option value="All">All Subjects</option>

  {[...new Set(notes.map((note) => note.subject))].map((subject) => (
    <option key={subject} value={subject}>
      {subject}
    </option>
  ))}
</select>

          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate("/upload-notes")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            📄 Upload Notes
          </button>

          <button
            onClick={() => navigate("/ai-chat")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
          >
            🤖 AI Chat
          </button>
          <button
  onClick={() => navigate("/profile")}
  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg"
>
  👤 My Profile
</button>
        </div>

                {/* Notes */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl shadow p-8 text-center">
              <h2 className="text-xl font-semibold">
                No notes found.
              </h2>
            </div>
          ) : (
            currentNotes.map((note) => {
  const pdfUrl = note.file_url.startsWith("http")
    ? note.file_url
    : `${import.meta.env.VITE_API_URL}/${note.file_url.replace(/\\/g, "/")}`;

              return (
                <div
                  key={note.id}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold">
                    {note.title}
                  </h2>

                  <p className="text-blue-600 mt-2">
                    📖 {note.subject}
                  </p>

                  <div className="mt-5">
                    <h3 className="font-semibold mb-2">
                      AI Summary
                    </h3>

                    <div className="bg-gray-50 border rounded-lg p-3 whitespace-pre-wrap">
                      {note.summary || "No summary available."}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      📄 Open PDF
                    </a>

                    <a
                      href={pdfUrl}
                      download
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                      ⬇ Download
                    </a>

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">

  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
    className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    ⬅ Previous
  </button>

  <span className="font-semibold">
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages || totalPages === 0}
    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    Next ➡
  </button>

</div>

        {/* 📢 Latest Notices */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">

          <h2 className="text-2xl font-bold mb-4">
            📢 Latest Notices
          </h2>

          {notices.length === 0 ? (

            <p className="text-gray-500">
              No notices available.
            </p>

          ) : (

            notices.map((notice) => (

              <div
                key={notice.id}
                className="border rounded-lg p-4 mb-4"
              >

                <h3 className="text-xl font-bold">
                  {notice.title}
                </h3>

                <p className="mt-2 text-gray-700">
                  {notice.content}
                </p>

              </div>

            ))

          )}

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;