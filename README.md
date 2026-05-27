# SyncSpace

SyncSpace is a smart resource booking platform designed to simplify the reservation of shared spaces such as discussion rooms, labs, meeting rooms, and other facilities.

The system provides real-time availability checking, conflict prevention, booking management, email notifications, and automated reminders to ensure a smooth booking experience.

---

## Features

### User Authentication
- Secure user registration and login using Supabase Authentication.
- Protected routes for authenticated users.
- Session-based access control.

### Resource Booking
- Browse available resources.
- View resource details and booking guidelines.
- Select date and time slots through an interactive scheduler.
- Prevent overlapping bookings automatically.

### Smart Conflict Detection
- Real-time validation of booking requests.
- Blocks double bookings and overlapping reservations.
- Past dates and expired time slots cannot be selected.

### Booking Management
- View all upcoming bookings.
- Cancel active bookings.
- Automatically hides bookings that have already ended.

### Email Notifications
- Booking confirmation email sent immediately after successful booking.
- Includes booking details such as title, resource, location, start time, and end time.
- Direct link to manage bookings.

### Automated Reminder System
- Scheduled reminder emails are sent before a booking begins.
- Implemented using a protected reminder API route.
- Supports automated execution through Vercel Cron Jobs.
- Local development remains unaffected if cron jobs are not configured.

### Dashboard
- Personalized dashboard for each user.
- Displays upcoming bookings.
- Provides booking statistics and quick navigation.

### Modern User Interface
- Responsive design for desktop and mobile devices.
- Animated transitions and

---

## Technology Stack

Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS

Backend
- Next.js API Routes

Database & Authentication
- Supabase

Email Service
- Resend

Deployment
- Vercel

---

## System Architecture

User
↓
Next.js Frontend
↓
Supabase Authentication
↓
Supabase Database
↓
Booking Validation & Conflict Detection
↓
Email Notifications (Resend)
↓
Vercel Cron (Reminder Service)

---

## Local Installation

### Prerequisites

- Node.js 18 or above
- npm
- Supabase project
- Resend account

### Clone Repository

git clone <repository-url>

cd syncspace-booking-system

### Install Dependencies

npm install

### Environment Variables

Create a file named:

.env.local

Add the following variables:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

RESEND_API_KEY=your_resend_api_key

CRON_SECRET=your_secret_key

NEXT_PUBLIC_APP_URL=http://localhost:3000

### Start Development Server

npm run dev

Open:

http://localhost:3000

---

## Supabase Setup

Create the following tables:

### profiles

id (uuid)

full_name (text)

email (text)

### resources

id (uuid)

name (text)

description (text)

location (text)

type (text)

capacity (integer)

### bookings

id (uuid)

user_id (uuid)

resource_id (uuid)

title (text)

start_time (timestamp)

end_time (timestamp)

status (text)

reminder_sent_at (timestamp)

---

## Production Deployment

### Deploy to Vercel

1. Push project to GitHub

2. Create a Vercel account

3. Import the GitHub repository

4. Configure Environment Variables

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

RESEND_API_KEY

CRON_SECRET

NEXT_PUBLIC_APP_URL

Set:

NEXT_PUBLIC_APP_URL

to your deployed domain.

Example:

https://syncspace.vercel.app

5. Deploy

Vercel will automatically build and host the application.

---

## Reminder Email Service

The reminder system is implemented using a protected API endpoint.

Route:

/api/send-reminders

The endpoint checks for bookings that are scheduled to start within the configured reminder window.

A reminder email is sent only if:

- Booking status is confirmed
- Reminder has not already been sent
- Booking start time falls within the reminder window

After a successful reminder:

reminder_sent_at

is updated to prevent duplicate reminders.

---

## Vercel Cron Configuration

Create:

vercel.json

Example:

{
  "crons": [
    {
      "path": "/api/send-reminders",
      "schedule": "*/5 * * * *"
    }
  ]
}

This executes the reminder service every 5 minutes.

---

## Future Improvements

- Resource image uploads
- Admin management panel
- Multi-level approval workflow
- Calendar integration
- Multiple reminder schedules (24h, 1h, 30min)
- SMS notifications
- Analytics dashboard
- Waitlist system

---

## Author

Kirrtanaa Nallathamby

Bachelor of Artificial Intelligence

Universiti Malaya

2026

---

## License

This project was developed for educational and portfolio purposes.