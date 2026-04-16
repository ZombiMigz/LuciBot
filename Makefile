WORKSPACES = bot infra

install-hooks:
	git config core.hooksPath .githooks

lint:
	@$(MAKE) -C bot lint
	@$(MAKE) -C infra lint

format:
	@$(MAKE) -C bot format
	@$(MAKE) -C infra format

format-check:
	@$(MAKE) -C bot format-check
	@$(MAKE) -C infra format-check

test:
	@$(MAKE) -C bot test
	@$(MAKE) -C infra test
