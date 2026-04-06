# Finance Data Processing and Access Control Backend

#### A robust, enterprise-grade REST API built with Node.js, Express, TypeScript and MongoDB, designed to manage financial records and provide real-time dashboard analytics. This system implements a sophisticated Role-Based Access Control (RBAC) model to ensure data security and integrity across different user tiers.

---

## 🔑 Key Features

- **Advanced Role Management:**

  - **Admin/Super Admin:** Full system oversight, user management (Status/Roles), and CRUD operations.
  - **Analyst:** Data entry and access to deep financial insights and category trends.
  - **Viewer:** Read-only access to high-level dashboard summaries and recent activity.

- **Intelligent Financial Analytics:**

  - Real-time calculation of **Total Income**, **Total Expenses**, and **Net Balance**.
  - **Category-wise Breakdown** (e.g., SALARY, FOOD, TRANSPORT) using MongoDB Aggregation Pipelines.
  - **Time-Series Trends:** Visualizable data points for Daily, Weekly, and Monthly financial tracking.

- **Security & Validation:**

  - **Insufficient Balance Protection:** Prevents users from logging expenses that exceed their current net balance.
  - **Soft Deletion:** Implements `isDeleted` logic to preserve audit trails while keeping analytics accurate.
  - **JWT Authentication:** Secure route protection and user identity verification.

- **Performance Optimized:**
  - Database indexing on type and category for lightning-fast aggregation on large datasets.
  - Strict TypeScript implementation for type safety and reduced runtime errors.

---

## ⚙️ **Technologies Used:**

- **Runtime:** Node.js
- **Framework:** Express.js with Typescript
- **Database:** MongoDB with Mongoose ODM
- **Validation:** Zod
- **Security:** Bcrypt (Password Hashing) & JWT (Authentication)
- **Utilities:** dotenv, ESLint, cookie-parser, http-status-codes

---

## **📝 Assumptions & Design Decisions:**

- **Viewer Scope:** I assumed the Viewer role is a "Stakeholder" account. They have read-only access to the dashboard (summaries, trends, and recent activity) to monitor financial health but are strictly prohibited from creating, editing, or deleting any records.
- **Analyst vs. Admin:** I assumed Analysts are "Data Workers" who can create and view records/insights, but only Admins have the authority to manage other users (changing roles/status) and perform hard overrides on financial data.
- **Net Balance Constraint:** I assumed a "No-Debt" policy for the `createRecord` service. If a user attempts to log an `EXPENSE` that exceeds their current Net Balance (Total Income - Total Expenses), the system will block the transaction with a `400 Bad Request`.
- **Filtering & Aggregation:** I assumed that "Recent Activity" should be limited to the last 10 entries to optimize dashboard loading performance while providing a sufficient "quick glance" for the user.

---

## 🔐 Test Credentials

| Role        | Email               | Password |
| ----------- | ------------------- | -------- |
| Super Admin | super@gmail.com     | 12345678 |
| Analyst     | analyst@example.com | 12345678 |
| Viewer      | asif@gmail.com      | 12345678 |

# Financial Records API Documentation

## Authentication

All endpoints require a valid JWT token in the from the browser cookies.

---

## Role Permissions Overview

| Role        | Create | Read | Update | Delete | Summaries             |
| ----------- | ------ | ---- | ------ | ------ | --------------------- |
| VIEWER      | ❌     | ✅   | ❌     | ❌     | Overview, Recent only |
| ANALYST     | ✅     | ✅   | ✅     | ❌     | All summaries         |
| ADMIN       | ✅     | ✅   | ✅     | ✅     | All summaries         |
| SUPER_ADMIN | ✅     | ✅   | ✅     | ✅     | All summaries         |

---

## CRUD Endpoints

### 1. Create Financial Record

