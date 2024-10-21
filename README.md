If you're using Postman for API testing, you might want to structure your NestJS application documentation to ensure that your API endpoints are easily discoverable and can be tested thoroughly. Since you're also using Postman, you can either export a Postman collection for others to use or integrate Swagger for comprehensive API documentation.

Here's how you can provide a clear and professional readme that includes both Swagger setup and mentions of Postman usage:

---

# NestJS Prisma Project

This is a **NestJS** project using **Prisma ORM** and **JWT Authentication**. The project implements role-based access control (RBAC), user management, password reset functionality, and more.

## Table of Contents

- [NestJS Prisma Project](#nestjs-prisma-project)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
  - [API Documentation](#api-documentation)
    - [Using Swagger](#using-swagger)
    - [Using Postman](#using-postman)
  - [Testing](#testing)
  - [Deployment](#deployment)

## Installation

1. Clone the repository:

```bash
$ git clone <your-repo-url>
```

2. Navigate into the project directory:

```bash
$ cd nestjs-prisma-project
```

3. Install dependencies:

```bash
$ npm install
```

4. Set up environment variables in a `.env` file:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

5. Set up the database with Prisma:

```bash
$ npx prisma migrate dev
```

## Running the Project

To start the NestJS server:

```bash
# Development
$ npm run start

# Watch mode (for development)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## API Documentation

This project provides API documentation through **Swagger** and supports **Postman** for testing.

### Using Swagger

Swagger provides an interactive API documentation interface that can be accessed once the server is running.
Once your server is running, open the browser and visit:

```
http://localhost:3000/api
```

### Using Postman

You can use use Postman to manually test all the API endpoints. To facilitate this,visit :

```
http://localhost:3000/api
```

## Testing

The project includes both **unit tests** and **integration tests**.

1. Run unit tests:

```bash
$ npm run test
```

2. Run integration tests:

```bash
$ npm run test:e2e
```

3. Check test coverage:

```bash
$ npm run test:cov
```

## Deployment

To deploy the project, follow these steps:

1. Make sure the environment variables are properly set for production, especially `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`. example of how the env file is structured can be found in .env.sample file
2. Build the project:

```bash
$ npm run build
```

3. Then deploy

For detailed deployment instructions, refer to [NestJS Deployment Docs](https://docs.nestjs.com/deployment).

---
