<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

Next.js Agent Rules: Hair Salon Management System
Project Context
You are working on a Full-Stack Hair Salon Management Application. The stack is Next.js (App Router), TypeScript, Supabase (Database & Auth), Prisma ORM, shadcn/ui, and Tailwind CSS.

Core Technical Principles
App Router Hierarchy: Use the app/ directory exclusively. Follow the (groups), [dynamic], and api/ route conventions.

Server First: Use React Server Components (RSC) by default. Use "use client" only for interactive elements (forms, dialogs).

Data Mutation: Use Server Actions for all database writes (registrations, bookings, status changes).

Validation: Use Zod for schema validation on both the client and server sides.

1. Database & Prisma (Supabase)
   Singleton Pattern: Ensure Prisma Client is initialized as a singleton to prevent connection exhaustion in development.

Schema Design:

User Roles: CLIENT, HAIRDRESSER, ADMIN.

Client Approval: New clients must have an isApproved flag set to false. Access to booking is restricted until an Admin sets this to true.

Time Blocks: All appointments and shifts must start on the hour (e.g., 10:00, 11:00).

Enums: Use Prisma enums for roles and appointment statuses (PENDING, CONFIRMED, CANCELLED).

2. Business Logic & Constraints
   The 10-Minute Rule:

Appointments are created with a PENDING status.

A client has 10 minutes to confirm.

Logic: If status === 'PENDING' and createdAt is > 10 mins ago, the slot is considered vacant for other users.

Capacity Limits:

Maximum of 4 hairdressers working at the same time (limited stations).

Hairdressers cannot exceed 40 hours of work per week.

Operating Hours:

Mon-Fri: 10:00 - 20:00.

Sat: 10:00 - 16:00.

Sundays: Closed.

Appointment Types: Short (1h) or Long (2h).

3. UI/UX Standards (shadcn/ui + Tailwind)
   Consistency: Use shadcn/ui components for all inputs, buttons, and layouts.

Safety: Irreversible actions (canceling an appointment, deleting an account) must trigger a shadcn/ui AlertDialog for confirmation.

Forms: Use react-hook-form integrated with zod and shadcn/ui form components.

Feedback: Use sonner or toast for success/error notifications after server actions.

4. Security & Authentication
   Supabase Auth: Use Supabase for session management.

Password Safety: All passwords must be hashed using bcrypt before database entry (if not using Supabase Auth's native provider).

Role-Based Access Control (RBAC): Check user roles on the server before rendering protected layouts or executing sensitive actions.

Maintain clean TypeScript interfaces. Avoid any.

Keep logic inside services or lib folders; keep components focused on UI.
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
