# AJFAN Documents Clearing

## Admin customer workspace

The frontend admin area is available at:

```text
http://localhost:3000/ajifan-documents
```

It requires an admin email and password from the Django backend. Credentials
are held in React memory only and are cleared when the page is refreshed or the
admin logs out.

For local development, copy `.env.example` to `.env.local` if the backend is
not running at the default URL:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

The frontend proxies `/api/backend/*` to the Django backend configured by
`AJFAN_BACKEND_URL`; the default is `http://127.0.0.1:8000`.