**POST** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/financial-records`

**Access:** `ADMIN`, `SUPER_ADMIN`, `ANALYST`

**Request Body:**

```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "SALARY",
  "notes": "Monthly salary"
}
```

| Field      | Type   | Required | Description               |
| ---------- | ------ | -------- | ------------------------- |
| `amount`   | number | ✅       | Must be a positive number |
| `type`     | string | ✅       | `INCOME` or `EXPENSE`     |
| `category` | string | ✅       | See category enum below   |
| `notes`    | string | ❌       | Max 500 characters        |

> **Note:** If `type` is `EXPENSE`, the system checks your net balance. If `amount` exceeds net balance, the request will be rejected.

**Success Response** `201 Created`:

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Financial record created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d0",
    "amount": 5000,
    "type": "INCOME",
    "category": "SALARY",
    "notes": "Monthly salary",
    "isDeleted": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response** `400 Bad Request` (insufficient balance):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Insufficient balance. Your net balance is 3000, but you are trying to expense 5000"
}
```

---

### 2. Get All Records

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/financial-records`

**Access:** `VIEWER`, `ANALYST`, `ADMIN`, `SUPER_ADMIN`

**Query Parameters:**

| Parameter   | Type   | Description                    | Example                 |
| ----------- | ------ | ------------------------------ | ----------------------- |
| `page`      | number | Page number (default: 1)       | `?page=2`               |
| `limit`     | number | Records per page (default: 10) | `?limit=20`             |
| `type`      | string | Filter by type                 | `?type=INCOME`          |
| `category`  | string | Filter by category             | `?category=SALARY`      |
| `userId`    | string | Filter by user                 | `?userId=64f1a2...`     |
| `startDate` | string | Filter from date               | `?startDate=2025-01-01` |
| `endDate`   | string | Filter to date                 | `?endDate=2025-12-31`   |

**Example Request:**

```
GET /api/financial-records?type=INCOME&category=SALARY&page=1&limit=10
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Financial records retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d0",
      "amount": 5000,
      "type": "INCOME",
      "category": "SALARY",
      "notes": "Monthly salary",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalPage": 5,
    "total": 48
  }
}
```

---

### 3. Get Single Record

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/financial-records/:id`

**Access:** `VIEWER`, `ANALYST`, `ADMIN`, `SUPER_ADMIN`

**Path Parameter:** `id` — MongoDB ObjectId of the record

**Example Request:**

```
GET /api/financial-records/64f1a2b3c4d5e6f7a8b9c0d1
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Financial record retrieved successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "userId": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "amount": 5000,
    "type": "INCOME",
    "category": "SALARY",
    "notes": "Monthly salary",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response** `404 Not Found`:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Financial record not found"
}
```

---

### 4. Update Record

**PATCH** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/financial-records/:id`

**Access:** `ANALYST`, `ADMIN`, `SUPER_ADMIN` (own records only)

**Path Parameter:** `id` — MongoDB ObjectId of the record

**Request Body** (all fields optional):

```json
{
  "amount": 6000,
  "category": "FREELANCE",
  "notes": "Updated note"
}
```

| Field      | Type   | Description               |
| ---------- | ------ | ------------------------- |
| `amount`   | number | Must be a positive number |
| `type`     | string | `INCOME` or `EXPENSE`     |
| `category` | string | See category enum below   |
| `notes`    | string | Max 500 characters        |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Financial record updated successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "amount": 6000,
    "type": "INCOME",
    "category": "FREELANCE",
    "notes": "Updated note",
    "updatedAt": "2025-01-16T08:00:00.000Z"
  }
}
```

**Error Response** `401 Unauthorized`:

```json
{
  "success": false,
  "statusCode": 401,
  "message": "You are not authorized to update this record"
}
```

---

### 5. Delete Record (Soft Delete)

**DELETE** `https://zorvyn-backend-int-job-task.vercel.app/api/financial-records/:id`

**Access:** `ADMIN`, `SUPER_ADMIN` (any record), or record **owner**

**Path Parameter:** `id` — MongoDB ObjectId of the record

> **Note:** This is a soft delete. The record is marked as `isDeleted: true` and excluded from future queries.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Financial record deleted successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "isDeleted": true
  }
}
```

**Error Response** `401 Unauthorized`:

```json
{
  "success": false,
  "statusCode": 401,
  "message": "You are not authorized to delete this record"
}
```

---

## Dashboard Summary Endpoints

### 6. Overview Summary

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/financial-records/summary/overview`

