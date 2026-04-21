# Gemini AI Instructions – Expense Tracker (Backend)

## 🧠 Role

You are an AI assistant responsible for helping build and enhance the **backend of a Personal Finance & Expense Tracker** using:

- Spring Boot (Java)
- MongoDB
- REST APIs

You assist in:
- Writing backend logic
- Designing APIs
- Structuring code
- Implementing business rules
- Generating analytics

---

## 🏗️ System Responsibilities

### 1. API Development
- Design clean and RESTful APIs
- Follow proper HTTP methods:
  - GET → fetch data
  - POST → create data
  - PUT → update data
  - DELETE → remove data

Ensure:
- Proper request/response structure
- JSON format
- Status codes (200, 201, 400, 404, 500)

---

### 2. Database Handling (MongoDB)

- Use collections:
  - Users
  - Expenses
  - Budgets

- Maintain:
  - Data consistency
  - Efficient queries
  - Indexing where needed

---

### 3. Business Logic

Implement logic for:

#### Expense Management
- Add, update, delete expenses
- Filter by:
  - Date
  - Category
  - User

#### Budget Management
- Set monthly limits
- Track spending vs budget
- Trigger alerts (logic only)

#### Analytics
- Monthly summaries
- Category-wise totals
- Spending trends

---

### 4. Authentication & Security

- Implement JWT-based authentication
- Secure all endpoints except `/auth`
- Encrypt passwords (BCrypt)

---

## 📂 Code Structure Rules

Always follow clean architecture:

- controller → handles HTTP requests
- service → business logic
- repository → database access
- model → entity classes
- dto → request/response objects

---

## 🔌 API Standards

### Auth APIs
- POST /api/auth/register
- POST /api/auth/login

---

### Expense APIs
- POST /api/expenses
- GET /api/expenses
- PUT /api/expenses/{id}
- DELETE /api/expenses/{id}

---

### Budget APIs
- POST /api/budgets
- GET /api/budgets

---

### Analytics APIs
- GET /api/analytics/summary
- GET /api/analytics/category

---

## ⚙️ Coding Guidelines

- Use meaningful variable names
- Keep methods small and reusable
- Handle exceptions properly
- Validate input data
- Use DTOs instead of exposing models directly

---

## 🔐 Security Rules

- Never expose sensitive data (passwords, tokens)
- Use environment variables for secrets
- Validate all incoming requests

---

## 💬 Response Behavior

When generating backend code:

- Return clean, working Java code
- Follow Spring Boot best practices
- Include annotations:
  - @RestController
  - @Service
  - @Repository
  - @Document (for MongoDB)

---

## ⚠️ Limitations

- Do NOT generate frontend code
- Do NOT mix UI logic with backend
- Do NOT assume unavailable data

---

## 🚀 Goal

Build a **scalable, secure, and clean backend system** that supports:
- Expense tracking
- Budget management
- Analytics
- Future AI integration