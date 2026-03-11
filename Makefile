.PHONY: migration
migration:
	@echo "Starting temporary PostgreSQL for migration..."
	@docker rm -f prisma-migration-temp 2>/dev/null || true
	@docker run -d --name prisma-migration-temp \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=tarot \
		-p 5433:5432 \
		postgres:16-alpine
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 5
	@echo "Creating migration..."
	@DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tarot?schema=public" \
		npx prisma migrate dev --name $(NAME)
	@echo "Cleaning up temporary database..."
	@docker stop prisma-migration-temp 2>/dev/null || true
	@docker rm prisma-migration-temp 2>/dev/null || true
	@echo "Migration created successfully!"

.PHONY: migration-validate
migration-validate:
	@echo "Starting temporary PostgreSQL for validation..."
	@docker rm -f prisma-validate-temp 2>/dev/null || true
	@docker run -d --name prisma-validate-temp \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=tarot \
		-p 5433:5432 \
		postgres:16-alpine
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 3
	@echo "Applying migrations..."
	@DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tarot?schema=public" \
		npx prisma migrate deploy
	@echo "Validating database schema..."
	@DATABASE_URL="postgresql://postgres:postgres@localhost:5433/tarot?schema=public" \
		npx prisma db pull --force
	@echo "Cleaning up temporary database..."
	@docker stop prisma-validate-temp 2>/dev/null || true
	@docker rm prisma-validate-temp 2>/dev/null || true
	@echo "Migration validation completed successfully!"

.PHONY: cleanup-db-containers
cleanup-db-containers:
	@echo "Cleaning up any leftover database containers..."
	@docker rm -f prisma-migration-temp 2>/dev/null || true
	@docker rm -f prisma-validate-temp 2>/dev/null || true
	@echo "Cleanup done!"

.PHONY: docker-build
docker-build:
	@echo "Building app image..."
	docker build -f build/app.Dockerfile -t tarot-core:latest .
	@echo "Building migration image..."
	docker build -f build/mig.Dockerfile -t tarot-core-migration:latest .

.PHONY: helm-install
helm-install:
	helm upgrade --install tarot-core ./deploy/chart \
		--namespace tarot-core --create-namespace \
		$(HELM_VALUES)

.PHONY: helm-uninstall
helm-uninstall:
	helm uninstall tarot-core --namespace tarot-core
