import { LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  onLoginSuccess?: (token: string) => void;
};

function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        console.log("Login failed with status:", response.status);
        throw new Error("Invalid credentials");
      })
      .then((data) => {
        const token = data.token;
        localStorage.setItem("token", token);
        onLoginSuccess?.(token);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("Login failed. Please check your credentials.");
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <line x1="12" y1="12" x2="12" y2="16" />
            <polyline points="10 14 12 16 14 14" />
          </svg>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">
          Please enter your credentials to log in.
        </p>

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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          <LogIn size={16} />
          Log In
        </button>
      </div>
    </div>
  );
}

export default Login;
