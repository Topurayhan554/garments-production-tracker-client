# 🏭 Garments Production Tracker

A comprehensive full-stack web application for managing garment production orders, tracking order status, and streamlining the manufacturing workflow from order placement to delivery.
## 🌐 Live Links

- **Frontend**: [https://garments-production-trac-2075a.web.app/](https://garments-production-trac-2075a.web.app/)
- **Backend API**: [https://garments-production-tracker-server.vercel.app/](https://garments-production-tracker-server.vercel.app/)

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Why These Technologies?](#why-these-technologies)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 📖 About The Project

**Garments Production Tracker** is a full-stack web application designed to streamline the entire garment manufacturing workflow. The system provides role-based access control for three user types: **Admins**, **Managers**, and **Buyers**, each with specific permissions and responsibilities.

### 🎯 Problem Statement

Traditional garment production tracking relies on manual processes, spreadsheets, and disconnected systems, leading to:

- Order tracking inefficiencies
- Communication gaps between stakeholders
- Delayed production updates
- Manual inventory management
- Limited visibility into production status

### 💡 Solution

Our system provides:

- **Real-time order tracking** from placement to delivery
- **Role-based dashboards** for different stakeholders
- **Automated status updates** throughout the production lifecycle
- **Centralized communication** between buyers, managers, and admins
- **Production analytics** and reporting

## ✨ Key Features

### 👥 Role-Based Access Control

#### 🔴 Admin Features

- Manage all users (Create, Read, Update, Delete)
- View and manage all orders across the system
- Access comprehensive analytics and reports
- Monitor system-wide performance metrics
- Manage user roles and permissions

#### 🟢 Manager Features

- Add and manage product catalog
- Approve or reject pending orders
- Update production status (Confirmed → In Production → Quality Check → Packed → Shipped)
- Track approved orders in real-time
- Manage inventory and product details
- View production statistics

#### 🔵 Buyer Features

- Browse product catalog with advanced filtering
- Place orders with detailed specifications
- Track order status in real-time
- View order history and details
- Cancel pending orders
- Receive status notifications

### 🛒 Order Management System

- **Order Lifecycle**: Pending → Approved/Rejected → Confirmed → In Production → Quality Check → Packed → In Transit → Out for Delivery → Delivered
- **Bulk Operations**: Update multiple orders simultaneously
- **Order Cancellation**: Buyers can cancel orders before approval
- **Order Tracking**: Real-time status updates with timestamps

### 📊 Dashboard & Analytics

- **Personalized Dashboards**: Role-specific overview and quick actions
- **Real-time Statistics**: Order counts, revenue, production metrics
- **Recent Activity Feed**: Live updates on order changes
- **Visual Data Representation**: Charts and graphs for key metrics

### 🎨 Modern UI/UX

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Toggle between light and dark themes
- **Smooth Animations**: Framer Motion for elegant transitions
- **Loading States**: Skeleton screens and spinners for better UX
- **Toast Notifications**: Real-time feedback for user actions

### 🔐 Security Features

- **Firebase Authentication**: Secure user authentication
- **JWT Tokens**: Secure API communication
- **Role-Based Authorization**: Protected routes and API endpoints
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized inputs to prevent attacks

## 🛠 Tech Stack

### Frontend

| Technology          | Version | Purpose                                            |
| ------------------- | ------- | -------------------------------------------------- |
| **React**           | 18.3.1  | UI library for building component-based interfaces |
| **Vite**            | 6.0.1   | Fast build tool and dev server                     |
| **React Router**    | 7.1.1   | Client-side routing and navigation                 |
| **Tailwind CSS**    | 4.0.0   | Utility-first CSS framework                        |
| **Framer Motion**   | 11.15.0 | Animation library for smooth UI transitions        |
| **React Icons**     | 5.4.0   | Icon library for consistent iconography            |
| **React Hook Form** | 7.54.2  | Form state management and validation               |
| **TanStack Query**  | 5.62.14 | Data fetching, caching, and synchronization        |
| **Axios**           | 1.7.9   | HTTP client for API requests                       |
| **React Toastify**  | 10.0.6  | Toast notifications for user feedback              |

### Backend

| Technology         | Version | Purpose                                  |
| ------------------ | ------- | ---------------------------------------- |
| **Node.js**        | 20.x    | JavaScript runtime environment           |
| **Express.js**     | 4.21.2  | Web application framework                |
| **MongoDB**        | 6.12.0  | NoSQL database for flexible data storage |
| **Firebase Admin** | 13.0.1  | User authentication and management       |
| **JWT**            | 9.0.2   | Secure token-based authentication        |
| **CORS**           | 2.8.5   | Cross-Origin Resource Sharing            |
| **dotenv**         | 16.4.7  | Environment variable management          |

### Deployment

- **Frontend Hosting**: Firebase Hosting
- **Backend Hosting**: Vercel
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: Firebase Authentication

## 🤔 Why These Technologies?

### Frontend Choices

#### React + Vite

- **Why React?**: Component-based architecture, large ecosystem, excellent community support
- **Why Vite?**: Lightning-fast hot module replacement (HMR), optimized build times, better developer experience than Create React App

#### Tailwind CSS v4

- **Utility-First**: Rapid UI development without leaving HTML
- **Consistency**: Design system built-in with standardized spacing, colors
- **Performance**: PurgeCSS removes unused styles automatically
- **Dark Mode**: Built-in dark mode support with minimal configuration

#### Framer Motion

- **Smooth Animations**: Hardware-accelerated animations for 60fps
- **Declarative API**: Easy-to-use animation syntax
- **Gesture Support**: Built-in drag, hover, tap interactions
- **Layout Animations**: Automatic layout transition animations

#### TanStack Query

- **Smart Caching**: Reduces unnecessary API calls
- **Automatic Refetching**: Keeps data fresh automatically
- **Optimistic Updates**: Instant UI updates before server confirmation
- **Error Handling**: Built-in retry logic and error boundaries

### Backend Choices

#### Express.js + MongoDB

- **Express**: Minimal, flexible, and unopinionated framework
- **MongoDB**: Schema flexibility for evolving data models
- **Scalability**: Horizontal scaling for growing datasets
- **JSON Format**: Native support for JSON documents

#### Firebase Authentication

- **Security**: Industry-standard authentication protocols
- **Social Login**: Easy integration with Google, Facebook, etc.
- **Token Management**: Automatic token refresh and validation
- **Email Verification**: Built-in email verification flow

### Deployment Choices

#### Firebase Hosting (Frontend)

- **CDN**: Global content delivery network for fast loading
- **SSL**: Free SSL certificates for HTTPS
- **Easy Deploy**: Simple CLI deployment with `firebase deploy`
- **Rollback**: Easy version rollback if needed

#### Vercel (Backend)

- **Serverless**: Automatic scaling based on traffic
- **Zero Config**: Minimal configuration required
- **Fast Deployments**: Quick deployment with GitHub integration
- **Free Tier**: Generous free tier for small projects

#### MongoDB Atlas (Database)

- **Managed Service**: No server maintenance required
- **Backups**: Automatic daily backups
- **Global Clusters**: Deploy close to users for low latency
- **Free Tier**: 512MB free cluster for development

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Firebase** account (for authentication)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
# Clone frontend
git clone https://github.com/Topurayhan554/garments-tracker-frontend.git
cd garments-tracker-frontend

# Clone backend
git clone https://github.com/Topurayhan554/garments-tracker-backend.git
cd garments-tracker-backend
```

#### 2. Install Frontend Dependencies

```bash
cd garments-tracker-frontend
npm install
```

#### 3. Install Backend Dependencies

```bash
cd garments-tracker-backend
npm install
```

#### 4. Set Up Environment Variables

**Frontend** (.env):

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

**Backend** (.env):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/garments-tracker
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/garments-tracker

JWT_SECRET=your_jwt_secret_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### 5. Run the Application

**Start Backend Server:**

```bash
cd garments-tracker-backend
npm run dev
# Server runs on http://localhost:3000
```

**Start Frontend Development Server:**

```bash
cd garments-tracker-frontend
npm run dev
# App runs on http://localhost:5173
```

## 🌍 Environment Variables

### Frontend Variables

| Variable                            | Description             | Example                   |
| ----------------------------------- | ----------------------- | ------------------------- |
| `VITE_API_URL`                      | Backend API base URL    | `http://localhost:3000`   |
| `VITE_FIREBASE_API_KEY`             | Firebase API key        | `AIzaSyC...`              |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain    | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID     | `project-id`              |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket | `project.appspot.com`     |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID   | `123456789`               |
| `VITE_FIREBASE_APP_ID`              | Firebase app ID         | `1:123:web:abc`           |

### Backend Variables

| Variable                | Description                    | Example                          |
| ----------------------- | ------------------------------ | -------------------------------- |
| `PORT`                  | Server port                    | `3000`                           |
| `MONGODB_URI`           | MongoDB connection string      | `mongodb://localhost:27017/db`   |
| `JWT_SECRET`            | JWT signing secret             | `your-secret-key`                |
| `FIREBASE_PROJECT_ID`   | Firebase project ID            | `project-id`                     |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | `firebase@project.iam...`        |
| `FIREBASE_PRIVATE_KEY`  | Firebase private key           | `-----BEGIN PRIVATE KEY-----...` |
| `NODE_ENV`              | Environment mode               | `development` or `production`    |
| `CLIENT_URL`            | Frontend URL (for CORS)        | `http://localhost:5173`          |

## 📦 Deployment

### Frontend Deployment (Firebase Hosting)

#### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### 2. Login to Firebase

```bash
firebase login
```

#### 3. Initialize Firebase

```bash
cd garments-tracker-frontend
firebase init

# Select:
# - Hosting
# - Use existing project
# - Public directory: dist
# - Configure as SPA: Yes
# - Set up automatic builds: No
```

#### 4. Update Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://your-backend.vercel.app
VITE_FIREBASE_API_KEY=your_production_firebase_api_key
# ... other production Firebase config
```

#### 5. Build and Deploy

```bash
# Build production bundle
npm run build

# Deploy to Firebase
firebase deploy

# Your app is now live at:
# https://your-project.web.app
```

### Backend Deployment (Vercel)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Create `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 3. Deploy to Vercel

```bash
cd garments-tracker-backend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Your API is now live at:
# https://your-backend.vercel.app
```

#### 4. Add Environment Variables in Vercel

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all variables from `.env`:

- `MONGODB_URI`
- `JWT_SECRET`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `CLIENT_URL`

### Database Setup (MongoDB Atlas)

#### 1. Create MongoDB Atlas Account

Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up

#### 2. Create New Cluster

- Choose Free Tier (M0)
- Select region closest to your users
- Create cluster (takes 3-5 minutes)

#### 3. Configure Database Access

- Database Access → Add New Database User
- Choose password authentication
- Save username and password

#### 4. Configure Network Access

- Network Access → Add IP Address
- Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
- For production, add specific IPs

#### 5. Get Connection String

- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password

#### 6. Update Environment Variables

Update `MONGODB_URI` in both local `.env` and Vercel:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/garments-tracker?retryWrites=true&w=majority
```

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000
Production: https://garments-production-tracker-server.vercel.app
```

### Authentication Endpoints

#### POST `/api/users/login`

Create or login user

```json
Request:
{
  "email": "user@example.com",
  "name": "John Doe",
  "photoURL": "https://...",
  "uid": "firebase_uid"
}

Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "role": "buyer",
    "status": "active"
  }
}
```

#### GET `/api/users/email/:email`

Get user by email

### Product Endpoints

#### GET `/api/products`

Get all products

#### POST `/api/products`

Create new product (Manager only)

```json
{
  "name": "Cotton T-Shirt",
  "category": "T-Shirts",
  "price": 25.99,
  "description": "High-quality cotton...",
  "image": "https://...",
  "stock": 100
}
```

#### PUT `/api/products/:id`

Update product (Manager only)

#### DELETE `/api/products/:id`

Delete product (Manager only)

### Order Endpoints

#### GET `/api/orders`

Get all orders (with optional email filter)

#### GET `/api/orders/pending`

Get pending orders (Manager only)

#### GET `/api/orders/approved`

Get approved orders (Manager only)

#### POST `/api/orders`

Create new order

```json
{
  "productId": "...",
  "productName": "Cotton T-Shirt",
  "quantity": 50,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "total": 1299.5
}
```

#### PATCH `/api/orders/:id/status`

Update order status

```json
{
  "status": "approved" | "rejected" | "confirmed" | "in-production" | "packed" | "shipped"
}
```

#### DELETE `/api/orders/:id`

Cancel order (Buyer only, pending orders)

#### PATCH `/api/orders/bulk-status-update`

Update multiple orders at once

```json
{
  "orderIds": ["id1", "id2", "id3"],
  "newStatus": "in-production"
}
```

### Statistics Endpoints

#### GET `/api/orders/pending-stats`

Get pending orders statistics

#### GET `/api/orders/production-stats`

Get production statistics

## 📁 Project Structure

### Frontend Structure

```
garments-tracker-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx
│   │   ├── ButtonLoader.jsx
│   │   ├── CartDropDown.jsx
│   │   ├── Loading.jsx
│   │   ├── NotFound.jsx
│   │   ├── PageLoader.jsx
│   │   ├── Unauthorized.jsx
│   ├── Context/
│   │   ├── AuthContext.jsx
│   │   ├── AuthProvider.jsx
│   │   └── CartContext.jsx
│   ├── data/
│   │   ├── data.jsx
│   ├── firebase/
│   │   ├── firebase.init.js
│   ├── hooks/
│   │   ├── useAuth.jsx
│   │   ├── useRole.jsx
│   │   └── useAxiosSecure.jsx
│   ├── layouts/
│   │   ├── RootLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   └── SocialLogin/
│   │   ├── CartPage/
│   │   ├── Dashboard/
│   │   │   ├── Admin/
│   │   │   ├── Manager/
│   │   │   ├── Buyer/
│   │   │   ├── Overview/
│   │   │   └── Profile/
│   │   ├── Errors/
│   │   ├── Home/
│   │   │   ├── AboutUs/
│   │   │   ├── ContactUs/
│   │   │   ├── ContactUs/
│   │   │   └── Home/
│   │   ├── Product/
│   │   │   ├── AllProduct.jsx
│   │   │   ├── PlaceOrder.jsx
│   │   │   ├── ProductDetails.jsx
│   │   ├── Shared/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   ├── router/
│   │   ├── AdminRoute.jsx
│   │   ├── ManagerRoute.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── router.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── eslint.config.js
├── firebase.json
├── index.html
├── package-locak.json
├── package.json
├── README.md
└── vite.config.js
```

### Backend Structure

```
garments-tracker-backend/
├── .vercel
├── node_modules
├── .gitignore
├── firebase-adminsdk-json
├── .env
├── index.js
├── package.json
├── vercel.json
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Developed with ❤️ by [Topu Rayhan]

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database
- Firebase team for authentication services
- Vercel for hosting the backend
- All open-source contributors

---

## 📞 Support

For support, email topurayhantipu@gmail.com or create an issue in the repository.

## 🔗 Links

- [Live Demo](https://garments-production-trac-2075a.web.app/)
- [API Documentation](https://garments-production-tracker-server.vercel.app/)
- [Report Bug](https://github.com/Topurayhan554/garments-tracker/issues)
- [Request Feature](https://github.com/Topurayhan554/garments-tracker/issues)

---

⭐ **If you found this project helpful, please consider giving it a star!** ⭐
