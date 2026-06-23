# Annamat 🍱

**Save Food. Save Money. Save the Planet.**

A sustainable surplus food marketplace that connects restaurants and hotels with customers to sell surplus food at discounted prices, reducing food waste and making affordable meals accessible.

## Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT (JSON Web Tokens)
- **Deployment:** Vercel (frontend + serverless API)

## Features

- User registration & login (Customer / Restaurant roles)
- Browse surplus food listings with category filters
- Restaurants can add, manage, and toggle food listings
- Customers can place orders
- Order management (pending → confirmed → completed)
- Profile management

## Local Development

1. Clone the repo
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your MongoDB Atlas URI and JWT secret:
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/annamat
   JWT_SECRET=your_secret_key
   ```
4. Start the backend:
   ```
   npm run server
   ```
5. In a separate terminal, start the frontend:
   ```
   npm run dev
   ```
6. Open http://localhost:5173

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in Vercel
3. Add `MONGODB_URI` and `JWT_SECRET` environment variables
4. Deploy — Vercel will automatically build the React app and deploy the API

## Project Structure

```
├── api/           Express server (serverless function)
├── models/        Mongoose models (User, FoodListing, Order)
├── public/        Static HTML
├── src/           React frontend
│   ├── components/  Navbar, FoodCard, ProtectedRoute
│   ├── pages/       Home, Login, Register, Dashboard, AddListing, MyListings, MyOrders, Profile
│   ├── context/     AuthContext (authentication state)
│   └── utils/       API client (Axios)
├── vercel.json    Vercel deployment config
└── package.json
```

## SDG Alignment

- **SDG 12:** Responsible Consumption and Production
- **SDG 2:** Zero Hunger
- **SDG 11:** Sustainable Cities and Communities
- **SDG 13:** Climate Action
