 $ docker info --format '{{.LoggingDriver}}'
json-file


# cat << EOF > /etc/docker/daemon.json {
"log-driver": "journald" }
EOF

# systemctl daemon-reload && systemctl restart docker.service

$ docker info --format '{{.LoggingDriver}}'
journald

$ docker run -d -P --name=myweb --log-opt tag=myweb_tag myhttpd:2.0

$ journalctl -b CONTAINER_NAME=myweb
$ journalctl -b CONTAINER_TAG=myweb_tag


https://linux-notes.org/rabota-s-logami-logs-v-docker/