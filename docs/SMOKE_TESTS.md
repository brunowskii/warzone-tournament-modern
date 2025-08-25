# Smoke Tests

Run these after deploy:

- Public tournaments API: GET /api/tournaments/public → 200 JSON array
- Home page: GET / → 200 HTML
- Leaderboard page: GET /en/leaderboard → 200
- OBS overlay: GET /en/obs/leaderboard → 200 (no hydration errors)
- Admin APIs (if configured): ensure role checks block unauthorized users
