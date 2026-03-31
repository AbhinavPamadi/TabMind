"use client";

export default function FocusWarning() {
  const goBack = () => {
    window.history.back();
  };

  const continueAnyway = () => {
    const url = prompt("Enter the site you want to visit:");
    if (url) {
      window.location.href = url.startsWith("http") ? url : "https://" + url;
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#111",
        color: "#fff",
      }}
    >
      <h1>🚫 Focus Mode Active</h1>
      <p>You are trying to open a distracting site.</p>

      <div style={{ marginTop: 20 }}>
        <button onClick={goBack} style={{ marginRight: 10 }}>
          Go Back
        </button>

        <button onClick={continueAnyway}>Continue Anyway</button>
      </div>
    </div>
  );
}
