# Personal Book Manager

A personal reading tracker built with Next.js — sign up, log in, and keep a
private shelf of books with reading status, ratings, tags, and notes.

## Features

- **Authentication** — email/password signup and login, passwords hashed
  with `bcrypt`, sessions issued as a JWT stored in an `httpOnly` cookie.
- **Protected routes** — `proxy.ts` (this project's Next.js version renames
  `middleware.ts` to `proxy.ts`) redirects unauthenticated visitors to
  `/login` and keeps `/login`/`/signup` open to everyone.
- **Book management** — add, edit, and quick-update (favorite, reading
  status) books, all scoped per user and persisted to MongoDB.
- **Dashboard stats** — total books, status breakdown, completion rate,
  average rating, and pages read, computed live from your own book list.
- **Client state** — signed-in user info lives in Redux and is rehydrated
  from the session cookie on every page load via `/api/auth/me`.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [MongoDB](https://www.mongodb.com/) via the official Node driver
- [Redux Toolkit](https://redux-toolkit.js.org/) / `react-redux`
- [react-hook-form](https://react-hook-form.com/) for form state
- `jsonwebtoken` + `bcryptjs` for auth
- Tailwind CSS + [lucide-react](https://lucide.dev/) icons

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=a-long-random-secret
```

`JWT_SECRET` is used to sign/verify session tokens — generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to
`/login` — create an account via `/signup` to get started.

### 4. (Optional) Seed sample books

Once the dev server is running, seed a batch of sample books for a test
account through the real API:

```bash
node scripts/seed-books.js you@example.com yourPassword
# or, to create the account first:
node scripts/seed-books.js you@example.com yourPassword "Your Name"
```

## Project Structure

```
app/
  (auth)/login, (auth)/signup   Public auth pages
  (private)/page.tsx            Main dashboard (protected)
  api/auth/...                  Register, login, me
  api/books/...                 Book CRUD
components/                     UI components (book cards, modal, navbar, ...)
controller/                     Auth and book business logic
lib/                            DB connection, JWT helpers, API client
store/                          Redux store, user slice
proxy.ts                        Route protection (this Next.js version's middleware)
scripts/seed-books.js           Dev utility to seed sample books via the API
```

## API Routes

| Method | Route              | Description                          |
| ------ | ------------------ | ------------------------------------- |
| POST   | `/api/auth/register` | Create an account                   |
| POST   | `/api/auth/login`    | Log in, sets the session cookie     |
| GET    | `/api/auth/me`       | Get the current signed-in user      |
| GET    | `/api/books`         | List the current user's books       |
| POST   | `/api/books`         | Create a book                       |
| PUT    | `/api/books/:id`     | Update a book (owner-only)          |

## Available Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint
