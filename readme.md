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

## Installation

### Prerequisites

- Node.js 18+
- MongoDB
- Stripe account

### Clone the Repository

```bash
git clone https://github.com/your-repo/meal-api.git
cd meal-api
Install Dependencies
bash
npm install
Environment Variables
Create a .env file in the project root:

ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meal-app
JWT_SECRET=your_jwt_secret_here
NEXT_PUBLIC_STRIPE_PK=your_stripe_pk
Start the Server
Development:

bash
npm run dev
Production:

bash
npm run build
npm start
API Endpoints
Base URL
https://your-api-domain.com/api/v1

Authentication
Endpoint	Method	Description	Required Role
/auth/login	POST	User login	Any
/auth/refresh-token	POST	Refresh token	Any
/auth/change-password	POST	Change password	Any
Users
Endpoint	Method	Description
/users/create-customer	POST	Create customer (Admin)
/users/create-provider	POST	Create provider (Admin)
/users/me	GET	Get current user
Recipes
Endpoint	Method	Description
/recipes	POST	Create recipe (Provider)
/recipes	GET	List recipes
/recipes/:id	GET	Get recipe details
Example Requests
Create Recipe
http
POST /api/v1/recipes
Authorization: Bearer <provider_token>
Content-Type: multipart/form-data

Form Data:
- file: <image_file>
- data: {
  "recipeName": "Grilled Salmon",
  "description": "Healthy salmon dish...",
  "ingredients": [...],
  "nutritionValues": {...}
}
Get Recipe
http
GET /api/v1/recipes/507f1f77bcf86cd799439011
Authorization: Bearer <user_token>
Database Models
User Schema
typescript
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
Recipe Schema
typescript
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
Key Functionality
Meal Planning
Users can create weekly/monthly meal plans

Automatically checks recipe availability

Tracks nutritional information

Order Processing
Real-time order status updates

Provider order management dashboard

Automated stock reduction

Contributing
Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Notes
All requests and responses use JSON format

Replace http://localhost:5000 with your deployed URL in production

Authentication is required for most endpoints

License
This project is licensed under the MIT License - see the LICENSE file for details.


This README includes:

1. **Consistent Formatting**: Using proper Markdown syntax throughout
2. **Complete Structure**: All sections from your example template
3. **Detailed API Documentation**: With example requests
4. **Technical Specifications**: Database models and key functionality
5. **Visual Elements**: Demo screenshot and badges
6. **Clear Instructions**: For installation and contribution

The document is ready to use and maintains the same sophisticated style as your example while being tailored for your meal API project.
```
