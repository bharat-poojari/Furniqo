# Frontend Development Notes

Run the frontend locally (Vite):

```powershell
cd frontend
# set Vite API URL if needed
$Env:VITE_API_URL='http://localhost:5000/api/v1'
npm install
npm run dev
```

Notes:
- The app reads `VITE_API_URL` from environment; see `.env.example`.
- `apiWrapper` performs a quick health check at startup and falls back to local mock data if the backend is unavailable.
- To test offline mode, set `VITE_API_URL` to an unreachable address or stop the backend before loading the app.
