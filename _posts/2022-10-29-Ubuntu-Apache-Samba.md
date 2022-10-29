# Wordpress в docker и проброс samba
 
Поступила задача пробросить на корпоративный сайт папку расшаренную в локальной сети.

Итак окружение:
 * Сервер NAS (Windows) 
    * Папка доступная по сети `files_for_site`
      * В папке в корне лижит обязательный пустой файл `ok` по нему определяется удачность монтирования. 
 * Сервер SITE (Ubuntu)
    * Wordpress и Apache в докере.



## Wordpress 
Рабочий каталог размещен по пути `/website/wordpress/`

docker-compose:
```
  version: '3'

  services:
    wp:
      image: wordpress:6.0.0-php8.1-apache # https://hub.docker.com/_/wordpress/
      volumes:
        - ./data/wp_config/php.conf.ini:/usr/local/etc/php/conf.d/conf.ini
        - ./data/wp-app:/var/www/html # Full wordpress project
        - ./log/wp:/var/log
        - ./data/wp-config.php:/wp-config.php:ro
        - ./data/apache2.conf:/etc/apache2/apache2.conf:ro
        - ./data/remoteip.conf:/etc/apache2/conf-available/remoteip.conf:ro
      restart: always
      environment:
        TZ: "Europe/Moscow"
```

## Скрипт монтирования
Скрипт который монтирует нужную папку из сети в каталог сайта:
```
  #!/bin/bash
  if [ -f /website/wordpress/data/wp-app/wp-content/uploads/files/ok ]
  then
     echo "Все хорошо."
  else
     echo "Что-то пошло не так"
     echo "Перемонтируем каталог"
     mount //nas/files_for_site /website/wordpress/data/wp-app/wp-content/uploads/files \
             -t cifs \
             -o noserverino,\
             username=site,password=Password,ro,uid=33,gid=33,file_mode=0755,dir_mode=0755
     if [ -f /website/wordpress/data/wp-app/wp-content/uploads/files/ok ]
     then  
        echo "Получилось"
     else
        echo "Сервер недоступен"
     fi
  fi
```
Перезапускается каждые полчаса.

## Apache

В `Apache2.conf` добавлены следующие строки:
```
 <Directory "/var/www/html/wp-content/uploads/files">
   EnableSendfile On
 </Directory>
```
Здесь путь указан для окружения внутри докер контейнера.
Соответственно `Apche2.conf` пробрасывается вовнутрь

Для того чтобы укоротить ссылку на сайте в `Apache2.conf` 
внесена следующая строка:
```
Alias "/files" "/var/www/html/wp-content/uploads/files"
```
Теперь фалы из расшаренного каталога открываются по ссылке `https://site.ru/files/FAIL.jpg`

## htaccess
Еще один обязательный файл в корне расшаренного каталога `.htaccess`:
```
  Options  -Indexes
  Allow from all
```
Для того чтобы разрешить открытие файлов по прямой ссылке.