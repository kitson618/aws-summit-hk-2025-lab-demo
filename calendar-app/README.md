# Calendar Management Application

A simple client-side web application for calendar management that uses SQLite as a database.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete calendar events
- View calendar in day, week, and month formats
- Responsive design using Bootstrap

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3 (for database)
- JSON Web Tokens (for authentication)
- bcryptjs (for password hashing)

### Frontend
- React
- React Router (for routing)
- FullCalendar (for calendar display)
- Bootstrap (for UI components)
- Axios (for API requests)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd calendar-app/backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd calendar-app/backend
   npm run dev
   ```
   The server will run on http://localhost:5000

2. Start the frontend development server:
   ```
   cd calendar-app/frontend
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/me` - Get current user (protected)

### Events
- `GET /api/events` - Get all events for the logged-in user (protected)
- `GET /api/events/:id` - Get a specific event (protected)
- `POST /api/events` - Create a new event (protected)
- `PUT /api/events/:id` - Update an event (protected)
- `DELETE /api/events/:id` - Delete an event (protected)

## Database Schema

### Users Table
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- email (TEXT, UNIQUE)
- password (TEXT, hashed)
- created_at (TIMESTAMP)

### Events Table
- id (INTEGER, PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- start_date (TEXT)
- end_date (TEXT)
- user_id (INTEGER, FOREIGN KEY)
- created_at (TIMESTAMP)