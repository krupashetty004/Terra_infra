# TaskFlow — Terra Infra Task Management App

A simple, real-time task management web app built for the Terra Infra team. Admins can create and assign tasks to users, and users can track and update their own task statuses — all in real time.

---

## What it does

- **Google Sign-In** — users log in with their Google account, no password needed
- **Role-based access** — when signing in, choose Admin or User depending on your role
- **Admin Portal** — create tasks, assign them to specific users, and monitor their progress
- **User Portal** — see your assigned tasks and update their status (Pending → In Progress → Completed)
- **Live updates** — everything syncs in real time via Firestore, no page refresh needed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Firebase Authentication (Google) |
| Database | Firebase Firestore |
| Build Tool | Vite |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A Firebase project with **Google Auth** and **Firestore** enabled

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/krupashetty004/Terra_infra.git
   cd Terra_infra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**

   Create a `firebase-applet-config.json` file in the project root with your Firebase project credentials:
   ```json
   {
     "apiKey": "YOUR_API_KEY",
     "authDomain": "YOUR_PROJECT.firebaseapp.com",
     "projectId": "YOUR_PROJECT_ID",
     "storageBucket": "YOUR_PROJECT.firebasestorage.app",
     "messagingSenderId": "YOUR_SENDER_ID",
     "appId": "YOUR_APP_ID",
     "measurementId": "YOUR_MEASUREMENT_ID",
     "firestoreDatabaseId": "(default)"
   }
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

---

## Firestore Data Structure

```
users/
  {uid}/
    uid, email, displayName, role ("admin" | "user")

tasks/
  {taskId}/
    title, description, assignedTo (uid), assignedToEmail,
    status ("Pending" | "In Progress" | "Completed"), createdAt
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

---

## Notes

- The first person to sign in with a given Google account can self-select their role. For a production setup, consider restricting role assignment to a trusted admin.
- Firebase Security Rules should be configured to ensure users can only read/update tasks assigned to them.
