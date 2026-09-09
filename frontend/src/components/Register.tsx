import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        console.log("Registration failed with status:", response.status);
        throw new Error("Registration failed");
      })
      .then(() => {
        alert("Account created successfully. Please log in.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
        alert("Registration failed. Please try again.");
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <UserPlus size={28} color="white" />
        </div>

        <h1 className="login-title">Create account</h1>
        <p className="login-subtitle">
          Sign up to start managing your tasks.
        </p>

        <div className="login-field">
          <label className="login-label">Name</label>
          <input
            type="text"
            className="login-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="login-field">
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login-field">
          <label className="login-label">Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-field">
          <label className="login-label">Confirm password</label>
          <input
            type="password"
            className="login-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRegister();
              }
            }}
          />
        </div>

        <button className="login-btn" onClick={handleRegister}>
          <UserPlus size={16} />
          Sign Up
        </button>

        <p className="login-subtitle">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
