.PHONY: setup lint format format-check test deploy

setup:
	npm ci
	npx cdktf get

lint:
	npm run lint

format:
	npm run format

format-check:
	npm run format:check

test:
	npm run test

deploy:
	npx cdktf deploy --auto-approve
