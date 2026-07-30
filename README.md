# 📚 BoiBondhu (বইবন্ধু) — Full Stack Book Buy, Sell & Exchange Platform

[![Live Site](https://img.shields.io/badge/Live_Site-boibondhu--online--platform.vercel.app-000000?style=for-the-badge&logo=vercel)](https://boibondhu-online-platform.vercel.app)
[![API Server](https://img.shields.io/badge/API_Server-boibondhu--server.vercel.app-0284C7?style=for-the-badge&logo=express)](https://boibondhu-server.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.0-000000?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)

---

## 🎯 Project Purpose & Overview

In many regions, avid readers and students face significant challenges in accessing affordable books, finding rare academic titles, or reselling/exchanging their used books. Physical second-hand bookstores are often geographically limited, and general e-commerce platforms lack specialized features for book enthusiasts.

**BoiBondhu (বইবন্ধু)** was created to bridge this gap by offering a dedicated, accessible, and community-driven online platform where users can:
- **Buy & Sell Books:** Effortlessly list second-hand or new books at customizable prices.
- **Exchange & Share:** Facilitate book swapping to promote sustainable reading habits and reduce educational costs.
- **Discover Titles:** Search through a rich database filtered by category, price range, and book condition.
- **Manage Inventory:** Provide sellers with an intuitive dashboard to keep track of their listings and analytics.

By leveraging a modern full-stack architecture, **BoiBondhu** delivers a seamless, fast, and secure marketplace experience for book lovers, students, and educators alike.

---

## 🔗 Live Links

- 🌐 **Frontend Application:** [https://boibondhu-online-platform.vercel.app](https://boibondhu-online-platform.vercel.app)
- ⚡ **Backend API Server:** [https://boibondhu-server.vercel.app](https://boibondhu-server.vercel.app)

---

## 🌟 Key Features

### 👤 Authentication & Security
- **JWT-Based Authentication:** Secure registration, login, and token handling.
- **Protected Routes:** Dedicated access control for adding and managing listed items (`/items/add`, `/items/manage`).
- **Demo Login:** One-click auto-fill credentials for quick evaluator access.

### 📖 Book Marketplace & Discovery
- **Hero & Landing Page:** Features 7+ structured sections including Hero CTA, Featured Books, Categories, How It Works, Stats, Testimonials, and FAQ.
- **Explore & Filter:** Multi-field filtering (Category, Price Range, Condition), search bar, and dynamic sorting options.
- **Details Page:** Comprehensive book info, pricing, specifications, ratings, and image gallery.
- **Skeleton Loaders:** Smooth UI experience with skeleton states while fetching data.

### 📊 Item Management & Analytics
- **Add Item (`/items/add`):** Clean form interface to list new books with cover image integration.
- **Manage Items (`/items/manage`):** Interactive dashboard allowing users to view, track, and delete their listed books.
- **Data Visualization:** Integrated **Recharts** for visualizing inventory analytics and stats.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Visualization:** Recharts
- **Icons:** Lucide React

### **Backend**
- **Runtime:** Node.js & Express.js
- **Language:** TypeScript
- **Database:** MongoDB Native Driver (Atlas)
- **Authentication:** JWT (JSON Web Tokens) & HTTP-Only Cookies
- **Deployment Platform:** Vercel (Serverless Edge Deployment)

---

## 📂 Repository Architecture

```text
boibondhu/
├── client/                      # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                 # App Router (protected & public routes)
│   │   ├── components/          # Reusable UI & Skeleton components
│   │   └── lib/                 # API client utilities and types
│   ├── public/                  # Static assets
│   └── tsconfig.json
│
└── server/                      # Express Backend Server
    ├── src/
    │   ├── lib/                 # MongoDB connection & client pooling
    │   ├── middleware/          # Auth & DB connection readiness middleware
    │   └── routes/              # Express API endpoints (/api/books, /api/auth)
    └── package.json