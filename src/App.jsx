import { useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    // Main container with global styles
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {!isAuthenticated ? (
        <Login onLogin={(value) => setIsAuthenticated(value)} />
      ) : (
        // Show Dashboard component when user is authenticated
        <Dashboard />
      )}
    </div>
  );
}

export default App;
