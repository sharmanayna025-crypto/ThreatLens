# ThreatLens – Change Log (UI redesign + fixes)

This zip is the **complete project** (frontend + backend + screenshots).
It supersedes both `ThreatLens-UI-Redesign.zip` and `ThreatLens-UI-Changes-Only.zip`
(the "changes only" files were identical to the matching files in the redesign zip).

## UI redesign (already in the previous zips, kept)
- `frontend/src/App.css`, `frontend/src/index.css` – dark SOC theme with cyan accents
- `Login.jsx`, `Register.jsx`, `NetworkMap.jsx` – styling hooks for the new theme

## Fixes & improvements in this version

### Frontend
| File | Change |
|---|---|
| `src/components/Sidebar.jsx` (new) | One shared sidebar replaces 4 copy-pasted ones, and adds a **Log out** button |
| `src/auth.js` (new) | Token helpers; `isTokenValid()` also checks the JWT expiry |
| `src/main.jsx` | Global axios handler: a 401 from the API clears the token and sends you to /login |
| `src/App.jsx` | Expired tokens no longer pass `ProtectedRoute`; logged-in users skip /login; unknown URLs redirect |
| `pages/ThreatDashboard, Threats, RiskAnalysis, Simulations` | Use `<Sidebar />`; removed dead code |
| `pages/NetworkMap.jsx` | Had **no navigation at all** – added "Back to Dashboard" and "Log out" |
| `pages/Login.jsx` | Stopped logging the login response (it contained the JWT) to the console; clearer errors; cold-start hint |
| `pages/Register.jsx` | 8-character minimum (matches backend); shows server messages |
| `index.html` | Tab title was "frontend" |
| `App.css` | Logout button styles |

### Backend
| File | Change |
|---|---|
| `JwtAuthenticationFilter.java` | Removed `System.out.println("AUTH HEADER…")` – it wrote every user's bearer token to the server logs |
| `AuthService.java` + new `auth/exception/*` | Wrong password now returns **401** (was 500, so the UI showed "Unable to connect"); duplicate email returns **409**; validation errors return **400** – all as `{"message": "..."}` |
| `RegisterRequest.java` | Password must be ≥ 8 characters |
| `JwtService.java` | Clear startup/login error if `JWT_SECRET` is missing or < 32 chars (was a NullPointerException) |
| 5 controllers | Removed stale `@CrossOrigin(localhost)`; `SecurityConfig` already handles CORS for localhost + Vercel |
| `application.properties` | `show-sql` off by default (`SHOW_SQL=true` to enable); `server.port=${PORT:8080}` |

### Repo
- `.gitignore` – `.env.example` is no longer ignored by the `.env.*` rule

## Required environment variables
**Backend (Render):** `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` (32+ chars)
**Frontend (Vercel):** `VITE_API_BASE_URL` – your backend URL

## Not verified / needs your eyes
- I could not run `npm run build`, the Spring Boot build, or the app (no network/browser in my sandbox).
  JSX was syntax-checked with esbuild and Java files were reviewed manually. Run
  `cd frontend && npm install && npm run build` and `cd backend && ./mvnw clean package` before pushing.
- `screenshots/` are the **old** UI. Retake them after deploying the redesign.
- `frontend/src/config.js` falls back to `https://threalens-backend.onrender.com` ("threalens" – missing a *t*?).
  If your Render service is really named `threatlens-backend`, fix that spelling and the same one in `.env.example`.
  Safer: set `VITE_API_BASE_URL` in Vercel.

## Round 2 – UI polish
All in `frontend/src/App.css` (new "POLISH LAYER" at the bottom) plus small JSX tweaks.
- **Dropdowns:** a global `appearance:none` had removed the arrow from every `<select>`; added a custom chevron.
- **Legibility:** body text was 9-11px in many places; bumped to 11-13px on desktop (mobile sizes unchanged).
- **Motion:** staggered fade-up on page content and stat cards, sidebar fade-in, auth card entrance, and a
  spinner on loading screens. Fully disabled for users with `prefers-reduced-motion`.
- **Depth:** subtle top highlight on cards, section hover border, stronger row hover, tabular numerals on KPIs.
- **Sidebar:** glowing active-item indicator and a divider above the status/logout area.
- **Login / Register:** Show/Hide password toggle, browser autofill hints (`autocomplete`), glowing logo.
- **Network Map:** fixed two regressions from round 1 (the new Log out button got the wrong style; the subtitle
  selector broke when the back button was added); hover glow on nodes; back-button hover state.
- **index.html:** `theme-color` and meta description.

## Round 3 – Render cold-start handling
Render's free tier sleeps when idle; the first request gets an HTML "waking up" page without CORS headers, which
browsers report as "network connection lost / access control checks".
- Backend: new public `GET /health` (`HealthController`, permitted in `SecurityConfig`).
- Login/Register pages ping `/health` on load so the server wakes while the user types.
- Login auto-retries network failures (8 x 8s) and shows a "server is waking up" notice.
- Optional: point a free uptime monitor (e.g. UptimeRobot) at `https://<backend>/health` every 5 min to keep it awake.
