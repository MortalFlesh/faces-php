.PHONY: help build build-dashboard build-api run-dashboard run-api stop clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: build-dashboard build-api ## Build both dashboard and API Docker images

build-dashboard: ## Build the dashboard Docker image
	docker build -f dashboard.Dockerfile -t faces-dashboard ..

build-api: ## Build the API Docker image
	docker build -f api.Dockerfile -t faces-api ..

run-dashboard: ## Run the dashboard container on port 3000
	docker run -d -p 3000:3000 --add-host host.docker.internal:host-gateway --name faces-dashboard faces-dashboard
	@echo ""
	@echo "Dashboard is running at http://localhost:3000"
	@echo "To view logs: docker logs -f faces-dashboard"
	@echo "To stop: make stop"

run-api: ## Run the API container on port 8080
	docker run -d -p 8080:8080 --name faces-api faces-api
	@echo ""
	@echo "API is running at http://localhost:8080"
	@echo "To view logs: docker logs -f faces-api"
	@echo "To stop: make stop"

stop: ## Stop and remove both containers
	-docker stop faces-dashboard faces-api 2>/dev/null
	-docker rm faces-dashboard faces-api 2>/dev/null

clean: stop ## Remove containers and images
	-docker rmi faces-dashboard faces-api 2>/dev/null


