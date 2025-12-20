# Collaborative Task Manager — Frontend

## Overview

This repository contains the **frontend application** for the Collaborative Task Manager.

It is a **production-ready web client** built with **Next.js (Pages Router) and TypeScript**, providing:

- Secure authentication flow
- Task management UI (CRUD)
- Real-time collaboration
- Responsive dashboard experience

The frontend communicates with the backend REST API and Socket.io server using **HttpOnly cookie-based authentication**.

---

## Tech Stack

- Next.js (Pages Router)
- TypeScript
- Tailwind CSS
- TanStack React Query
- React Hook Form + Zod
- Axios
- Socket.io Client

---

## Architecture

The frontend follows a **modular, hook-driven architecture**:

`# Collaborative Task Manager — Frontend

## Overview

This repository contains the **frontend application** for the Collaborative Task Manager.

It is a **production-ready web client** built with **Next.js (Pages Router) and TypeScript**, providing:

- Secure authentication flow
- Task management UI (CRUD)
- Real-time collaboration
- Responsive dashboard experience

The frontend communicates with the backend REST API and Socket.io server using **HttpOnly cookie-based authentication**.

---

## Tech Stack

- Next.js (Pages Router)
- TypeScript
- Tailwind CSS
- TanStack React Query
- React Hook Form + Zod
- Axios
- Socket.io Client

---

## Architecture

The frontend follows a **modular, hook-driven architecture**:

src/
├── pages/ # Route-based pages (login, dashboard, profile)
├── components/ # Reusable UI components
├── hooks/ # Data fetching & state logic
├── lib/ # API, auth, socket utilities
└── middleware.ts # Route protection


### Design Principles

- Pages handle layout and composition
- Hooks manage data fetching and caching
- Components are stateless and reusable
- Forms are validated with shared schemas
- Real-time updates are event-driven

---

## Authentication & Security

- JWT-based authentication using **HttpOnly cookies**
- No tokens stored in localStorage
- Protected routes via Next.js middleware
- Automatic redirect logic:
  - Unauthenticated users → login page
  - Authenticated users → dashboard

  ## ⚠️ Technical Note: Cross-Domain Cookie Restrictions

This project implements **HttpOnly, Secure, and SameSite=None** JWT cookies, which is the industry standard for secure authentication. 

However, users may experience session persistence issues in the live demo due to **Modern Browser Privacy Restrictions** (specifically Chrome's "Tracking Protection"):

1. **Public Suffix Restriction:** Because the frontend is on `.vercel.app` and the backend is on `.onrender.com`, browsers treat these as completely different "sites."
2. **Third-Party Cookie Block:** Modern browsers are phasing out cookies sent between different top-level domains to prevent tracking.
3. **The Solution:** In a true production environment, this is resolved by using a **unified Custom Domain** (e.g., `app.domain.com` and `api.domain.com`). 

**The codebase reflects production-grade security logic** and functions perfectly in environments where first-party cookie isolation is maintained.

### Auth Features

- Login & Registration
- Logout
- Profile view & update
- Session persistence via refresh tokens

---

## Task Management

### Task Capabilities

- Create, view, update, and delete tasks
- Tasks include:
  - Title
  - Description
  - Due date
  - Priority
  - Status
  - Creator
  - Assignee

### Role-Based UI Rules

- **Creator**
  - Edit all fields
  - Reassign task
  - Delete task
- **Assignee**
  - View all task details
  - Update status only
- **Other users**
  - Read-only view

These rules are enforced both in UI and backend.

---

## Real-Time Features (Socket.io)

The frontend connects to the Socket.io server after authentication.

### Live Updates

- Task list updates instantly when:
  - A task is created
  - A task is updated
  - A task is deleted

### Assignment Notifications

- When a task is assigned, the assignee receives an **instant in-app alert**
- Notifications are handled client-side via Socket.io events

---

## Dashboard Features

- Multiple task views:
  - Assigned to me
  - Created by me
  - Overdue tasks
- Filtering:
  - Status
  - Priority
- Sorting:
  - Due date (ascending / descending)
- Fully responsive layout for mobile and desktop

---

## Forms & Validation

- All forms built using **React Hook Form**
- Validation powered by **Zod**
- Inline error messages
- Server-side errors are surfaced clearly in UI

---

## Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_ACCESS_SECRET=secret
NEXT_PUBLIC_API_URL2=http://localhost:5000/api

Setup Instructions

Clone Repository

git clone https://github.com/ajuajmal123/collaborative-task-manager-frontend.git
cd collaborative-task-manager-frontend


Install Dependencies

npm install


Run Development Server

npm run dev


Frontend runs at:

http://localhost:3000

Integration Notes

Backend must be running for full functionality

Socket.io requires backend server to be reachable

Cookies must be enabled in the browser

Trade-offs & Assumptions

React Query used instead of global state libraries

Notifications are session-based (non-persistent)

UI permissions mirror backend authorization rules

Author

Muhammed Ajmal K K
Full-Stack Developer
GitHub: https://github.com/ajuajmal123
