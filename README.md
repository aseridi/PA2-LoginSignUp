# ICSI 418Y PA3

Full-stack login, signup, projects and project memberships with React, Express and MongoDB.

## Tech stack

React (Vite), Node/Express, MongoDB Atlas.

## Structure

```
PA2-LoginSignUp/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
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
| DELETE | `/projects/:projectId/members/:userId` | | 200 | 400, 403, 404, 500 |

Status must be one of `Planning`, `Active`, `Completed`.

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

Passwords are stored as plaintext, per the scope of this assignment. A production system would store a hash and compare hashes at login.