# Wordpress в docker и проброс samba
 


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
        echo "Перезапустим сайты"
     else
        echo "Сервер недоступен"
     fi
  fi



  <Directory "/var/www/html/wp-content/uploads/files">
    EnableSendfile On
  </Directory>

  Alias "/files" "/var/www/html/wp-content/uploads/files"




  Options  -Indexes
  Allow from all
