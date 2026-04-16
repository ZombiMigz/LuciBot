.PHONY: setup lint format format-check test deploy

setup:
	npm ci

lint:
	npm run lint

format:
	npm run format

format-check:
	npm run format:check

test:
	npm run test

deploy:
	npm exec cdktf -- deploy --auto-approve
