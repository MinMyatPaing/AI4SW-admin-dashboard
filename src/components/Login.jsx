import { useState } from "react";
import { functions, httpsCallable } from "../firebase.config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState(""); // Store password input
  const [message, setMessage] = useState(""); // Store feedback messages for user
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
  const [loading, setLoading] = useState(false); // Track loading state during authentication

  const handleLogin = async () => {
    // Validate empty password
    if (!password) {
      setMessage("Password cannot be empty.");
      return;
    }
    setLoading(true);

    try {
      // Call Firebase Cloud Function to validate password
      const validatePassword = httpsCallable(functions, "validatePassword");
      const response = await validatePassword({ password });

      // Handle successful authentication
      if (response.data.success) {
        setMessage("Login successful!");
        setLoading(false);
        onLogin(true); // Grant access to the dashboard
      }
    } catch (error) {
      // Handle authentication errors
      console.error("Error:", error);
      setMessage("Invalid password. Please try again.");
      setLoading(false);
    }
  };

  return (
    // Login Screen - shown when user is not authenticated
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
      {/* Password input container with eye icon */}
      <div style={{ position: "relative" }}>
        <input
          type={passwordVisible ? "text" : "password"} // Toggle between text and password type
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        {/* Toggle password visibility button */}
        <div
          onClick={() => setPasswordVisible(!passwordVisible)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </div>
      </div>
      {/* Login button with loading state */}
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          background: !loading ? "blue" : "gray",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: !loading ? "pointer" : "not-allowed",
        }}
        disabled={loading}
      >
        {loading ? (
          <ClipLoader
            color={"blue"}
            loading={loading}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          "Login"
        )}
      </button>
      {/* Error/success message display */}
      <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
    </div>
  );
}