**Access:** `VIEWER`, `ANALYST`, `ADMIN`, `SUPER_ADMIN`

Returns total income, total expenses, and net balance across all records.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Overview summary retrieved successfully",
  "data": {
    "totalIncome": 50000,
    "totalExpense": 20000,
    "netBalance": 30000
  }
}
```

---

### 7. Category Summary

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/financial-records/summary/by-category`

**Access:** `ANALYST`, `VIEWER`,`ADMIN`, `SUPER_ADMIN`

Returns total amount and transaction count grouped by type and category.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category summary retrieved successfully",
  "data": [
    {
      "_id": { "type": "INCOME", "category": "SALARY" },
      "total": 30000,
      "count": 6
    },
    {
      "_id": { "type": "EXPENSE", "category": "FOOD" },
      "total": 5000,
      "count": 20
    }
  ]
}
```

---

### 8. Trends

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/financial-records/summary/trends`

**Access:** `VIEWER`, `ANALYST`, `ADMIN`, `SUPER_ADMIN`

Returns income and expense trends grouped by period.

**Query Parameters:**

| Parameter | Type   | Options                      | Default   | Description     |
| --------- | ------ | ---------------------------- | --------- | --------------- |
| `period`  | string | `daily`, `weekly`, `monthly` | `monthly` | Grouping period |

**Example Requests:**

```
GET /api/financial-records/summary/trends?period=daily
GET /api/financial-records/summary/trends?period=weekly
GET /api/financial-records/summary/trends?period=monthly
```

**Success Response** `200 OK` (monthly example):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Trends retrieved successfully",
  "data": [
    {
      "_id": { "year": 2025, "month": 1, "type": "INCOME" },
      "total": 15000,
      "count": 3
    },
    {
      "_id": { "year": 2025, "month": 1, "type": "EXPENSE" },
      "total": 7000,
      "count": 12
    }
  ]
}
```

---

### 9. Recent Activity

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/financial-records/summary/recent`

**Access:** `VIEWER`, `ANALYST`, `ADMIN`, `SUPER_ADMIN`

Returns the most recent financial records.

**Query Parameters:**

| Parameter | Type   | Default | Description                        |
| --------- | ------ | ------- | ---------------------------------- |
| `limit`   | number | 10      | Number of recent records to return |

**Example Request:**

```
GET /api/financial-records/summary/recent?limit=5
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Recent activity retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "amount": 5000,
      "type": "INCOME",
      "category": "SALARY",
      "notes": "Monthly salary",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## Enums Reference

### Transaction Type

| Value     | Description    |
| --------- | -------------- |
| `INCOME`  | Money received |
| `EXPENSE` | Money spent    |

### Transaction Category

| Value           | Type             |
| --------------- | ---------------- |
| `SALARY`        | INCOME           |
| `FREELANCE`     | INCOME           |
| `INVESTMENT`    | INCOME           |
| `FOOD`          | EXPENSE          |
| `TRANSPORT`     | EXPENSE          |
| `UTILITIES`     | EXPENSE          |
| `HEALTHCARE`    | EXPENSE          |
| `ENTERTAINMENT` | EXPENSE          |
| `EDUCATION`     | EXPENSE          |
| `OTHER`         | INCOME / EXPENSE |

---

## Common Error Responses

| Status Code | Meaning                                                 |
| ----------- | ------------------------------------------------------- |
| `400`       | Bad request — validation failed or insufficient balance |
| `401`       | Unauthorized — not the record owner                     |
| `403`       | Forbidden — role does not have permission               |
| `404`       | Record not found                                        |
| `500`       | Internal server error                                   |

---

# User Management API Documentation:

## Role Permissions Overview

| Role | Register | Get All Users | Get Single User | Update User | Get Me | Block/Unblock |
| ---- | -------- | ------------- | --------------- | ----------- | ------ | ------------- |

| VIEWER | ✅ | ❌ | ✅ | ✅ (own only) | ✅ | ❌ |
| ANALYST | ✅ | ❌ | ✅ | ✅ (own only) | ✅ | ❌ |
| ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SUPER_ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 1. Register User

**POST** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/user/register`

