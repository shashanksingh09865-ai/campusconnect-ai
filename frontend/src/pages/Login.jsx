import { useState } from "react";
import api from "../api";import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
  const response = await api.post(
    `/login`,
    {
      email: email,
      password: password,
    }
  );

      console.log("========== LOGIN DEBUG ==========");
      console.log("Full Response:", response);
      console.log("Response Data:", response.data);
      console.log("Access Token:", response.data.access_token);

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      console.log(
        "Saved Token:",
        localStorage.getItem("token")
      );
      console.log("=================================");

      if (!response.data.access_token) {
        toast.error("Token not received from server.");
        return;
      }

      toast.success("Login Successful!");

      navigate("/dashboard");

    } catch (error) {
      console.log("Login Error:", error);

      if (error.response) {
        console.log("Server Response:", error.response.data);
      }

      toast.error("Login Failed!");
    }
  };

  return (
    <div>
      <h2>CampusConnect AI Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;