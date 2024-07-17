import React from "react";

const Home: React.FC = () => {
  return (
    <main
      style={{
        padding: "20px",
        border: "1px solid black",
        margin: "20px",
        backgroundColor: "#f0f0f0", // Light gray background
        color: "#333", // Dark gray text
      }}
    >
      <h1>Welcome to the Astral Logbook ✨</h1>
      <p>This is our beta landing page.</p>
      <a href="/register" style={{ color: "#009900", textDecoration: "underline" }}>
        Register a new entry →
      </a>
    </main>
  );
};

export default Home;
