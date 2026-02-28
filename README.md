Shortly---smart URL Shortener

A full-stack URL shortening platform with click analytics.

This app allows users to:

Create short URLs

Track click analytics (IP, user agent, timestamps, etc.)

View performance metrics


🚀 Features
Core Features

🔐 Authentication (Credentials-based)

🔗 Short URL generation

📈 Click tracking

📊 Analytics dashboard

🔄 Automatic click count increment

🗃 Click logging (IP + User Agent)

Analytics

Total clicks per link

Click history

Basic traffic insights

Per-link performance breakdown

🧠 AI Analytics Summary (Planned / In Progress)

A lightweight LLM integration that:

Summarizes link performance

Explains traffic patterns

Highlights unusual spikes

Generates plain-English analytics reports

Example output:

“This link received most of its traffic between 8PM–11PM and appears to have primarily desktop users. Traffic increased significantly compared to the previous period.”

🛠 Tech Stack
Frontend

Next.js (App Router)

React

TypeScript

Tailwind CSS

Backend

Next.js Server Actions / API Routes

Prisma ORM

PostgreSQL (Neon)

Authentication

NextAuth (JWT strategy)

Credentials provider

Argon2 password hashing

Deployment

Netlify


🧩 Database Schema (Simplified)
User

--id

--email

--username

--password

--createdAt

Link

--id

--shortUrl

--longUrl

--clickCount

--createdAt

--userId

Click

--id

--linkId

--ip

--userAgent

--referer (optional)

--country (optional)

--createdAt

🔄 How Redirects Work

User visits /abc123

Server:

Increments clickCount

Logs a Click record

User is redirected to the longUrl

All click updates and logging occur inside a Prisma transaction to ensure data consistency.

📊 Analytics System

Click data collected:

IP address

User Agent

Timestamp

(Optional) Referer

(Optional) Country

Analytics calculations:

Total clicks

Clicks per day

User agent breakdown

Traffic trends