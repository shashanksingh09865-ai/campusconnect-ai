
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await api.get("/me", {
        headers: {
          token: token,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load profile.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <h2 className="text-xl font-semibold text-gray-800">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4 py-10">

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl mb-4">
            <span className="text-4xl">👤</span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            My Profile
          </h1>

          <p className="text-blue-100 mt-2">
            View your CampusConnect AI account information
          </p>

        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">

            <h2 className="text-xl font-bold text-white">
              Account Information
            </h2>

            <p className="text-blue-100 text-sm mt-1">
              Your registered account details
            </p>

          </div>

          {/* Details */}
          <div className="p-8 space-y-6">

            {/* Name */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-11 h-11 flex items-center justify-center bg-blue-100 rounded-lg text-xl">
                👤
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="font-semibold text-gray-800">
                  {user.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-11 h-11 flex items-center justify-center bg-indigo-100 rounded-lg text-xl">
                📧
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email Address
                </p>

                <p className="font-semibold text-gray-800 break-all">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-11 h-11 flex items-center justify-center bg-purple-100 rounded-lg text-xl">
                🛡️
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Account Role
                </p>

                <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold capitalize">
                  {user.role}
                </span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-6">

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
            >
              ⬅ Back to Dashboard
            </button>

          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-sm mt-6">
          © 2026 CampusConnect AI
        </p>

      </div>

    </div>
  );
}

export default Profile;
