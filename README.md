# Diet Tracker Modern

A modern Diet & Meal Tracker (React + Vite + Tailwind frontend, Express + MongoDB backend)

## Settings included
- Backend .env uses the provided MongoDB Atlas URI.
- Generated JWT secret included in backend/.env (change if you wish).

## Quick start (local)
1. Install Node.js (18+) and npm.
2. Backend:
   - cd backend
   - npm install
   - npm run dev
3. Frontend:
   - cd frontend
   - npm install
   - npm run dev
4. Open http://localhost:5173

## Notes
- If you get 'Cannot connect to MongoDB', ensure your Atlas cluster accepts connections from your IP (allowlist) or set Network Access to allow your IP / 0.0.0.0/0 for testing.
- Replace secrets in backend/.env if you want a different JWT secret.
## Testing CI/CD Pipeline
## Testing CI/CD Pipeline
Test after fixing security group
