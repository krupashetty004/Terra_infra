# TaskFlow (Terra Infra)

TaskFlow is a simple team task board for Terra Infra.

Admins can create tasks, assign them to teammates, and remove tasks when needed. Users can open their assigned tasks, update status, and mark work complete. Everything updates in real time through Firebase, so the whole team sees the latest state without refreshing.

## Features

- Google sign-in (quick login, no local password management)
- Role-based experience (Admin or User)
- Admin portal to create, assign, track, and delete tasks
- User portal to view task details and update task status
- Real-time task sync using Firestore listeners

## Tech Stack

- Next.js 14 (Pages Router)
- React + TypeScript
- Tailwind CSS
- Firebase Authentication (Google Provider)
- Firebase Firestore

## Project Structure

```text
src/
  pages/
    index.tsx       Login screen (role selection)
    admin.tsx       Admin dashboard (create/assign/delete)
    user.tsx        User dashboard (view/update tasks)
    _app.tsx        Global app wrapper with AuthProvider
  styles/
    globals.css     Global styles
  AuthContext.tsx   Auth state + login/logout + role handling
  firebase.ts       Firebase initialization

firebase-applet-config.json   Firebase project config
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with:
  - Google Authentication enabled
  - Firestore Database enabled

### 1) Clone and install

```bash
git clone https://github.com/krupashetty004/Terra_infra.git
cd Terra_infra
npm install
```

### 2) Add Firebase config

Create `firebase-applet-config.json` in the project root:

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

### 3) Run locally

```bash
npm run dev
```

Open: http://localhost:3000

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm start` — run production server
- `npm run lint` — run lint checks

## Firestore Collections

```text
users/{uid}
  uid, email, displayName, role

tasks/{taskId}
  title, description, assignedTo, assignedToEmail, status, createdAt
```

## Important Notes

- Right now, users choose their role at sign-in. For production, restrict admin role assignment.
- Add Firestore security rules so users can only access their own tasks.
- Keep build files out of git (`.next/` is ignored).
