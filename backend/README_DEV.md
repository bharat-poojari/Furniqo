# Backend Development Notes

Run the backend locally:

Windows (PowerShell):

```powershell
cd backend
# set environment variables (example)
$Env:JWT_SECRET='a_very_strong_secret_here'
$Env:DB_PATH='./furniqo.db'
$Env:ALLOW_ADMIN_REGISTER='true'   # only for dev/testing
$Env:SINGLE_SESSION='true'        # optional
node server.js
```

If port 5000 is already in use, either stop the occupying process or run on a different port:

```powershell
# find process using port 5000 and kill it (admin may be required)
Get-NetTCPConnection -LocalPort 5000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# or run on a different port
$Env:PORT='5100'
node server.js
```

Environment variables are defined in `.env.example`. Copy it to `.env` for convenience.

Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` to control the seeded default admin account. In production, set a strong password and avoid the fallback defaults.

Database:
- The server will create SQLite tables automatically on startup.
- Seed data is applied if the DB is empty.

Logging & debugging:
- Requests include `X-Request-Id` header for tracing.
- Errors include `requestId` in the JSON response for easier tracking.