**Access:** Public (no authentication required)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "VIEWER"
}
```

| Field      | Type   | Required | Description                                        |
| ---------- | ------ | -------- | -------------------------------------------------- |
| `name`     | string | ✅       | Min 2, max 50 characters                           |
| `email`    | string | ✅       | Must be a valid email address                      |
| `password` | string | ✅       | Min 6, max 20 characters                           |
| `role`     | string | ❌       | `VIEWER`, `ANALYST`, `ADMIN`. Defaults to `VIEWER` |

**Success Response** `201 Created`:

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VIEWER",
    "status": "ACTIVE",
    "isDeleted": false,
    "isBlocked": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response** `403 Forbidden` (user already exists):

```json
{
  "success": false,
  "statusCode": 403,
  "message": "User already exists!!"
}
```

---

### 2. Get All Users

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/user/all-users`

**Access:** `ADMIN`, `SUPER_ADMIN`

**Query Parameters:**

| Parameter     | Type   | Description                           | Example                         |
| ------------- | ------ | ------------------------------------- | ------------------------------- |
| `page`        | number | Page number (default: 1)              | `?page=2`                       |
| `limit`       | number | Users per page (default: 10)          | `?limit=20`                     |
| `role`        | string | Filter by role                        | `?role=ANALYST`                 |
| `searchEmail` | string | Filter by exact email                 | `?searchEmail=john@example.com` |
| `sort`        | string | Sort field, prefix `-` for descending | `?sort=-createdAt`              |

**Example Request:**

```
GET https://zorvyn-backend-int-job-task.vercel.app/api/user/all-users?role=ANALYST&page=1&limit=10&sort=-createdAt
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All Users Retrieved Successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ANALYST",
      "status": "ACTIVE",
      "isDeleted": false,
      "isBlocked": false,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalPage": 3,
    "total": 25
  }
}
```

---

### 3. Get My Profile

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/user/me`

**Access:** `VIEWER`, `ANALYST`, `ADMIN`, `SUPER_ADMIN`

Returns the profile of the currently authenticated user based on the JWT token.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User Retrieved Successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ANALYST",
    "status": "ACTIVE",
    "isDeleted": false,
    "isBlocked": false,
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Get Single User

**GET** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/user/:id`

**Access:** Public (no authentication required)

**Path Parameter:** `id` — MongoDB ObjectId of the user

**Example Request:**

```
GET /api/users/64f1a2b3c4d5e6f7a8b9c0d0
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VIEWER",
    "status": "ACTIVE",
    "isDeleted": false,
    "isBlocked": false,
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### 5. Update User

**PATCH** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/user/:id`

**Access:** All authenticated roles (with restrictions below)

**Path Parameter:** `id` — MongoDB ObjectId of the user

**Role-based Update Restrictions:**

| Field                 | VIEWER / ANALYST | ADMIN                           | SUPER_ADMIN |
| --------------------- | ---------------- | ------------------------------- | ----------- |
| `name`, `email`       | Own profile only | Any user                        | Any user    |
| `role`                | ❌ Cannot change | Can change (not to SUPER_ADMIN) | Any role    |
| `status`, `isDeleted` | ❌ Cannot change | Any user                        | Any user    |
| Update SUPER_ADMIN    | ❌               | ❌                              | ✅          |

**Request Body** (all fields optional):

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "ANALYST",
  "status": "INACTIVE",
  "isDeleted": false
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "ANALYST",
    "status": "INACTIVE",
    "updatedAt": "2025-01-16T08:00:00.000Z"
  }
}
```

**Error Responses:**

`403 Forbidden` — updating another user's profile as VIEWER/ANALYST:

```json
{
  "success": false,
  "statusCode": 403,
  "message": "You can only update your own profile"
}
```

`403 Forbidden` — ADMIN trying to update SUPER_ADMIN:

```json
{
  "success": false,
  "statusCode": 403,
  "message": "An Admin Cannot Update Super Admin"
}
```

`403 Forbidden` — VIEWER/ANALYST trying to change role:

```json
{
  "success": false,
  "statusCode": 403,
  "message": "You cannot update your role"
}
```

---

### 6. Block User

**PATCH** `https://zorvyn-backend-int-job-task.vercel.app/api/user/block/:id`

