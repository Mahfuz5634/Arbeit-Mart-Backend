# Arbeit Mart Backend

This is the backend server for the **Arbeit Mart** website. It is built using **Node.js**, **Express**, and **MongoDB**.

---

## 🛠️ How to Setup

Follow these steps to run the server on your computer:

### 1. Install Node.js
Make sure you have Node.js installed on your computer.

### 2. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env` in the root folder of the project. Add the following lines and fill in your values:

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SALT_ROUND=10
```

---

## 🚀 How to Run

### Development Mode (with auto-restart)
To run the server and automatically restart when you make changes:
```bash
npm run dev
```

### Production Mode
To start the server normally:
```bash
npm start
```

---

## 📁 Project Structure

*   **`src/server.js`** - Entry point of the application. Connects to the database and starts the server.
*   **`src/app.js`** - Sets up Express, middleware (like CORS), and route endpoints.
*   **`src/modules/`** - Contains route files and controller logic.
*   **`src/models/`** - Database schemas and models.
*   **`src/db/`** - Connection setup for MongoDB database.
*   **`src/config/`** - Reads configuration from environment variables.

---

## 🌐 API Endpoints

Here are the main routes you can use:

### Authentication
*   `POST /api/auth/register` - Create a new user account
*   `POST /api/auth/login` - Log in to an account

### Products
*   `GET /api/product` - Get all products
*   `POST /api/product` - Add a new product
*   `GET /api/product/:id` - Get a single product details
*   `PUT /api/product/:id` - Update product details
*   `DELETE /api/product/:id` - Delete a product

### Coupons
*   `GET /api/coupon` - Get all coupons
*   `POST /api/coupon` - Add a new coupon
*   `PUT /api/coupon/:id` - Update a coupon
*   `DELETE /api/coupon/:id` - Delete a coupon
*   `POST /api/coupon/validate` - Check if a coupon is valid

### Shipping
*   `GET /api/shipping` - Get all shipping zones
*   `POST /api/shipping` - Add a new shipping zone
*   `PUT /api/shipping/:id` - Update shipping zone details
*   `DELETE /api/shipping/:id` - Delete a shipping zone

### Orders
*   `GET /api/order` - Get all orders
*   `POST /api/order` - Create a new order
*   `PUT /api/order/:id/status` - Update the status of an order (e.g., pending, delivered)

### Admin
*   `GET /api/admin/dashboard` - Get database statistics and overview for the admin dashboard
