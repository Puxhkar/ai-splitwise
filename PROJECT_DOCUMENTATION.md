# Splitwise Clone (AI-Powered)

## Table of Contents
1. [Project Overview](#project-overview)
2. [Main Features](#main-features)
3. [Usefulness & Target Audience](#usefulness--target-audience)
4. [Tech Stack](#tech-stack)
5. [Application Routes](#application-routes)
6. [API Endpoints & Database](#api-endpoints--database)
7. [External Services & API Keys](#external-services--api-keys)

---

## Project Overview
This project is an AI-powered clone of the popular expense-sharing application, Splitwise. It helps users track shared expenses, balances, and settle debts within friend groups or between individuals. By integrating AI and modern web technologies, it provides a seamless, real-time, and intelligent expense management experience. 

## Main Features
- **Expense Tracking:** Add, edit, and categorize shared expenses seamlessly.
- **Group Management:** Create groups for trips, apartments, or events to track collective spending.
- **Smart Settlements:** Automatically calculate who owes whom and simplify debts.
- **Real-time Dashboard:** View instant updates on balances, recent activities, and comprehensive charts.
- **AI Integration (Gemini):** Harnesses AI for smart operations (like receipt scanning or categorization).
- **Automated Notifications:** Email reminders for pending settlements or new expenses.
- **Authentication:** Secure user login and profile management.
- **Report Generation:** Export summaries and expense reports as PDFs.

## Usefulness & Target Audience
**Why is it useful?**
Managing shared finances can be awkward and prone to errors. This application removes the friction of calculating exact splits, tracking who paid for what, and reminding friends to pay you back. The AI component further reduces manual data entry, making the process effortless.

**Why should people use this?**
- **Accuracy:** Eliminates manual math errors.
- **Transparency:** Everyone in a group sees exactly what was spent and by whom.
- **Convenience:** Access anywhere (web/mobile responsive) with real-time updates without needing to refresh.
- **Automation:** Smart debt simplification and automated reminders save time.

---

## Tech Stack

We chose a modern, cutting-edge stack tailored for rapid development, scale, and real-time capabilities.

### Framework & Language
- **Next.js 14/15 (App Router):** Chosen for its excellent server-side rendering (SSR), SEO benefits, and integrated routing system.
- **React (v19):** For building component-driven, highly interactive user interfaces.
- **JavaScript (JSX):** Used across the application for logic and UI.

### Database & Backend
- **Convex:** A reactive, real-time backend platform.
  - *Why Convex?* Unlike traditional REST APIs or basic databases, Convex inherently supports real-time data sync using its own highly-optimized **WebSocket connection** beneath the hood. 
  - *How does it work live without Socket.io?* When you use a Convex query (like `useQuery` in React), it automatically establishes a WebSocket link to their servers. When an expense is added or a settlement occurs, Convex instantly pushes the updated data through this open WebSocket to all connected clients. This means we get the exact same "live" experience as Socket.io, but without the headache of managing servers, connections, rooms, or events manually. All users' dashboards update instantly without polling. It also handles edge functions and database operations natively in JS/TS.

### Authentication
- **Clerk (`@clerk/nextjs`):** 
  - *Why Clerk?* It provides highly secure, out-of-the-box user management, OAuth integrations, and customizable UI components, vastly reducing the time needed to build custom Auth systems securely.

### AI Capabilities
- **Google Generative AI (`@google/generative-ai`):** (Powered by Gemini)
  - *Why Gemini?* Provides powerful, cost-effective multimodal capabilities, ideal for extracting text from receipts or intelligently categorizing user expenses.

### Styling & UI Components
- **Tailwind CSS (`tailwindcss`):** Utility-first CSS framework for rapid, responsive UI development.
- **shadcn/ui (Radix UI primitives - `@radix-ui/*`):** Accessible, unstyled UI primitives that we can completely customize.
- **Lucide React:** Beautiful, consistent iconography.
- **Recharts (`recharts`):** Lightweight and highly customizable charting library for dashboard visualizations.

### Additional Utilities
- **Inngest (`inngest`):** For step functions and background jobs (e.g., executing delayed email reminders or heavy AI processing tasks without blocking the UI).
- **Resend (`resend`):** Developer-friendly transactional email service that is fast and reliable.
- **jsPDF (`jspdf`, `jspdf-autotable`):** For client-side PDF generation to export expense reports.
- **React Hook Form & Zod:** For robust, type-safe form handling and validation.

---

## Application Routes

The frontend is structured using the Next.js App Router for clean separation of concerns:

### Public Routes
- `/`: Landing page describing the product.
- `/how-it-works`: Explains the application flow and AI features.
- `/features`: Showcases specific functionalities.
- `/help`: Support and FAQ page.

### Auth Routes (Clerk)
- `/(auth)/sign-in`: Secure login page.
- `/(auth)/sign-up`: Account creation page.

### Protected / Main Application Routes (Requires Login)
- `/dashboard`: The main hub showing total balances, recent activity, and charts.
- `/expenses`: List of all expenses. Allows adding, editing, and deleting them.
- `/groups`: Create and manage groups (e.g., "Miami Trip 2024").
- `/contacts` / `/person`: Manage friends and view individual balances.
- `/settlements`: Record payments to settle outstanding debts.
- `/settings`: Manage user preferences.

### Webhooks
- `/api/inngest`: Secure endpoint where Inngest triggers our background jobs and workflows.

---

## API Endpoints & Database

Instead of traditional REST routes (`/api/...`), we use **Convex** for server functions (Queries, Mutations, and Actions) located in the `convex/` directory.

### Core Convex Modules:
1. **`users.js`**: Manages user profiles (syncing with Clerk identities).
2. **`groups.js`**: Handles creating groups, adding members, and fetching group details.
3. **`expenses.js`**: Core logic for inserting expenses, calculating exact splits, and updating related balances.
4. **`settlements.js`**: Logic to record when a user pays another, adjusting their balances accordingly.
5. **`dashboard.js`**: Aggregation queries designed specifically to fetch optimized data for the frontend dashboard (e.g., monthly spending trends).
6. **`contacts.js`**: Managing friendships and connections between platform users.
7. **`schema.js`**: Defines the rigorous database schema and indexes for high-performance querying inside Convex.
8. **`inngest.js` / `email.js`**: Trigger points for kicking off background jobs and sending real-time emails.

---

## External Services & API Keys

The application relies on several third-party services configured via environment variables (found in `.env.local`):

1. **Convex (`NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`)**:
   - Connects the Next.js frontend to the Convex reactive backend.
2. **Clerk Auth (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)**:
   - Secures the application and handles user sessions.
3. **Google Gemini (`GEMINI_API_KEY`)**:
   - API key specifically for triggering the Generative AI tasks within server-side functions.
4. **Resend (`RESEND_API_KEY`)**:
   - Used to programmatically send automated emails (verification, settlement reminders) to users.
5. **Inngest**:
   - Although it uses a webhook route, it coordinates with the Inngest platform to manage job queues.
