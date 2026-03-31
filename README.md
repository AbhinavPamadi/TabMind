# TabMind - Smart Tab Manager with Focus Mode

TabMind is a full-stack productivity application with a Chrome extension that helps users **organize, track, and stay focused on their browser tabs**.

Instead of opening dozens of tabs and forgetting why, TabMind lets you:
- Remember intent
- Group tabs
- Track productivity
- Avoid distractions using Focus Mode

---

## Features

### Tab Management
- Save tabs automatically via Chrome extension
- Add intent (why you opened the tab)
- Categorize tabs (Coding, Study, etc.)
- Group tabs (Assignment, Project, Random)

### Smart Focus Mode
- Blocks or redirects distracting websites
- Custom focus categories (Coding, Study, etc.)
- Focus warning page instead of abrupt tab closing

### Smart Reminders
- Shows how long ago a tab was opened
- Displays:
  - Minutes
  - Hours
  - Days
- Highlights stale tabs

### Productivity Dashboard
- Total tabs tracked
- Completed tasks
- Productivity percentage
- Clean card-based UI

### Tab Status System
- Mark tabs as:
  - Active
  - Done
- Helps track progress

### Chrome Extension Integration
- Auto-captures tabs
- Syncs with backend
- Works seamlessly with the web app

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- Inline CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Extension
- Chrome Extension (Manifest V3)
- Content Scripts + Background Scripts

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Shared with extension via messaging

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside the backend folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

##  How to Run Locally

### 1️. Clone Repository
```bash
git clone https://github.com/AbhinavPamadi/tabmind.git
cd tabmind
```

### 2️. Start Backend
```bash
cd backend
npm install
node server.js
```

### 3️. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4️. Load Chrome Extension

1. Open Chrome  
2. Go to: chrome://extensions
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the `extension/` folder

---

## Authentication Flow

1. User logs in via frontend  
2. JWT token is stored in localStorage  
3. Token is sent to extension via `window.postMessage`  
4. Extension stores token in `chrome.storage`  
5. All tab data is sent securely to backend  

---

## Focus Mode Workflow

1. User enables Focus Mode  
2. Selects category (Coding / Study / etc.)  
3. Extension monitors tabs  
4. If a distracting site is opened:
   - Redirects to `/focus-warning` page  
5. User can:
   - Go back  
   - Continue anyway  

---

## Reminder Logic

Tabs show time since opened:
- `5m ago`
- `2h 10m`
- `1d 3h`

Tabs older than 2 days are highlighted.

---

## Productivity Formula

Productivity = (Completed Tabs / Total Tabs) * 100

---

## Key Highlights

- Full-stack application + browser extension
- Real-time tab tracking system
- Context-aware focus mode
- Clean and modern UI
- Practical productivity use-case

---

## Author

**Abhinav Pamadi**

---

## Support

If you like this project, give it a star on GitHub!
