# Fashion E-commerce Platform

A modern e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Responsive design inspired by modern fashion e-commerce platforms
- User authentication and authorization
- Product catalog with categories and filters
- Shopping cart functionality
- Order management system
- User profiles and order history
- Admin dashboard for product and order management

## Tech Stack

- Frontend: React.js, Redux, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- Payment Processing: Stripe (to be implemented)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```
3. Create a .env file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── backend/           # Backend API and server code
├── frontend/          # React frontend application
├── public/           # Static files
└── package.json      # Project dependencies and scripts
```
