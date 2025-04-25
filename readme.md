# 🍽️ Meal Backend API

A modern API built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Mongoose](https://mongoosejs.com), [TypeScript](https://www.typescript.org) and ❤️.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Key Functionality](#key-functionality)
- [Contributing](#contributing)
- [Notes](#notes)
- [License](#license)

## About The Project

This API allows users to manage meal plans, recipes, and user orders in a comprehensive meal delivery system. Users can create meal plans, manage recipes, place orders, and track deliveries.

## Features

✅ Create and manage user accounts (Customer, Provider, Admin)  
✅ Comprehensive recipe management with nutrition details  
✅ Weekly and monthly meal planning  
✅ Order processing with status tracking  
✅ Review system for recipes and providers  
✅ Stripe payment integration  
✅ Sophisticated error handling

## Demo

![App Screenshot](https://i.ibb.co.com/bgfNBY72/6bfc4432-5bea-402d-a0cc-1c6858dec581.png)

👉 [Live Demo](https://meal-backend-nine.vercel.app/)

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Payments:** Stripe
- **Dev Tools:** TypeScript, Morgan
- **Deployment:** Vercel

## 📦 Installation

### Clone the Repository

```bash
git clone https://github.com/your-repo/meal-api.git
cd meal-api
```

### Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meal-app
JWT_SECRET=your_jwt_secret_here
NEXT_PUBLIC_STRIPE_PK=your_stripe_pk
```

---

## 🚀 Start the Server

### Development:

```bash
npm run dev
```

### Production:

```bash
npm run build
npm start
```

---

## 📡 API Endpoints

### Base URL

```url
https://your-api-domain.com/api/v1
```

---

### 🔐 Authentication

| Endpoint              | Method | Description     | Role |
| --------------------- | ------ | --------------- | ---- |
| /auth/login           | POST   | User login      | Any  |
| /auth/refresh-token   | POST   | Refresh token   | Any  |
| /auth/change-password | POST   | Change password | Any  |

---

### 👥 Users

| Endpoint               | Method | Description             |
| ---------------------- | ------ | ----------------------- |
| /users/create-customer | POST   | Create customer (Admin) |
| /users/create-provider | POST   | Create provider (Admin) |
| /users/me              | GET    | Get current user        |

---

### 🍽️ Recipes

| Endpoint     | Method | Description        |
| ------------ | ------ | ------------------ |
| /recipes     | POST   | Create recipe      |
| /recipes     | GET    | List all recipes   |
| /recipes/:id | GET    | Get recipe details |

---

## 📦 Example Requests

### Create Recipe

```http
POST /api/v1/recipes
Authorization: Bearer <provider_token>
Content-Type: multipart/form-data
```

**Form Data:**

- `file`: `<image_file>`
- `data`:

```json
{
  "recipeName": "Grilled Salmon",
  "description": "Healthy salmon dish...",
  "ingredients": [...],
  "nutritionValues": {...}
}
```

---

### Get Recipe

```http
GET /api/v1/recipes/507f1f77bcf86cd799439011
Authorization: Bearer <user_token>
```

---

## 🧬 Database Models

### 🧑‍💻 User Schema

```ts
interface IUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  role: 'customer' | 'provider' | 'admin';
  profileImg?: string;
}
```

---

### 🍽️ Recipe Schema

```ts
interface IRecipe {
  recipeName: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
  }[];
  nutritionValues: {
    calories: string;
    protein: string;
    // ...other fields
  };
  createdBy: mongoose.Types.ObjectId;
}
```

---

## 🧠 Key Functionality

### 🍱 Meal Planning

- Weekly/monthly plans
- Recipe availability checks
- Nutrition tracking

### 📦 Order Processing

- Real-time order status updates
- Provider order management dashboard
- Automated stock reduction

---

## 🤝 Contributing

1. **Fork the repository**

2. **Create your feature branch**

```bash
git checkout -b feature/AmazingFeature
```

3. **Commit your changes**

```bash
git commit -m "Add some AmazingFeature"
```

4. **Push to the branch**

```bash
git push origin feature/AmazingFeature
```

5. **Open a Pull Request**

---

## 📝 Notes

- All requests and responses use **JSON format**
- Replace `http://localhost:5000` with your deployed URL in production
- Authentication is required for most endpoints

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
