# ebk-nestjs

A NestJS REST API for managing users, built with TypeScript. Features in-memory user storage, API key authentication, role-based access control, request validation, and standardized response transformation.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Request/Response Format](#requestresponse-format)
- [Data Transfer Objects (DTOs)](#data-transfer-objects-dtos)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Linting & Formatting](#linting--formatting)
- [Available Scripts](#available-scripts)

## Features

- **CRUD operations** for users (create, read, update, delete)
- **In-memory storage** (array-based, resets on restart)
- **API Key middleware** — requires `x-api-key` header on all `/user` routes
- **Role-based guard** — global `RoleGuard` requiring `role: admin` header
- **DTO validation** with `class-validator`/`class-transformer` via global `ValidationPipe`
- **Response interceptor** — wraps all responses in `{ statusCode, message, data }`
- **Custom logger service** for structured console logging
- **NestJS v11** with TypeScript strict mode

## Project Structure

```
src/
├── app.controller.ts          # Root controller (GET /)
├── app.service.ts             # Hello World service
├── app.module.ts              # Root module + ApiKeyMiddleware config
├── main.ts                    # Bootstrap (global guard, interceptor, pipe)
├── guards/
│   └── role.guard.ts          # Global admin role guard
├── middleware/
│   └── api-key.middleware.ts  # API key validation for /user routes
├── utils/
│   └── transform.interceptor.ts  # Global response wrapper interceptor
├── user/
│   ├── user.module.ts         # User module
│   ├── user.controller.ts     # REST controller at /user
│   ├── user.service.ts        # Business logic + in-memory store
│   ├── user.logger.ts         # Custom logger service
│   ├── dto/
│   │   ├── create-user.dto.ts # Create user DTO with validators
│   │   └── update-user.dto.ts # Update user DTO
│   ├── user.service.spec.ts   # Service unit tests
│   └── user.controller.spec.ts# Controller unit tests
test/
├── app.e2e-spec.ts            # End-to-end tests
└── jest-e2e.json              # E2E jest config
```

## API Endpoints

Base URL: `http://localhost:3000`

All `/user/*` endpoints require both `x-api-key` and `role` headers.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | Hello World message | No |
| `GET` | `/user?name=query` | List users (optional case-insensitive name filter) | Yes (API key) |
| `GET` | `/user/:id` | Get a single user by ID | Yes (API key) |
| `POST` | `/user` | Create a new user | Yes (API key) |
| `PUT` | `/user/:id` | Update an existing user | Yes (API key) |
| `DELETE` | `/user/:id` | Delete a user | Yes (API key + Admin role) |

### Example Responses

**List users** `GET /user?name=david`
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    { "id": 1, "name": "Ebuka Aranye", "email": "davidachibiri6@gmail.com" }
  ]
}
```

**Get user by ID** `GET /user/1`
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { "id": 1, "name": "Ebuka Aranye", "email": "davidachibiri6@gmail.com" }
}
```

**Create user** `POST /user`
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": { "id": 3, "name": "Jane Doe", "email": "jane@example.com" }
}
```

**Not found** `GET /user/999`
```json
{
  "statusCode": 404,
  "message": "User with id 999 not found",
  "error": "Not Found"
}
```

## Authentication & Authorization

### API Key Middleware

Applied to all `UserController` routes via `AppModule.configure()`.

- **Header:** `x-api-key`
- **Expected value:** `secret-key-123`
- **Failure:** `401 Unauthorized` — `Invalid API Key`

### Role Guard

Registered as a **global guard** in `main.ts`.

- **Header:** `role`
- **Expected value:** `admin`
- **Failure:** `401 Unauthorized` — `You do not have permission to perform this action`
- **Enforced on:** All routes (practically relevant for `DELETE /user/:id`)

### Example Request with cURL

```bash
# List all users
curl -i http://localhost:3000/user \
  -H "x-api-key: secret-key-123" \
  -H "role: admin"

# Create a user
curl -i -X POST http://localhost:3000/user \
  -H "x-api-key: secret-key-123" \
  -H "role: admin" \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'

# Delete a user (requires admin role)
curl -i -X DELETE http://localhost:3000/user/1 \
  -H "x-api-key: secret-key-123" \
  -H "role: admin"
```

## Request/Response Format

### Request Validation

A global `ValidationPipe` validates incoming DTOs using `class-validator` decorators. Invalid requests return `400 Bad Request` with validation error details.

### Response Transformation

A global `TransformInterceptor` wraps every successful response:

```typescript
{
  statusCode: number;
  message: string;   // always "Success" for 2xx responses
  data: any;
}
```

## Data Transfer Objects (DTOs)

### CreateUserDto (`src/user/dto/create-user.dto.ts`)

| Field | Type | Constraints | Required |
|-------|------|-------------|----------|
| `name` | string | Min length: 3 | Yes |
| `email` | string | Must be a valid email | Yes |

### UpdateUserDto (`src/user/dto/update-user.dto.ts`)

Extends `CreateUserDto`, inheriting the same validation rules.

### User Entity (`src/user/user.service.ts`)

| Field | Type |
|-------|------|
| `id` | number |
| `name` | string |
| `email` | string |

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd ebk-nestjs

# Install dependencies
npm install
```

## Running the Application

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build

# Start production server
npm run start:prod

# Debug mode
npm run start:debug
```

The server listens on `PORT` environment variable, defaulting to `3000`.

## Running Tests

```bash
# Unit tests
npm run test

# Test watch mode
npm run test:watch

# Test with coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```

## Linting & Formatting

```bash
# Lint source and test files
npm run lint

# Format with Prettier
npm run format
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `nest build` | Compile TypeScript to `dist/` |
| `format` | `prettier --write "src/**/*.ts" "test/**/*.ts"` | Format code with Prettier |
| `start` | `nest start` | Start the application |
| `start:dev` | `nest start --watch` | Start in watch mode (dev) |
| `start:debug` | `nest start --debug --watch` | Start in debug watch mode |
| `start:prod` | `node dist/main.js` | Start compiled production build |
| `lint` | `oxlint src/ test/` | Lint source and tests |
| `test` | `jest` | Run unit tests |
| `test:watch` | `jest --watch` | Run tests in watch mode |
| `test:cov` | `jest --coverage` | Run tests with coverage |
| `test:e2e` | `jest --config ./test/jest-e2e.json` | Run end-to-end tests |

## Tech Stack

- **Framework:** NestJS v11
- **Language:** TypeScript (ES2023, strict mode)
- **Validation:** class-validator, class-transformer
- **Testing:** Jest, supertest, @nestjs/testing
- **Linting:** oxlint
- **Formatting:** Prettier

## License

UNLICENSED