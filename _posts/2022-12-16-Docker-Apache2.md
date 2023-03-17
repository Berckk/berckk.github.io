---
layout: post
title: Перенос вывода логов Apache2 во вне Docker.
permalink: Docker-apache2/
tags: docker apache2
---
Перенос вывода логов Apache2 в вывод Docker.
---

Изменился только файл виртуального хоста по умолчанию:
```
/etc/apache2/sites-enabled/000-default.conf
```
Заодно избавимся от сообщения в логах:
```
"OPTIONS * HTTP/1.0" 200 181 "-" "Apache (internal dummy connection)"
```
Документация это объясняет:
```
Веб-серверу Apache для управления дочерними процессами требуется механизм активации процессов, которые прослушивают новые подключения. Для реализации этой задачи он отправляет простой HTTP-запрос самому себе.
```

```
<VirtualHost *:80>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        #ServerName www.example.com

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn
        
        SetEnvIf Remote_Addr "::1" loopback
        SetEnvIf Remote_Addr "127\.0\.0\.1" loopback
        CustomLog  /dev/stdout combined env=!loopback
        ErrorLog /dev/stderr

        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
</VirtualHost>
```
Теперь логи Apache2 доступны командой: `docker logs "ИД контейнера"`
Или `docker-compose logs`.