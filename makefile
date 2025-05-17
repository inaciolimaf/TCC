build:
	docker-compose -f local.yml build --build-arg CLEAN_CACHE=true --no-cache
up:
	docker-compose -f local.yml up -d

down:
	docker-compose -f local.yml down

logs:
	docker-compose -f local.yml logs -f
