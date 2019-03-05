https://debianworld.ru/articles/rotaciya-logov-s-pomoshyu-logrotate-v-debian-ubuntu/

$ more /etc/logrotate.d/debianworld.ru
# Ротация логов nginx (front-end)
# Отдает статику, все остальное - проксирует на apache.
# Лог ведется более интенсивно. 
/home/dw/debianworld.ru/logs/nginx_*.log {
    daily                   # ежедневная ротация
    missingok               # отсутствие файла не является ошибкой
    rotate 45               # хранится история за 45 дней
    compress                # ротируемые файлы сжимаются
    delaycompress           # ротируемый файл не сжимается, остальные - сжимаются
    notifempty              # не обрабатывать пустые файлы
    create 640 dw www-data  # права, пользователь нового файла
    sharedscripts           # prerotate/postrotate выполняются только 1 раз
    prerotate               # Cбор статистики посещений для AWstats
            /usr/bin/perl /usr/lib/cgi-bin/awstats.pl -update -config=debianworld.ru -databasebreak=day
    endscript               
    postrotate              # Перезапуск nginx
            [ ! -f /var/run/nginx.pid ] || kill -USR1 `cat /var/run/nginx.pid`
    endscript
}



После того, как конфигурационный файл создан, необходимо убедиться, что все будет работать именно так, как и задумано. Для этого необходимо выполнить (при этом, реальных изменений никаких не будет, так как запуск будет выполнен в отладочном режиме):

$ sudo logrotate -d /etc/logrotate.d/debianworld.ru

После того, как по диагностическим сообщениям стало ясно, что все в порядке, необходимо непосредственно запустить ротацию:

$ sudo logrotate -v -f /etc/logrotate.d/debianworld.ru

В дальнейшем ротация будет выполняться автоматически с заданным в конфигурационном файле интервалом. 



