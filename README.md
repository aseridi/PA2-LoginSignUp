# ICSI 418Y PA4

Full-stack login, signup, projects, project memberships and user stories with React, Express and MongoDB.

## Tech stack

React (Vite), Node/Express, MongoDB Atlas.

## Structure

```
PA2-LoginSignUp/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Backlog.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ManageMembers.jsx
│   │   │   ├── ProjectList.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── routes/
│   │   ├── projects.js
│   │   ├── stories.js
│   │   └── users.js
│   ├── .env.example
│   ├── db.js
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Setup

Install dependencies in both apps:

```bash
cd client && npm install
cd ../server && npm install
```

Create `server/.env`:

```
MONGO_URI=your_atlas_connection_string
```

Add your IP under Network Access in MongoDB Atlas.

## Running

Two terminals.

Frontend:

```bash
cd client
npm run dev
```

Runs at http://localhost:5173

Backend:

```bash
cd server
node server.js
```

Runs at http://localhost:9000

## API

| Method | Endpoint | Body | Success | Errors |
|--------|----------|------|---------|--------|
| POST | `/signup` | `f_name`, `l_name`, `username`, `password` | 201 | 400, 409, 500 |
| POST | `/login` | `username`, `password` | 200 | 400, 401, 500 |
| GET | `/users` | | 200 | 500 |
| POST | `/projects` | `name`, `description`, `status`, `project_lead_id` | 201 | 400, 409, 500 |
| GET | `/projects` | | 200 | 500 |
| GET | `/projects/:projectId/members` | | 200 | 400, 404, 500 |
| POST | `/projects/:projectId/members` | `user_id` | 201 | 400, 404, 409, 500 |
| DELETE | `/projects/:projectId/members/:userId` | | 200 | 400, 403, 404, 409, 500 |
| GET | `/projects/:projectId/stories` | | 200 | 400, 404, 500 |
| POST | `/projects/:projectId/stories` | `title`, `description`, `priority`, `assigned_user_id` | 201 | 400, 404, 500 |
| PUT | `/projects/:projectId/stories/:storyId` | `title`, `description`, `priority`, `status`, `assigned_user_id` | 200 | 400, 404, 500 |
| DELETE | `/projects/:projectId/stories/:storyId` | | 200 | 400, 404, 500 |

Project status must be one of `Planning`, `Active`, `Completed`.

Story priority must be one of `High`, `Medium`, `Low`. Story status must be one of `To Do`, `In Progress`, `Done`. New stories always start as `To Do`.

`assigned_user_id` is `null` for Unassigned, or the id of a member of that project.

Removing a member returns 403 if they are the project lead, and 409 if they still have any stories assigned in that project (including Done). Reassign, unassign or delete those stories first.

## Data model

Database `pa2`.

`users`:

```js
{
  _id: ObjectId,
  f_name: String,
  l_name: String,
  username: String,
  password: String
}
```

`projects`:

```js
{
  _id: ObjectId,
  name: String,
  description: String,
  status: String,
  project_lead_id: ObjectId
}
```

`memberships`:

```js
{
  _id: ObjectId,
  project_id: ObjectId,
  user_id: ObjectId
}
```

`UserStories`:

```js
{
  _id: ObjectId,
  project_id: ObjectId,
  title: String,
  description: String,
  priority: String,
  status: String,
  assigned_user_id: ObjectId | null
}
```

## Test data

Create the test data through the app:

1. Sign up at least 3 users.
2. Create 2 projects with different leads.
3. In Manage Projects, add a non-lead member to one project only.
4. In Backlog, create at least 5 stories across both projects. Use all three priorities, assign some and leave some Unassigned.
5. Edit stories so that all three statuses (`To Do`, `In Progress`, `Done`) appear.

Passwords are stored as plaintext, per the scope of this assignment. A production system would store a hash and compare hashes at login.