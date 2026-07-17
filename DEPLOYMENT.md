# Deployment

This project has two deployable parts:

- **Frontend** → Vercel (`frontend/`)
- **Backend** → Railway / Render / Fly (`backend/`)

The frontend calls the backend over HTTP, so the backend **must be deployed and publicly reachable**.

---

## 1. Deploy the backend (Railway example)

1. Deploy the `backend/` folder to your host (this project is already live on Render).
2. Add environment variables (Render dashboard → Environment):
   - `PEXELS_API_KEY` = your Pexels key
   - `CLIENT_ORIGIN` = `https://socially-approved-alpha.vercel.app`
     - Multiple origins allowed, comma-separated: `http://localhost:3000,https://socially-approved-alpha.vercel.app`
   - `PORT` is injected by Render; the app reads `process.env.PORT`.
3. Deploy. The backend is reachable at `https://socially-approved-lbv4.onrender.com`.
4. Verify: `https://socially-approved-lbv4.onrender.com/health` → `{ "status": "ok" }`.

---

## 2. Deploy the frontend (Vercel)

1. Import the repo on [Vercel](https://vercel.com), set root directory to `frontend`.
2. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://socially-approved-lbv4.onrender.com` (the deployed backend URL)
   - **Do NOT use `http://localhost:3001`** — that only works locally.
3. Deploy. Vercel builds with `next build`; `NEXT_PUBLIC_API_URL` is baked in at build time, so changing it requires a **redeploy**.

---

## 3. Common errors

| Error | Cause | Fix |
| ----- | ----- | ---- |
| `CORS policy: Permission denied ... loopback` | Frontend on Vercel still points to `localhost:3001` | Set `NEXT_PUBLIC_API_URL` to the deployed backend URL and redeploy |
| `blocked by CORS policy` (origin not allowed) | `CLIENT_ORIGIN` doesn't include the Vercel URL | Add the Vercel URL to `CLIENT_ORIGIN` (comma-separated) and redeploy backend |
| `Missing required environment variable: PEXELS_API_KEY` | Backend env not set | Set `PEXELS_API_KEY` on the backend host |

---

## Local development

Run both servers (see root `README.md`):

```bash
# terminal 1
cd backend && npm install && npm run dev
# terminal 2
cd frontend && npm install && npm run dev
```
