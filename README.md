# Cafeteria Menu API

A REST API for managing a cafeteria menu, built with Node.js, Express, and SQLite.

## Prerequisites

- Node.js installed

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/menu` - Retrieve all menu items
- `GET /api/menu/:id` - Retrieve a specific menu item
- `POST /api/menu` - Create a new menu item
  - Body: `{ "name": "Coffee", "price": 2.50, "description": "...", "category": "Drinks" }`
- `PUT /api/menu/:id` - Update a menu item
- `DELETE /api/menu/:id` - Delete a menu item
