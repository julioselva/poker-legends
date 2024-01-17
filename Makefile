SHELL  := /bin/bash
SOURCE := $(shell pwd)

help: ## display this help text
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-10s\033[0m %s\n", $$1, $$2}'

setup: ## remove dist and node modules, then reinstall it
	rm -rf dist node_modules && npm install

tests: ## runs the unit tests, then the integration tests
	npm run test && npm run test:e2e

dev: ## starts the application in development mode
	npm run start:dev

start: ## builds the application, then starts it in production mode
	npm run build && NODE_ENV=production node dist/main
