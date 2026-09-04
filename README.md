# AI Commerce Growth Agent (CommerceAI)

A production-quality full-stack web application built for the hackathon track: **AI Growth & Agentic Commerce**.

CommerceAI empowers merchants to increase revenue with autonomous AI shopping agents, contextual upsell/cross-sell engines, explainable financial guardrails, automated campaign orchestrators, Razorpay test-mode payment safety, and immutable audit trails.

---

## 1. Project Overview
CommerceAI turns static e-commerce catalogs into machine-readable agentic networks. It enables customers to discover products conversationally via text or Web Speech API voice input, receives personalized complementary recommendations, and executes Razorpay test payments bounded strictly by merchant financial guardrails.

---

## 2. Key Features
- **Conversational & Voice AI Shopping**: Speech-to-text (Web Speech API) & Gemini AI Function Calling.
- **Machine-Readable Catalog Endpoint**: `GET /api/catalog/agent` for AI buyer discovery.
- **Contextual Upsell & Cross-Sell Engine**: Recommends complementary accessories based on category synergy and stock.
- **Merchant Revenue Analytics**: Recharts dashboard showing Total Revenue, AI Generated Revenue, Upsell Revenue, and Conversion Rate.
- **AI Campaign Orchestrator**: Generates campaign proposals with merchant explicit approval workflow (`PROPOSED` -> `APPROVED`).
- **Financial Safety Guardrails (`TransactionGuard.ts`)**: Enforces max transaction limits, max discounts, stock checks, and mandatory customer confirmation.
- **Razorpay Test Mode Integration**: Signature-verified payment processing with HMAC SHA256 validation.
- **Graceful Payment Failure Recovery**: Handles payment cancellations without double charging and offers 1-click retry.
- **Complete Audit Trail**: Records all AI searches, tool calls, guardrail validations, and payment attempts.

---

## 3. Architecture Overview

```mermaid
graph TD
    Client[React + Vite + TypeScript Frontend] -->|REST APIs / JWT| API[Express + TypeScript Backend]
    API -->|Prisma ORM| DB[(PostgreSQL Database)]
    API -->|Function Calling / Tools| Gemini[Gemini AI Engine]
    API -->|Test Mode Payments| Razorpay[Razorpay API]
    API -->|Guardrails & Safety| Guard[Transaction Guardrail]
    API -->|Audit Trail| Audit[System Audit Logger]
```

---

## 4. Tech Stack

### Frontend
- React 18, Vite, TypeScript
- CSS (Vanilla Modern Fintech Design System)
- Framer Motion, Recharts, Lucide Icons
- Web Speech API (Voice Shopping)

### Backend
- Node.js, Express.js, TypeScript
- Prisma ORM, PostgreSQL
- Gemini AI SDK (`@google/genai`), Razorpay SDK
- JWT, bcryptjs, Helmet, CORS, Express-Rate-Limit, Zod

### DevOps / Infrastructure
- Docker, Docker Compose

---

## 5. Folder Structure

```text
ai-commerce-agent/
├── frontend/               # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/     # Reusable layout & UI components
│   │   ├── context/        # Auth & Cart React Contexts
│   │   ├── pages/          # 14+ Full Application Pages
│   │   ├── services/       # API services & Axios client
│   │   ├── utils/          # Web Speech API & helpers
│   │   └── index.css       # Design Tokens & Styles
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # Node.js + Express + TypeScript Backend
│   ├── prisma/             # Prisma Schema & Database Seed
│   ├── src/
│   │   ├── ai/             # Gemini Client, System Prompt, Tools & Guardrails
│   │   ├── controllers/    # API Controllers
│   │   ├── middleware/     # Auth, Role, Rate Limiter & Error Handlers
│   │   ├── payment/        # Razorpay & Signature Verification
│   │   ├── routes/         # Express Route definitions
│   │   ├── services/       # Core Business Services
│   │   └── server.ts       # Backend Server Entrypoint
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

---

## 6. Environment Setup

Copy `.env.example` in the root directory or inside `/backend`:

```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/commerce_ai?schema=public
JWT_ACCESS_SECRET=dev_jwt_access_secret_key_min_32_chars
JWT_REFRESH_SECRET=dev_jwt_refresh_secret_key_min_32_chars
GEMINI_API_KEY=your_gemini_api_key_here
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 7. Database Setup & Prisma Seed

1. Ensure PostgreSQL is running on port 5432.
2. Install dependencies & run Prisma commands:

```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
```

---

## 8. Running Local Development

### Start Backend (Port 5000)
```bash
cd backend
npm run dev
```

### Start Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 9. Docker Setup

To run the full stack with PostgreSQL, Backend, and Frontend via Docker Compose:

```bash
docker compose up --build
```

---

## 10. Demo Accounts for Testing

| Role | Email | Password | Details |
|---|---|---|---|
| **Customer** | `customer@demo.com` | `Password123!` | Rahul Sharma (Voice/AI Shopping, Cart & Orders) |
| **Merchant** | `merchant@demo.com` | `Password123!` | Vikram (TechGear India Dashboard, Rules & Campaigns) |
| **Admin** | `admin@demo.com` | `Password123!` | System Administrator (Full Audit Access) |

---

## 11. Core AI Agent Tools

The Gemini AI Agent uses structured tool calls:
- `search_products`: Search active catalog with category & price constraints.
- `get_product_details`: Retrieve full specs, SKU, and stock.
- `recommend_upsell`: Fetch complementary accessories based on category synergy.
- `calculate_cart_total`: Compute items, discounts, and payable amounts.
- `create_checkout_proposal`: Validate against merchant transaction guardrails.
- `create_razorpay_order`: Generate Razorpay test order upon explicit customer confirmation.
- `generate_campaign_proposal`: Propose merchant marketing campaigns.

---

## 12. Transaction Safety & Guardrails
Before creating a Razorpay payment order, `TransactionGuard.ts` verifies:
1. User is authenticated with valid JWT.
2. Products exist and stock is available.
3. Current database price matches expected price.
4. Total amount does not exceed merchant limit (default: ₹5,000).
5. Discount percentage does not exceed merchant limit (default: 10%).
6. Customer has explicitly authorized the transaction by checking confirmation.

---

## 13. Payment Failure Recovery
If a user closes the Razorpay popup or payment fails:
1. The backend records the failure state in `Payment` and `Order` tables.
2. No duplicate charge or inventory deduction occurs.
3. The UI presents a clear recovery screen: *"Payment wasn't completed. Don't worry — you have not been charged twice."*
4. Provides 1-click **[ Retry Payment ]** or **[ Return to Cart ]** options.

---

## 14. License
MIT License - Developed for Hackathon Track: AI Growth & Agentic Commerce.
