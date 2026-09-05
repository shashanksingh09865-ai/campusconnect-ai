import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/register", {
        name: name,
        email: email,
        password: password,
      });

      toast.success("Registration Successful!");

      navigate("/");
    } catch (error) {
      console.log("Register Error:", error);

      if (error.response) {
        console.log("Server Response:", error.response.data);
      }

      toast.error("Registration Failed!");
    }
  };

  return (
    <div>
      <h2>CampusConnect AI Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

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
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;