# 📗 `README.md` for **API Repo (`my-journal-api`)**

```markdown
# My Journal (API)

NestJS API for **My Journal** with Prisma (Postgres on Neon), JWT in an **HttpOnly cookie**, and Swagger docs.

---

## 🛠️ Tech
- NestJS
- Prisma ORM
- PostgreSQL (Neon)
- JWT (HttpOnly Cookie)
- Swagger (OpenAPI)

---

## 🚀 Quick Start

```bash
# 0) Install dependencies
npm install

# 1) Create .env file
DATABASE_URL="postgresql://<user>:<pass>@<pooled-host>/<db>?sslmode=require"
DIRECT_URL="postgresql://<user>:<pass>@<direct-host>/<db>?sslmode=require"
JWT_SECRET="dev-secret-change-me"
NODE_ENV=development
PORT=3000

# 2) Setup DB
npx prisma migrate dev -n init
npx prisma generate

# 3) Run dev server
npm run start:dev

# 4) Open Swagger docs
http://localhost:3000/docs
````

---

## ⚙️ Environment Variables

* `DATABASE_URL` → Neon **pooled** connection string (runtime)
* `DIRECT_URL` → Neon **direct** connection string (migrations)
* `JWT_SECRET` → strong secret key
* `NODE_ENV` → `development` locally; `production` in prod
* `PORT` → default: `3000`

---

## 📊 Prisma Commands

```bash
# Open local data browser
npx prisma studio

# Create + apply new migration
npx prisma migrate dev -n init
# or
npx prisma migrate dev --name init

# Apply existing migrations (prod)
npx prisma migrate deploy
```

---

## 📜 Run Scripts

```bash
npm run start         # Start app
npm run start:dev     # Run dev mode with hot reload
npm run build         # Compile to dist/
npm run lint          # Lint
```

---

## 📖 Swagger API Docs

* Start server → open **[http://localhost:3000/docs](http://localhost:3000/docs)**
* After login, Swagger automatically sends cookie to protected endpoints.

### Example flow:

1. **POST `/auth/login`**

   ```json
   { "username": "sjames1", "password": "MyPass12$" }
   ```

   * Auto-creates user if missing.
   * Sets `Authorization` HttpOnly cookie.

2. **GET `/auth/me`**
   Returns current user. (Requires cookie)

3. **POST `/entries`**

   ```json
   { "title": "Day 1", "body": "Hello journal!" }
   ```

4. **GET `/entries`** → List entries

5. **PUT `/entries/{id}`** → Update entry (title unchanged if empty string)

6. **DELETE `/entries/{id}`** → Delete entry

---

## 🔑 Auth Details

* **Login**: auto-create user if not found.
* Username normalized to lowercase.
* Password must match pattern: letters (1–7), 2 digits, `$` (e.g., `MyPass12$`).
* Password stored as `bcrypt` hash.
* JWT issued → stored in cookie:

  * `httpOnly: true`
  * `sameSite: 'lax'`
  * `secure: NODE_ENV === 'production'`

---

## 🔒 CORS & Cookies

`main.ts` config:

```ts
import cookieParser from 'cookie-parser';
app.use(cookieParser());
app.enableCors({
  origin: ['http://localhost:4200'], // Angular UI
  credentials: true,
});
```

* Dev: `NODE_ENV=development` → `Secure` flag **off**.
* Prod: `NODE_ENV=production` → `Secure` flag **on** (HTTPS required).

---

## 📂 Project Structure

```
api/
  src/
    auth/
      auth.controller.ts
      auth.service.ts
      dto/login.dto.ts
      jwt-auth.guard.ts
    entries/
      entries.controller.ts
      entries.service.ts
      dto/create-entry.dto.ts
      dto/update-entry.dto.ts
    prisma/
      prisma.service.ts
    app.module.ts
    main.ts
  prisma/
    schema.prisma
    migrations/
```

---

## 📌 Endpoints

### Auth

* `POST /auth/login`
* `GET /auth/me`
* `POST /auth/logout`

### Entries (protected)

* `GET /entries`
* `POST /entries`
* `GET /entries/:id`
* `PUT /entries/:id`
* `DELETE /entries/:id`

---

## 🚀 Deploy Notes

### Render (API)

* Env vars: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `NODE_ENV=production`
* Build: `npm run build`
* Start: `node dist/main.js`
* Apply migrations:

  ```bash
  npx prisma migrate deploy
  ```

### Vercel / Netlify (UI)

* Angular build:

  ```bash
  ng build --configuration production
  ```
* Set API URL in environment file.

---

## 🛠️ Troubleshooting

* **Prisma P2021 (table not found)**
  Run:

  ```bash
  npx prisma migrate dev -n init
  # or
  npx prisma migrate deploy
  ```

* **401 on /auth/me or /entries in Swagger**

  * Confirm login set `Authorization` cookie (check browser devtools).
  * Ensure `NODE_ENV=development` locally.
  * Verify `cookie-parser` is enabled.

* **Pooled vs Direct URLs**

  * Use pooled (`-pooler`) for `DATABASE_URL`.
  * Use direct for `DIRECT_URL`.

---

## 🧾 Handy Commands Recap

```bash
# Data browser
npx prisma studio

# Create migration
npx prisma migrate dev -n init

# Apply existing migrations (prod)
npx prisma migrate deploy

# Run dev server
npm run start:dev
```

```

---


Do you also want me to draft a **root README** that links to both repos (UI + API) in case you present this as one project?
```
