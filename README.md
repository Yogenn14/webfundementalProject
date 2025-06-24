# 💚 DermaGo – Donation Web Platform

DermaGo is a lightweight and responsive donation web app built using **HTML, CSS, and JavaScript** on the frontend, and **Node.js + Express** on the backend. The platform allows users to explore donation campaigns, make contributions, and manage their account via a simple and modern interface.

---

## Pages & Features

- **Home Page (index.html)** – Intro and navigation
- **Login & Signup** – Secure user authentication
- **Donation Page** – Two-column layout with form and info
- **Donation Tracker** – See past contributions
- **Blog Page** – Informative content section
- **Dashboard** – Personalized donor view after login

All pages are **mobile-friendly** and **responsive**, built using **Flexbox** and **Media Queries** to ensure smooth performance across devices.

---

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL (via XAMPP or Laragon)
- **API Communication:** Fetch API using `POST` and `GET` methods
- **Styling:** Flexbox layout, media queries for responsive design
- **Mock Payment:** Stripe sandbox integration

---

## Server Setup Guide

1. Install [Node.js](https://nodejs.org/en)
2. Import the `donation_db.sql` into MySQL (XAMPP/Laragon)
3. Navigate to server folder:
   cd project_web/server
 Install dependencies:

1.npm install
Start server:
2. node . or node index.js

mysql db table 
users Table:
id	name	email	password_hash	created_at

donations Table:
id	user_id	amount	donated_at	email	paymentMethod	type

Contributio
This project was built for a Web Fundamentals course. Feel free to fork or use it as reference for your own academic or personal projects.

Notes
This project uses localStorage to store login session info (lightweight and sufficient for demo/learning purposes).

API keys Stripe should be stored in environment variables and not committed in production!

Developed by
Yogen | Web Fundamentals 2025
