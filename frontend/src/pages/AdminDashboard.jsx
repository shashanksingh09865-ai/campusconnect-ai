import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";

export default function AdminDashboard() {

  const navigate = useNavigate();

  // ============================
  // State Variables
  // ============================

  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [stats, setStats] = useState({
    total_users: 0,
    total_notes: 0,
    total_notices: 0,
    total_admins: 0,
    total_summaries: 0,
  });

  // ============================
  // Fetch Users
  // ============================

  const fetchUsers = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await api.get("/users");

      setUsers(response.data);

    } catch (error) {
    handleApiError(error);
}
  };

  // ============================
  // Fetch Notes
  // ============================

  const fetchNotes = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await api.get("/users");

      setNotes(response.data);

    } catch (error) {
    handleApiError(error);
}
  };

  // ============================
  // Fetch Dashboard Stats
  // ============================

  const fetchStats = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await api.get("/users");

      setStats(response.data);

    } catch (error) {
    handleApiError(error);
}
  };

  // ============================
  // Fetch Notices
  // ============================

  const fetchNotices = async () => {

    try {

      const response = await api.get(
        `/admin/notices`
      );

      setNotices(response.data);

    } catch (error) {
    handleApiError(error);
}
  };

  // ============================
  // Publish Notice
  // ============================

  const addNotice = async () => {

    try {

      const token = localStorage.getItem("token");

      await api.post("/notices", {
        title,
        content,
      });

      toast.success("Notice Published Successfully!");

      setTitle("");
      setContent("");

      fetchNotices();
      fetchStats();

    } catch (error) {
    handleApiError(error);
}
    
  };

  // ============================
  // Delete Notice
  // ============================

  const deleteNotice = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await api.delete(`/notices/${id}`);

      toast.success("Notice deleted successfully!");

      fetchNotices();
      fetchStats();

    } catch (error) {
    handleApiError(error);
}
  };

  // ============================
  // Delete User
  // ============================

  const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("token");

      await api.delete(`/users/${id}`);
      fetchUsers();
      fetchStats();

    }catch (error) {
    handleApiError(error);
}
  };

  // ============================
  // Load Dashboard
  // ============================

  useEffect(() => {
  Promise.all([
    fetchUsers(),
    fetchNotes(),
    fetchStats(),
    fetchNotices(),
  ]).finally(() => {
    setLoading(false);
  });
}, []);

  // ============================
  // Logout
  // ============================

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };
  if (loading) {
  return <Loading />;
}

  return (
        <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-purple-700 text-white p-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          👑 Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          <div className="bg-blue-100 rounded-xl p-5 text-center shadow">
            <h3 className="font-semibold">👥 Users</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {stats.total_users}
            </p>
          </div>

          <div className="bg-green-100 rounded-xl p-5 text-center shadow">
            <h3 className="font-semibold">📚 Notes</h3>
            <p className="text-3xl font-bold text-green-700 mt-2">
              {stats.total_notes}
            </p>
          </div>

          <div className="bg-purple-100 rounded-xl p-5 text-center shadow">
            <h3 className="font-semibold">👑 Admins</h3>
            <p className="text-3xl font-bold text-purple-700 mt-2">
              {stats.total_admins}
            </p>
          </div>

          <div className="bg-yellow-100 rounded-xl p-5 text-center shadow">
            <h3 className="font-semibold">📢 Notices</h3>
            <p className="text-3xl font-bold text-yellow-700 mt-2">
              {stats.total_notices}
            </p>
          </div>

          <div className="bg-red-100 rounded-xl p-5 text-center shadow">
            <h3 className="font-semibold">🤖 AI Summaries</h3>
            <p className="text-3xl font-bold text-red-700 mt-2">
              {stats.total_summaries}
            </p>
          </div>

        </div>

        {/* Users */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            👥 Registered Users
          </h2>

          <table className="w-full border">

            <thead className="bg-gray-200">

              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Action</th>
              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.id}>

                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>

                  <td className="border p-2">

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            📚 Uploaded Notes
          </h2>

          <table className="w-full border">

            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Summary</th>
              </tr>
            </thead>

            <tbody>

              {notes.map((note) => (

                <tr key={note.id}>

                  <td className="border p-2">{note.id}</td>

                  <td className="border p-2">{note.title}</td>

                  <td className="border p-2">{note.subject}</td>

                  <td className="border p-2">
                    {note.summary
                      ? note.summary.substring(0, 100)
                      : "No Summary"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Publish Notice */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            📢 Publish Notice
          </h2>

          <input
            type="text"
            placeholder="Notice Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border w-full p-3 rounded mb-4"
          />

          <textarea
            rows="5"
            placeholder="Notice Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border w-full p-3 rounded mb-4"
          />

          <button
            onClick={addNotice}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            ➕ Publish Notice
          </button>

        </div>

        {/* Notices */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            📢 All Notices
          </h2>

          {notices.length === 0 ? (

            <p>No notices available.</p>

          ) : (

            notices.map((notice) => (

              <div
                key={notice.id}
                className="border rounded-lg p-4 mb-4"
              >

                <h3 className="text-xl font-bold">
                  {notice.title}
                </h3>

                <p className="mt-2 whitespace-pre-wrap">
                  {notice.content}
                </p>

                <button
                  onClick={() => deleteNotice(notice.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-4"
                >
                  🗑 Delete Notice
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}
