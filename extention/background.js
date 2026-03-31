// Save token persistently
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SAVE_TOKEN") {
    chrome.storage.local.set({ token: msg.token }, () => {
      console.log("Token saved in chrome.storage");
    });
  }

  if (msg.type === "GET_TOKEN") {
    chrome.storage.local.get(["token"], (result) => {
      sendResponse({ token: result.token });
    });

    return true; // IMPORTANT for async response
  }
});

let focusMode = false;
let allowedCategory = "General";

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "FOCUS_MODE") {
    console.log("BACKGROUND GOT:", msg);
    focusMode = msg.enabled;
    allowedCategory = msg.category;
  }
});

const distractingSites = ["youtube", "instagram", "netflix"];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!focusMode || !tab.url) return;

  const url = tab.url.toLowerCase();

  const isDistraction = distractingSites.some((site) => url.includes(site));

  if (isDistraction) {
    console.log("Redirecting to focus warning:", tab.url);

    chrome.tabs.update(tabId, {
      url: "http://localhost:3000/focus-warning",
    });
  }
});

// ===== AUTO CLOSE =====
let activity = {};

chrome.tabs.onActivated.addListener((info) => {
  activity[info.tabId] = Date.now();
});

setInterval(
  () => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        const last = activity[tab.id] || Date.now();
        const hours = (Date.now() - last) / (1000 * 60 * 60);

        if (hours > 6) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
  },
  1000 * 60 * 30,
);
