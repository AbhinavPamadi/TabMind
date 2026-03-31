// ===== LISTEN FROM WEBSITE =====
window.addEventListener("message", (event) => {
  if (event.data.type === "SAVE_TOKEN") {
    chrome.runtime.sendMessage({
      type: "SAVE_TOKEN",
      token: event.data.token,
    });

    console.log("Token sent to extension");
  }
});

window.addEventListener("message", (event) => {
  if (event.data.type === "FOCUS_MODE") {
    console.log("Content received focus:", event.data);
    chrome.runtime.sendMessage({
      type: "FOCUS_MODE",
      enabled: event.data.enabled,
      category: event.data.category,
    });
  }
});

// ===== SEND TAB DATA =====
chrome.runtime.sendMessage({ type: "GET_TOKEN" }, async (response) => {
  const token = response?.token;

  if (!token) {
    console.log("No token found");
    return;
  }

  if (
    window.location.href.includes("localhost:3000") ||
    window.location.href.includes("127.0.0.1:3000")
  ) {
    console.log("Skipping TabMind tab");
    return;
  }

  await fetch("http://localhost:5000/tabs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: window.location.href,
      title: document.title,
      intent: "Auto captured",
    }),
  });

  console.log("Tab saved:", document.title);
});
