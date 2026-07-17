# Socially Approved — Video Carousel

A high-performance video carousel that browses free stock videos from the **Pexels API**. Built with a **Next.js + TypeScript + Tailwind** frontend and a **Node.js + Express** backend proxy.

> The app fetches all video data exclusively from the Pexels API. There is no local database, upload, or file browsing. Social interactions (Like / Share) are client-side demos only and are not persisted.

---

## Features

- **Outer carousel** — horizontal scroll, mouse drag, touch swipe, keyboard arrows, prev/next buttons, responsive layout, active indicator dots, loading skeletons.
- **Video modal** — dark backdrop, close / ESC / click-outside, prev/next + swipe + keyboard navigation, focus trap, pagination dots.
- **Video player** — autoplay (muted), pause/resume, mute/unmute, volume control, seekable progress bar, current/total time, replay, loading spinner, poster, buffer indicator, retry on error.
- **Performance** — `IntersectionObserver` lazy thumbnail loading, `React.memo`, dynamic import of the modal, native image lazy loading.
- **Dummy social stats** — each video shows generated likes / shares / views; **Like** (toggle) and **Share** (Copy / WhatsApp / Facebook / X / Telegram) are interactive on the client only.
- **Backend** — Pexels proxy with rate limiting, input validation, centralized error handling, and security headers.

---

## Tech Stack

| Layer     | Stack                                              |
| --------- | ------------------------------------------------- |
| Frontend  | Next.js, React, TypeScript, Tailwind CSS          |
| Backend   | Node.js, Express.js, Axios                        |
| Data      | Pexels Video API (no database)                    |

---

## Project Structure

```
socially-approved/
├── backend/                 # Express API
│   ├── src/
│   │   ├── index.ts         # App wiring (mounts /pexels, /health)
│   │   ├── config/env.ts    # Env validation
│   │   ├── routes/pexels.ts # GET /pexels/search
│   │   ├── controllers/     # Response formatting
│   │   ├── services/        # Pexels API client
│   │   └── middleware/      # errorHandler, rateLimiter, validate, security
│   └── .env                 # PEXELS_API_KEY (gitignored)
└── frontend/                # Next.js app
    └── src/
        ├── app/page.tsx     # Home / carousel
        ├── components/      # OuterCarousel, InnerModal, VideoPlayer, VideoCard, SocialActions, LoadingSpinner
        ├── hooks/           # useIntersectionObserver
        ├── lib/api.ts       # fetchPexelsVideos + pexelsToVideo
        └── types/           # shared types
```

---

## Prerequisites

- Node.js 18+ (tested on Node 20+)
- A free [Pexels API key](https://www.pexels.com/api/)

---

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PEXELS_API_KEY=your_pexels_api_key_here
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
```

Start the backend (development):

```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local` (optional — defaults to `http://localhost:3001`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend (development):

```bash
npm run dev
```

Open `http://localhost:3000`.

> Run **both** servers simultaneously. The frontend calls the backend, which proxies Pexels.

---

## API

### `GET /pexels/search`

Query parameters:

| Param     | Type   | Default | Notes                          |
| --------- | ------ | ------- | ------------------------------ |
| `query`   | string | —       | Required (≤100 chars)          |
| `page`    | number | `1`     | 1–50                           |
| `per_page`| number | `15`    | 1–80 (raise cap in `validate.ts`) |

Response:

```json
{
  "success": true,
  "page": 1,
  "per_page": 15,
  "total_results": 1000,
  "count": 15,
  "videos": [ { "id": "pexels-123", "title": "...", "videoUrl": "...", ... } ],
  "next_page": "/pexels/search?query=nature&page=2&per_page=15",
  "has_next": true
}
```

### `GET /health`

Returns `{ "status": "ok" }`.

---

## Configuration

Backend env vars (see `backend/src/config/env.ts`):

| Variable               | Default                                  | Description                |
| ---------------------- | ---------------------------------------- | -------------------------- |
| `PEXELS_API_KEY`       | — (required)                             | Pexels API key             |
| `PORT`                 | `3001`                                   | Backend port               |
| `CLIENT_ORIGIN`        | `http://localhost:3000`                  | CORS allowed origin        |
| `PEXELS_BASE_URL`      | `https://api.pexels.com/videos/search`   | Pexels endpoint            |
| `RATE_LIMIT_WINDOW_MS` | `60000`                                  | Rate-limit window          |
| `RATE_LIMIT_MAX`       | `30`                                     | Max requests per window    |

---

## Increasing the number of videos fetched

- **Per page:** edit `frontend/src/app/page.tsx` — the `15` passed to `fetchPexelsVideos(query, page, 15)`.
- **Max cap:** edit `backend/src/middleware/validate.ts` — `per_page` is validated `1–80`. Raise the upper bound there if you need more than 80 per request.

The carousel supports 30–40+ videos smoothly via lazy loading and memoization.

---

## Scripts

Backend:

```bash
npm run dev      # nodemon watch
npm run build    # tsc compile to dist/
npm start        # node dist/index.js
```

Frontend:

```bash
npm run dev      # next dev
npm run build    # next build
npm start        # next start
npm run lint     # eslint
```

---

## Notes / Limitations

- Social features (Like / Share) are **client-side demos** — state is not persisted and resets on reload. There is no `/like`, `/share`, `/comment`, or `/videos` backend (the original SRS local-API + DB design was replaced by a Pexels-only approach).
- Like / share / view counts are **dummy generated** values because the Pexels search API does not return them.
- No Webpack/Next image optimization for external Pexels thumbnails (intentional, to avoid provider cost); uses native `<img loading="lazy">`.

---

## License

For demonstration / interview purposes.
