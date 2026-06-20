# Goldenity Campus Website - MVP Skeleton

This repository now contains the first MVP foundation: database schema + strict RBAC.

## Scope Covered
- Roles: `Admin`, `Dosen`, `Mahasiswa`.
- New student registration flow table (`student_registrations`).
- Lecturer-driven grade input (`grades`) with read-only access for students.
- Automatic GPA (`student_gpa`) recalculation with red-flag marker (`warning_low_gpa`) when GPA < 2.00.

## Files
- `db/schema.sql`: complete PostgreSQL schema, triggers, functions, grants, and RLS policies.
- `src/routes/api.ts`: API route skeleton + endpoint-level RBAC guards.
- `src/middleware/*`: auth, role guard, and student ownership read-only guard.
- `src/services/gpaService.ts`: GPA computation logic returning `isUnderperforming`.
- `src/frontend/dosen-wali-dashboard.html`: demo UI for Dashboard Dosen Wali.
- `src/frontend/dosen-wali-dashboard.css`: visual styling, responsive layout, and red alert emphasis.
- `src/frontend/dosen-wali-dashboard.js`: table rendering + summary cards + underperforming filter.
- `src/services/transcriptService.ts`: temporary transcript data builder (identity, courses, total SKS, cumulative GPA).
- `src/controllers/transcriptController.ts`: transcript endpoint controller.

## How To Apply
Run this against PostgreSQL 14+:

```bash
psql -h <host> -U <user> -d <database> -f db/schema.sql
```

## Backend Run (TypeScript)

Available scripts:
- `npm run dev` to run API server in development mode.
- `npm run build` to compile TypeScript into `dist/`.
- `npm start` to run compiled server.

Default URLs:
- `http://localhost:3000/` redirects to dashboard demo.
- `http://localhost:3000/frontend/dosen-wali-dashboard.html` serves frontend demo page.
- `http://localhost:3000/api/*` serves backend API routes.

## Railway Database Setup

Local development (from laptop):
- Create `.env` in project root and use public Railway database URL.
- Current local configuration:

```env
DATABASE_URL="postgresql://postgres:XiepWWdEaSvijyOkQikGPLkixVAuQERV@reseau.proxy.rlwy.net:46080/railway"
PORT=3000
```

Production in Railway service variables:
- Add `DATABASE_URL` in the Express service (not DB service) with internal URL.

```text
postgresql://postgres:XiepWWdEaSvijyOkQikGPLkixVAuQERV@postgres.railway.internal:5432/railway
```

Schema execution:
- Connect using your SQL client to Railway database.
- Run full SQL script from `db/schema.sql`.

## Runtime Notes
- The application should execute `SELECT set_app_context('<current_user_uuid>');` per request/transaction before querying RLS-protected tables.
- Assign database users to one of these roles: `campus_admin`, `campus_lecturer`, or `campus_student`.
- RBAC is enforced at both grant level and row-level security level.

## Prompt 2 Business Logic (Backend Skeleton)

Endpoint-level guard mapping:
- `/api/master` -> admin only.
- `/api/pembayaran` -> admin only.
- `/api/nilai/input` -> dosen only.
- `/api/mahasiswa/:studentId/*` -> mahasiswa owner only and GET/read-only.

Core logic added:
- `requireRoles([...])` middleware for RBAC guard.
- `requireStudentSelfReadOnly(...)` middleware to enforce mahasiswa self access + read-only methods.
- `calculateStudentGpa(...)` service to compute GPA from grade rows and return:
	- `totalCredits`
	- `totalQualityPoints`
	- `gpa`
	- `isUnderperforming` (`true` when GPA < 2.00)

## Prompt 3 Frontend Demo (Dashboard Dosen Wali)

Implemented UI criteria:
- Shows advisee student list in table format.
- Adds very prominent RED highlight and alert badge for rows where `isUnderperforming = true`.
- Includes summary cards and quick filter to show only underperforming students.

Quick run (static demo):
1. Open `src/frontend/dosen-wali-dashboard.html` in browser.
2. Toggle the checkbox to filter only underperforming rows.

## Prompt 4 Temporary Transcript Generator

Added endpoint:
- `GET /api/mahasiswa/:studentId/transkrip`

Access policy:
- Allowed for student owner (`mahasiswa` matching `:studentId`).
- Allowed for advisor lecturer (`dosen` where `students.advisor_lecturer_id = current user`).
- Rejected for other roles.

Output format:
- Endpoint returns structured JSON payload (`documentType`, `generatedAt`, `transcript`) ready for PDF generation on frontend.

Dashboard integration:
- Added button `Unduh Transkrip Sementara` per student row in dashboard table.
- Frontend fetches transcript endpoint and generates downloadable PDF using jsPDF.

## Demo Role Switcher Widget

Floating widget added in bottom-right of dashboard page with 3 active user options:
- Dosen Wali (Role dosen, ID 101)
- Mahasiswa A (Role mahasiswa, ID 1)
- Mahasiswa B (Role mahasiswa, ID 2)

Behavior:
- Switching option updates `x-user-id` and `x-role` headers for frontend `fetch` calls.
- Clicking `Refresh Tabel` rerenders the table from the selected role perspective.
- Mahasiswa view is restricted to own data only; dosen view shows advisee list.
