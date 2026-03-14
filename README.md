# TaskFlow — Terra Infra Task Management App

A real-time task management web app built for the Terra Infra team. Admins can create, assign, and delete tasks; users can track and update the status of their own tasks — all synced live via Firestore.

---

## What it does

- **Google Sign-In** — log in with a Google account, no password needed
- **Role-based access** — choose Admin or User when signing in; each role is redirected to its own portal
- **Admin Portal** — create tasks, assign them to registered users, monitor all task statuses, and delete tasks
- **User Portal** — see your assigned tasks, expand task details, and update status (Pending → In Progress → Completed)
- **Live updates** — Firestore real-time listeners keep everything in sync without a page refresh

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Auth | Firebase Authentication (Google) |
| Database | Firebase Firestore |

---

## Project Structure

```
src/
  pages/
    index.tsx       # Login page — choose Admin or User role
    admin.tsx       # Admin Portal — create, assign, delete tasks
    user.tsx        # User Portal — view & update assigned tasks
    _app.tsx        # App wrapper with AuthProvider
  styles/
    globals.css     # Global Tailwind styles
  AuthContext.tsx   # Auth state, login/logout logic
  firebase.ts       # Firebase app initialisation
firebase-applet-config.json   # Firebase project config
```

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
   The app will be available at `http://localhost:3000`

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
| `npm run dev` | Start local development server (port 3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Notes

- Users self-select their role at sign-in. For production, consider restricting admin role assignment to a trusted flow.
- Configure Firebase Security Rules so users can only read/update tasks assigned to them.
- The `.next/` build output folder is git-ignored and should never be committed.
