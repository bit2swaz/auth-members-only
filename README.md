# Members Only Message Board

A private messaging board built with the PERN stack (PostgreSQL, Express, EJS, Node.js) where only members can see who wrote what.

## Features

- User authentication (register, login, logout)
- Member-only content
- Admin privileges
- Create, read, update, and delete messages
- Responsive design with Bootstrap

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: EJS templates, Bootstrap 5
- **Database**: PostgreSQL
- **Authentication**: Express-session, bcrypt

## Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/auth-members-only.git
   cd auth-members-only
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```

4. Set up PostgreSQL database
   - Create a database named `members_only_db`
   - Run the schema.sql script:
   ```
   psql -U postgres -d members_only_db -f models/schema.sql
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Visit `http://localhost:3000` in your browser

## Default Admin Account

- Email: admin@example.com
- Password: admin123

## Project Structure

```
├── app.js                 # Main application file
├── controllers/           # Route controllers
├── models/                # Database models
│   ├── db.js              # Database connection
│   ├── schema.sql         # SQL schema
│   ├── user.js            # User model
│   └── message.js         # Message model
├── public/                # Static assets
│   ├── css/               # CSS files
│   └── js/                # JavaScript files
├── routes/                # Express routes
├── views/                 # EJS templates
│   ├── auth/              # Authentication views
│   ├── layouts/           # Layout templates
│   ├── messages/          # Message views
│   └── partials/          # Reusable view partials
└── .env                   # Environment variables
```