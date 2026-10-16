# Al-Fajr Learning Academy

Marketing website and admin dashboard for an international online academy offering School Tutoring, Academic Writing Coaching, and Quran and Islamic Studies.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, react-hook-form + zod, and Radix UI.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
```

The admin panel lives at `/admin` (sign in at `/admin/login`). In preview mode any email and password will sign you in.

## Project structure

```
app/
  (site)/            Public website (shared Navbar, Footer, WhatsApp button)
    page.tsx         Home
    services/        Programs in detail (#tutoring, #writing, #quran)
    about/  contact/  payment/
    apply/student/   4-step student application (?program=tutoring|writing|quran)
    apply/teacher/   4-step teacher application
  admin/
    login/           Admin sign-in
    (panel)/         Dashboard: overview, students, admissions, teachers, fees, messages
components/
  ui/                Button, inputs, cards, accordion (shared primitives)
  home/              Home page sections
  apply/             Shared application shell, review list, success screen
  admin/             Store, shell, tables, drawers, charts
lib/
  site-config.ts     Academy name, contact details, office hours, payment accounts, currencies
  programs.ts        Programs, curricula, subjects, courses, countries, time zones
  media.ts           Every image used on the site, with alt text
  schemas.ts         Form validation (zod), including per-step schemas
  submissions.ts     Public form handlers (mock, ready for a backend)
  admin/             Admin types, mock data, metrics, formatting, repository
```

## Editing content

Almost everything you will want to change lives in three files, so you never need to hunt through pages:

| What | Where |
| --- | --- |
| Name, tagline, email, WhatsApp, office hours, social links, payment account details | `lib/site-config.ts` |
| Programs, curricula, subjects, Quran courses, countries, time zones | `lib/programs.ts` |
| Photos and alt text | `lib/media.ts` |

Motion is shared too: `components/motion.tsx` holds page transitions, scroll reveals, word-by-word headings, card spotlight, form step slides, and the scroll progress bar. `components/NavProgress.tsx` is the top loading bar on navigation. Everything respects the visitor's reduced-motion setting.

Brand colours and fonts are defined once in `tailwind.config.ts` (`brand`, `sky`, `ink`, `line`, `canvas`) and `app/layout.tsx`. Sections such as page headers, program cards, and payment cards are shared components, so a change in one place updates every page that uses it.

Images currently point to Unsplash placeholders. Replace them with real academy photos in `lib/media.ts`. If you host images elsewhere, add that hostname in `next.config.mjs`.

## Fees and payments

No prices are published on the website. Families receive a written fee plan after a free assessment call. The Payment page explains how to pay (international bank transfer, Wise, PayPal, JazzCash for Pakistan) and collects proof of payment, which appears in the admin panel for verification.

Supported currencies: USD, GBP, EUR, CAD, AUD, AED, SAR, PKR. Dashboard totals are converted to USD using the indicative rates in `lib/admin/format.ts` (`FX_TO_USD`). Update those rates, or replace them with a live rate source, when connecting the backend.

## Admin dashboard

| Page | What it tracks |
| --- | --- |
| Overview | Needs-attention strip (new applications, teacher applications, payment proofs, unread messages, students without a teacher), enrolled students with national vs international split, fees collected this month, outstanding and overdue fees, enrolment trend, billed vs collected, programs, countries |
| Students | Every enrolled student with student type, class format, WhatsApp, outstanding balance, invoices, record payment, status changes, CSV export |
| Admissions | Student applications by stage (new, contacted, assessment, enrolled, rejected), filter by program and national or international, every field from the application form (grade, subjects, writing focus, course brief, class format, WhatsApp), enrol with fee plan and teacher |
| Teachers | Teacher applications by hiring stage (new, reviewing, demo, approved, rejected) with WhatsApp, CV and demo video, and the current faculty with languages |
| Fees | Invoices by status, month and currency, payment reminders, payment proofs to verify (program, student ID given, screenshot), new invoices, CSV export |
| Messages | Contact form inbox with email and WhatsApp reply |

The dashboard currently runs on realistic generated data (`lib/admin/mock-data.ts`). All actions work in the browser session but are not saved.

## Supabase

`supabase/schema.sql` creates every table the site and dashboard use, with the same fields as `lib/admin/types.ts` and the website forms:

- Tables: `student_applications`, `teacher_applications`, `contact_messages`, `payment_proofs`, `teachers`, `students`, `invoices`, `admins`
- Readable IDs (STU-1041, INV-3101, APP-2210) generated by the database
- Row level security: visitors can only submit the four public forms; only users listed in `admins` can read or change anything
- Private storage buckets for CVs, course briefs, and payment screenshots
- `enroll_student()` creates the student and first invoice in one transaction (used by the Admissions "Enrol" button)

Setup: run the file in the Supabase SQL editor, create your admin user in Authentication, then `insert into admins (user_id, name) values ('<user id>', 'Your name');`.

Public forms insert without reading back (no `.select()` after `.insert()`), because visitors are not allowed to read submissions.

## Backend (later)

This is a frontend-only build. The UI never reads data directly. Everything goes through one file, so a backend can be connected later without touching any page:

```
Admin pages  ->  components/admin/AdminStore.tsx  ->  lib/admin/repository.ts  ->  mock data (today) / your API (later)
```

Connection points are marked with `TODO(backend)` comments:

- `lib/admin/repository.ts` for all admin reads and actions
- `lib/submissions.ts` and `lib/uploads.ts` for the public forms and file uploads
- `app/admin/login/page.tsx` and `app/admin/(panel)/layout.tsx` for admin sign-in and route protection

The data shapes the backend needs to return are defined in `lib/admin/types.ts`.
