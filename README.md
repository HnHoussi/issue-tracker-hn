# Issue Tracker Project

A full-featured **Issue Tracker** web application built with **Next.js 15**, **Prisma**, and **TypeScript**, developed as part of Mosh Hamedani's Course.

## Features

* Create, read, update, and delete (CRUD) issues
* Assign issues to users
* Filter issues by status (Open, In Progress, Closed)
* Sort issues by creation date or other fields
* Pagination for large issue lists
* Authentication using **NextAuth.js**
* Responsive design with **Radix UI** components

## Tech Stack

* **Frontend:** Next.js 15, TypeScript, React, Radix UI
* **Backend:** Next.js API routes, Prisma ORM
* **Database:** MySQL
* **Authentication:** NextAuth.js
* **Styling:** Tailwind CSS & Radix UI Themes

## Setup & Installation

1. **Clone the repository:**

```bash
git clone https://github.com/HnHoussi/issue-tracker-hn.git
cd issue-tracker
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up the database:**

```bash
npx prisma migrate dev --name init
```

4. **Run the development server:**

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

## Usage

* **View Issues:** `/issues/list`
* **View Issue Details:** `/issues/[id]`
* **Create/Edit/Delete Issues:** Accessible after login

Filter issues by status, sort them, or navigate pages using pagination.

## License

This project is created for **educational purposes** as part of Mosh Hamedani's course.
