import { useEffect, useState } from "react";
import api from "../api";import { useNavigate } from "react-router-dom";
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
      const response =await api.get("/me", {
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
    return <h2>Loading Profile...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>👤 My Profile</h1>

      <br />

      <h3>Name:</h3>
      <p>{user.name}</p>

      <h3>Email:</h3>
      <p>{user.email}</p>

      <h3>Role:</h3>
      <p>{user.role}</p>

      <br />

      <button onClick={() => navigate("/dashboard")}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default Profile;