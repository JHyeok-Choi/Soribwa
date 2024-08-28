build:
	docker-compose -f docker-compose.yml build
run:
	docker run -it -d -p 5400:5400 --env-file ../.env --name pythonj pythonj:1.0
	docker run -it -d -p 8400:8400 --env-file ../.env --name nodejsj nodejsj:1.0
	docker run -it -d -p 3400:3400 --env-file ../.env --name reactj reactj:1.0
exec:
	docker exec -it python /bin/bash
logs:
	docker logs python
ps:
	docker ps -a
img:
	docker images
rm:
	docker rm -f $$(docker ps -aq)
rmi:
	docker rmi $$(docker images -q)