**Access:** `ADMIN`, `SUPER_ADMIN`

**Path Parameter:** `id` — MongoDB ObjectId of the user to block

> **Note:** Cannot block `ADMIN` or `SUPER_ADMIN` users. Cannot block an already blocked user.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User Blocked Successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VIEWER",
    "isBlocked": true
  }
}
```

**Error Responses:**

`403 Forbidden` — trying to block an admin user:

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Cannot Block Admin Users"
}
```

`404 Not Found` — user already blocked:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User is Already Blocked!"
}
```

---

### 7. Unblock User

**PATCH** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/user/unblock/:id`

**Access:** `ADMIN`, `SUPER_ADMIN`

**Path Parameter:** `id` — MongoDB ObjectId of the user to unblock

> **Note:** Cannot unblock a user that is not blocked.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User Unblocked Successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "VIEWER",
    "isBlocked": false
  }
}
```

**Error Response** `404 Not Found` — user already unblocked:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "User is Already Unblocked"
}
```

---

## 🔑 Auth API

**Base URL:** `https://zorvyn-backend-int-job-task.vercel.app/api/v1/auth`

---

### Endpoints Overview

| Method | Endpoint                       | Description                                   | Access    |
| ------ | ------------------------------ | --------------------------------------------- | --------- |
| POST   | `/api/v1/auth/login`           | Login with email & password                   | Public    |
| POST   | `/api/v1/auth/refresh-token`   | Get new access token via refresh token cookie | Public    |
| POST   | `/api/v1/auth/logout`          | Clear auth cookies                            | Public    |
| POST   | `/api/v1/auth/change-password` | Change current user password                  | All roles |

---

### 1. Login

**POST** `/api/v1/auth/login`

**Request Body:**

```json
{
  "email": "super@gmail.com",
  "password": "12345678"
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d0",
      "name": "Super Admin",
      "email": "super@gmail.com",
      "role": "SUPER_ADMIN",
      "status": "ACTIVE",
      "isDeleted": false,
      "isBlocked": false,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

> **Note:** `accessToken` and `refreshToken` are also set as `httpOnly` cookies automatically.

---

### 2. Refresh Token

**POST** `/api/v1/auth/refresh-token`

Reads the `refreshToken` from cookies and returns a new `accessToken`.

> **Note:** Requires `refreshToken` cookie to be present in the request.

---

### 3. Logout

**POST** `/api/v1/auth/logout`

Clears both `accessToken` and `refreshToken` cookies from the browser.

---

### 4. Change Password

**POST** `/api/v1/auth/change-password`

**Access:** All authenticated roles — requires accessToken from the cookies, and an user can change only his own account password

**Request Body:**

```json
{
  "oldPassword": "12345678",
  "newPassword": "newpassword123"
}
```

## Enums Reference

### User Role

| Value         | Description                                 |
| ------------- | ------------------------------------------- |
| `VIEWER`      | Can only view dashboard data. Default role. |
| `ANALYST`     | Can view records and access insights        |
| `ADMIN`       | Can manage records and users                |
| `SUPER_ADMIN` | Full system access                          |

### User Status

| Value      | Description                     |
| ---------- | ------------------------------- |
| `ACTIVE`   | User is active. Default status. |
| `INACTIVE` | User is inactive                |

---

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asif2241/zorvyn-job-task
   cd zorvyn-job-task
   ```
2. **Install The Dependencies**
   ```bash
   npm install
   ```
3. **To Run The Project**
   ```bash
   npm run dev
   ```

### LIVE LINK : https://zorvyn-backend-int-job-task.vercel.app/
