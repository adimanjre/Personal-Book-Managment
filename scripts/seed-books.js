/**
 * Seeds sample books for a test account via the real HTTP API
 * (register -> login -> POST /api/books), so it exercises the same
 * code path the UI does.
 *
 * Usage:
 *   node scripts/seed-books.js <email> <password> [fullName] [baseUrl]
 *
 * - If the account doesn't exist yet, pass fullName to auto-register it.
 * - baseUrl defaults to http://localhost:3000
 */

const [email, password, fullName, baseUrlArg] = process.argv.slice(2);
const baseUrl = baseUrlArg || "http://localhost:3000";

if (!email || !password) {
  console.error(
    "Usage: node scripts/seed-books.js <email> <password> [fullName] [baseUrl]",
  );
  process.exit(1);
}

const SAMPLE_BOOKS = [
  { title: "Project Hail Mary", author: "Andy Weir", status: "COMPLETED", tags: ["sci-fi", "space"], pageCount: 476, rating: 5, publishYear: 2021, coverColor: "navy", favorite: true, notes: "Loved the twist with Rocky." },
  { title: "Dune", author: "Frank Herbert", status: "COMPLETED", tags: ["sci-fi", "classic"], pageCount: 412, rating: 5, publishYear: 1965, coverColor: "terracotta", favorite: true },
  { title: "Atomic Habits", author: "James Clear", status: "COMPLETED", tags: ["non-fiction", "productivity"], pageCount: 320, rating: 4, publishYear: 2018, coverColor: "amber", favorite: false },
  { title: "The Hobbit", author: "J.R.R. Tolkien", status: "COMPLETED", tags: ["fantasy", "classic"], pageCount: 310, rating: 4, publishYear: 1937, coverColor: "emerald", favorite: false },
  { title: "Sapiens", author: "Yuval Noah Harari", status: "READING", tags: ["non-fiction", "history"], pageCount: 443, pagesRead: 210, publishYear: 2011, coverColor: "stone", favorite: false },
  { title: "The Way of Kings", author: "Brandon Sanderson", status: "READING", tags: ["fantasy"], pageCount: 1007, pagesRead: 340, publishYear: 2010, coverColor: "indigo", favorite: true },
  { title: "Educated", author: "Tara Westover", status: "READING", tags: ["memoir"], pageCount: 334, pagesRead: 90, publishYear: 2018, coverColor: "rose", favorite: false },
  { title: "Klara and the Sun", author: "Kazuo Ishiguro", status: "WANT_TO_READ", tags: ["sci-fi", "fiction"], publishYear: 2021, coverColor: "slate", favorite: false },
  { title: "The Song of Achilles", author: "Madeline Miller", status: "WANT_TO_READ", tags: ["fiction", "mythology"], publishYear: 2011, coverColor: "rose", favorite: true },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "WANT_TO_READ", tags: ["non-fiction", "psychology"], publishYear: 2011, coverColor: "stone", favorite: false },
  { title: "The Name of the Wind", author: "Patrick Rothfuss", status: "WANT_TO_READ", tags: ["fantasy"], publishYear: 2007, coverColor: "indigo", favorite: false },
  { title: "Circe", author: "Madeline Miller", status: "WANT_TO_READ", tags: ["fiction", "mythology"], publishYear: 2018, coverColor: "emerald", favorite: false },
  { title: "The Midnight Library", author: "Matt Haig", status: "WANT_TO_READ", tags: ["fiction"], publishYear: 2020, coverColor: "navy", favorite: false },
];

async function extractTokenCookie(res) {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return null;
  const match = setCookie.match(/token=[^;]+/);
  return match ? match[0] : null;
}

async function main() {
  let cookie;

  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (loginRes.ok) {
    cookie = await extractTokenCookie(loginRes);
    console.log(`Logged in as ${email}`);
  } else if (fullName) {
    console.log("Login failed, registering account...");
    const registerRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
    if (!registerRes.ok) {
      console.error("Register failed:", await registerRes.text());
      process.exit(1);
    }

    const retryLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!retryLoginRes.ok) {
      console.error("Login after register failed:", await retryLoginRes.text());
      process.exit(1);
    }
    cookie = await extractTokenCookie(retryLoginRes);
    console.log(`Registered and logged in as ${email}`);
  } else {
    console.error(
      "Login failed:",
      await loginRes.text(),
      "\nPass a fullName argument to auto-register this account.",
    );
    process.exit(1);
  }

  if (!cookie) {
    console.error("No session cookie returned from login.");
    process.exit(1);
  }

  let created = 0;
  for (const book of SAMPLE_BOOKS) {
    const res = await fetch(`${baseUrl}/api/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify(book),
    });

    if (res.ok) {
      created += 1;
      console.log(`  + ${book.title}`);
    } else {
      console.error(`  x ${book.title} -> ${res.status} ${await res.text()}`);
    }
  }

  console.log(`\nDone. Created ${created}/${SAMPLE_BOOKS.length} books for ${email}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
