# Makefile for  alertMFB proj

# Environment variables
export $(shell [ -f .env ] && echo $(shell cat .env | sed 's/=.*//'))

# Commands for Prisma
.PHONY: prisma-generate prisma-migrate-dev prisma-migrate-prod prisma-seed prisma-studio

prisma-generate:
	@echo "Generating Prisma Client..."
	@npx prisma generate

prisma-migrate-dev:
	@echo "Running Prisma migrations in development..."
	@npx prisma migrate dev

prisma-migrate-prod:
	@echo "Running Prisma migrations in production..."
	@npx prisma migrate deploy

prisma-seed:
	@echo "Seeding database..."
	@node ./dist/src/database/seed.ts

prisma-studio:
	@echo "Starting Prisma Studio..."
	@npx prisma studio

# Commands for NestJS
.PHONY: install start start-dev lint build test

install:
	@echo "Installing dependencies..."
	@npm install

start:
	@echo "Starting the server..."
	@npm run start

start-dev:
	@echo "Starting the server in development mode..."
	@npm run start:dev

lint:
	@echo "Linting the code..."
	@npm run lint

build:
	@echo "Building the project..."
	@npm run build

test:
	@echo "Running tests..."
	@npm run test

# Combined commands
migrate: prisma-generate prisma-migrate-dev

deploy: prisma-generate prisma-migrate-prod

run: build start
