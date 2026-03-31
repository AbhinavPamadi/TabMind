"use client";
import { useEffect, useState } from "react";

function timeAgo(date) {
  const diffMs = new Date() - new Date(date);

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m ago`;
  }
}

export default function Dashboard() {
  const [focusCategory, setFocusCategory] = useState("Coding");
  const [focusMode, setFocusMode] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = async () => {
    const t = await fetch("http://localhost:5000/tabs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tabsData = await t.json();

    const a = await fetch("http://localhost:5000/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const analyticsData = await a.json();

    setTabs(tabsData);
    setFiltered(tabsData);
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    } else {
      fetchData();
    }
  }, []);

  // 🔍 Search + Filter
  useEffect(() => {
    let result = tabs;

    result = result.filter(
      (t) =>
        !t.url.includes("localhost:3000") && !t.url.includes("127.0.0.1:3000"),
    );

    if (search) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.intent.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "All") {
      result = result.filter((t) => t.category === category);
    }

    setFiltered(result);
  }, [search, category, tabs]);

  const markDone = async (id) => {
    await fetch(`http://localhost:5000/tabs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: true }),
    });
    fetchData();
  };

  const deleteTab = async (id) => {
    await fetch(`http://localhost:5000/tabs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const updateGroup = async (id, group) => {
    await fetch(`http://localhost:5000/tabs/${id}/group`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ group }),
    });

    fetchData();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const categories = [
    "All",
    "Study",
    "Coding",
    "Entertainment",
    "Shopping",
    "General",
  ];

  const grouped = {};

  filtered.forEach((tab) => {
    const g = tab.group || "General";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(tab);
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: 200,
          background: "#111",
          color: "#fff",
          padding: 20,
        }}
      >
        <h1 style={{ fontSize: 18 }}>TabMind</h1>

        {categories.map((cat) => (
          <div
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              margin: "10px 0",
              cursor: "pointer",
              color: category === cat ? "#00ffcc" : "#ccc",
            }}
          >
            {cat}
          </div>
        ))}

        <button onClick={logout} style={{ marginTop: 20 }}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
        <select
          value={focusCategory}
          onChange={(e) => setFocusCategory(e.target.value)}
          style={{ marginBottom: 10 }}
        >
          <option>Coding</option>
          <option>Study</option>
          <option>Project</option>
          <option>General</option>
        </select>
        <button
          onClick={() => {
            const newState = !focusMode;
            setFocusMode(newState);
            console.log("Sending focus mode:", newState, focusCategory);
            window.postMessage(
              {
                type: "FOCUS_MODE",
                enabled: newState,
                category: focusCategory,
              },
              "*",
            );
          }}
        >
          Focus Mode: {focusMode ? "ON" : "OFF"}
        </button>
        {/* SEARCH */}
        <input
          placeholder="Search tabs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        {/* ANALYTICS */}
        <div
          style={{
            display: "flex",
            gap: 15,
            marginBottom: 25,
          }}
        >
          <Card title="Total" value={analytics.total} />
          <Card title="Completed" value={analytics.completed} />
          <Card
            title="Productivity"
            value={`${analytics.productivity?.toFixed(1)}%`}
          />
        </div>

        {/* TAB CARDS */}
        {Object.keys(grouped).map((group) => (
          <div key={group}>
            <h2>{group}</h2>

            {grouped[group].map((tab) => (
              <div
                key={tab._id}
                style={{
                  background: "#fff",
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <a
                  href={tab.url}
                  target="_blank"
                  style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#333",
                    textDecoration: "none",
                  }}
                >
                  {tab.title}
                </a>

                <p style={{ color: "#666", marginTop: 5 }}>{tab.intent}</p>

                <span
                  style={{
                    background: "#eef2ff",
                    color: "#4f46e5",
                    padding: "4px 8px",
                    borderRadius: 6,
                    fontSize: 15,
                  }}
                >
                  {tab.category}
                </span>

                <span
                  style={{
                    marginLeft: 10,
                    padding: "4px 8px",
                    borderRadius: 5,
                    background: tab.completed ? "#d4edda" : "#fff3cd",
                    color: tab.completed ? "green" : "orange",
                    fontSize: 15,
                  }}
                >
                  {tab.completed ? "Done" : "Active"}
                </span>

                <select
                  value={tab.group || "General"}
                  onChange={(e) => updateGroup(tab._id, e.target.value)}
                >
                  <option>General</option>
                  <option>Assignment</option>
                  <option>Project</option>
                  <option>Random</option>
                </select>

                {tab.createdAt && (
                  <p
                    style={{
                      color:
                        new Date() - new Date(tab.createdAt) >
                        2 * 24 * 60 * 60 * 1000
                          ? "red"
                          : "#666",
                      fontSize: 15,
                      marginTop: 5,
                    }}
                  >
                    Opened {timeAgo(tab.createdAt)}
                  </p>
                )}

                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => markDone(tab._id)}
                    style={{
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 6,
                    }}
                  >
                    Done
                  </button>

                  <button
                    onClick={() => deleteTab(tab._id)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 6,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 📊 Small Card Component
function Card({ title, value }) {
  const styles = {
    Total: { bg: "#eef2ff", color: "#4f46e5" },
    Completed: { bg: "#dcfce7", color: "#16a34a" },
    Productivity: { bg: "#fef3c7", color: "#d97706" },
  };

  const style = styles[title] || styles.Total;

  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        padding: 20,
        borderRadius: 14,
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 15,
        border: "1px solid #eee",
      }}
    >
      {/* ICON */}
      <div
        style={{
          background: style.bg,
          color: style.color,
          fontSize: 22,
          padding: 12,
          borderRadius: 10,
        }}
      >
        {style.icon}
      </div>

      {/* TEXT */}
      <div>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{title}</p>
        <h2 style={{ margin: 0 }}>{value}</h2>
      </div>
    </div>
  );
}
