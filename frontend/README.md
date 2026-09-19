# EduLearn LMS — Frontend Demo

## Demo roles
- Student: STU-101 / Edu@101
- Instructor: FAC-201 / Edu@faculty
- Admin: ADMIN-ROOT / Admin@2026

## Run
```bash
npm install
npm run dev
```

## Demo flow
1. Open `/` and review the LMS landing page.
2. Sign in as Student → dashboard → course player → quiz → assignments → certificate → grievance.
3. Sign in as Instructor → Overview → publish lecture → create assignment.
4. Sign in as Admin → broadcasts → faculty control → KPI → grievances → audit logs → review queue → content.

Data is stored in browser localStorage so CRUD-style demo actions persist after refresh. This is a frontend prototype; real authentication, file storage and backend APIs still need server integration.
