```
version: "2.4"
services:
  phpmyadmin:
    image: phpmyadmin
    container_name: phpmyadmin
    environment:
     - PMA_ARBITRARY=1
    restart: always
    ports:
     - 8080:80
    volumes:
     - /tmp:/sessions
    networks:
      - nocodb
      - nocodb_ext
    environment:
      MYSQL_ROOT_PASSWORD: password
      PMA_HOST: root_db

  nocodb:
    depends_on:
      root_db:
        condition: service_healthy
    environment:
      NC_DB: "mysql2://root_db:3306?u=noco&p=password&d=root_db"
      NC_DISABLE_TELE:
#      NC_ADMIN_EMAIL: "SuperAdmin"
#      NC_ADMIN_PASSWORD: "SuperPass"
    image: "nocodb/nocodb:latest"
    restart: always
    volumes:
      - "./data/nc:/usr/app/data"
    labels:
      caddy: db.ts.ru
      caddy.reverse_proxy: "{{upstreams 8080}}"
    networks:
      - nocodb
      - nocodb_ext
  root_db:
    environment:
      MYSQL_DATABASE: root_db
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: password
      MYSQL_USER: noco
    healthcheck:
      retries: 10
      test:
        - CMD
        - mysqladmin
        - ping
        - "-h"
        - localhost
      timeout: 20s
    image: "mysql:5.7"
    restart: always
    volumes:
      - "./data/db:/var/lib/mysql"
#    below line shows how to change charset and collation
#    uncomment it if necessary
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    networks:
      - nocodb

networks:
  nocodb_ext:
    external:
       name: web
  nocodb:

```






 
 
 
 
 
 
 
 
 You may update roles by changing to org-level-creator,super. Restart and retry.

If it is still not working, try passing NC_ADMIN_EMAIL and NC_ADMIN_PASSWORD to reinit the admin. You can remove these 2 env variables after that.

Created at 1 week ago

candideu
@wingkwong That works! Thank you.

For reference, I went to the nc_users_v2 table and updated my roles field from org-level-creator to org-level-creator,super. I then redeployed my Railway app.
