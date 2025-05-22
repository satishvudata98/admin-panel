# Admin Panel

A full-stack web application with a React frontend and a Node.js/Express backend. Users can register, log in, and access protected routes. User data is managed via context on the frontend and persisted in a database via the backend.

## Features

- User registration and login
- User context to store user data (frontend)
- Protected routes (frontend)
- REST API for authentication (backend)
- Simple database configuration (backend)

---

## Project Structure

```
admin-panel/
├── backend/      # Node.js/Express backend
│   ├── config/   # Database config
│   ├── controllers/ # Auth logic
│   ├── routes/   # API routes
│   ├── index.js  # Entry point
│   └── package.json
└── frontend/     # React frontend
    ├── public/
    ├── src/
    ├── package.json
```

---

## Backend Setup (Node.js/Express)

1. Open a terminal and navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your database in `backend/config/db.js` as needed.
4. Start the backend server:
   ```sh
   npm start
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000) by default.

---

## Frontend Setup (React)

1. Open a new terminal and navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm start
   ```
   The app will run on [http://localhost:3000](http://localhost:3000).

---

## Running Tests (Frontend)

From the `frontend` directory, run:
```sh
npm test
```

---

## Building for Production (Frontend)

From the `frontend` directory, run:
```sh
npm run build
```
The build will be output to the `frontend/build` folder.

---

## Deployment

- Deploy the backend and frontend separately as needed.
- Ensure the frontend is configured to use the correct backend API URL (see API calls in frontend code).

---

## License

MIT
