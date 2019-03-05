https://pro-gram.ru/smart-dns-on-bind9.html
https://k.psu.ru/wiki/BIND9_(%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5_%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%B8%D0%B5)

SOA

SOA запись в файле зоны должна быть только одна. В файле она должна стоять первой. Запись SOA определяет какой сервер является владельцем зоны и какие на зону установлены параметры. После записи SOA надо обязательно указать IN NS запись с тем-же сервером, что и в заголовке.

Пример: домен example.com обслуживается серверами ns.example.com и ns.examle.net. После указания директивы $ORIGIN сервер автоматически допишет за нас все неполные dns имена (таким образом hostmaster читается как hostmaster.example.com). Имя сервера вне зоны пишется полностью.

$TTL 2d ; zone TTL default = 2 days or 172800 seconds
$ORIGIN example.com.
@      IN      SOA   ns hostmaster (
               2003080800 ; serial number
               1d12h      ; refresh =  1 day 12 hours
               15M        ; update retry = 15 minutes
               3W12h      ; expiry = 3 weeks + 12 hours
               2h20M      ; minimum = 2 hours + 20 minutes
               )
       IN      NS  ns
       IN      NS  ns.example.net.  ; out-of-zone 
...
; A record for the NS RR above
ns     IN      A   192.168.2.1
;




DNS который отдает разные адреса, в зависимости от адреса клиента.

Представьте ситуацию — у вас есть какая то локальная сеть, есть какой то ресурс или доменное имя, и вы хотите, что бы клиентам из локальной сети возвращался локальный адрес ресурса, а клиентам из интернета — внешний.

Первое что приходит на ум — поднять 2 DNS сервера, один — для внешних клиентов, другой для внутренних. Но допустим, в вашей внутренней сети несколько подсетей и для каждой нужно отдавать свои ответы — поднимать кучу серверов? Или весьма проблематично или невозможно изменить используемые клиентами DNS адреса в настройках клиентских устройств?

В общем задался я этим вопросом и нашел весьма простое и интересное решение — использовать DNS сервер bind9, и для него использовать ACL списки.
Начальные данные

Имеем сервер под управлением Ubuntu Server 16.04. Установлены пакеты isc-dhcp-server, bind9, настроен nat.

Как все это установить и настроить читаем в данной статье.
Обновление системы

И как всегда первым делом обновим нашу систему:

sudo apt update
sudo apt dist-upgrade

Создадим папки для хранения конфигураций для локальных и внешних клиентов:

sudo mkdir /etc/bind/local
sudo mkdir /etc/bind/inet

Создадим конфигурации зон:

sudo nano /etc/bind/local/db.dom

Соответственно db.dom замените на ваш домен. Содержимое файла должно быть примерно таким:

$ORIGIN .
$TTL 604800
dom IN SOA ns1.dom. root.ns1.dom. (
                2018041007 ; Serial
                604800 ; Refresh
                86400 ; Retry
                2419200 ; Expire
                604800 ; Negative Cache TTL
                )
@   NS  ns1.dom.
@   A   10.5.5.1
$ORIGIN dom.
$TTL 604800
ns1 A   10.5.5.1

10.5.5.1 — внутренний адрес ресурса

sudo nano /etc/bind/inet/db.dom

Содержимое файла:

$ORIGIN .
$TTL 604800
dom IN SOA ns1.dom. root.ns1.dom. (
                2018041007 ; Serial
                604800 ; Refresh
                86400 ; Retry
                2419200 ; Expire
                604800 ; Negative Cache TTL
                )
@   NS  ns1.dom.
@   A   11.22.33.44
$ORIGIN dom.
$TTL 604800
ns1 A   11.22.33.44

11.22.33.44 — внешний адрес ресурса.

Дальше отредактируем конфигурационный файл bind для того, чтобы он возвращал правильный адрес ресурса клиентам:

nano /etc/bind/named.conf.local

Приводим содержимое этого файла к следующему виду:

acl lan {
        127.0.0.0/8;
        10.5.5.0/24;
        };
view lan {
        match-clients { lan; };
        recursion yes;
        zone "." {type hint; file "/etc/bind/db.root";};
        zone "localhost" {type master; file "/etc/bind/db.local";};
        zone "127.in-addr.arpa" {type master; file "/etc/bind/db.127";};
        zone "0.in-addr.arpa" {type master; file "/etc/bind/db.0";};
        zone "255.in-addr.arpa" {type master; file "/etc/bind/db.255";};
        zone "dom" {type master; file "/etc/bind/local/db.dom";};
        };

view "inet" {
        match-clients { any; };
        recursion no;
        zone "dom" {type master; file "/etc/bind/inet/db.dom";};
        };

acl lan — наш список IP адресов, таких списков может быть несколько. В этой секции мы указываем адреса или сети, для которых хотим отдавать локальный адрес ресурса.

view «inet» — обработка для всех остальных клиентов, которые не входят в список lan.

Еще обратите внимание на параметр  recursion no; и recursion yes; Будьте внимательны, включенные рекурсивные запросы могут использоваться для различных атак с использованием вашего сервера. Если вы не планируете прописывать ваш DNS сервер клиентам — лучше отключите рекурсивные запросы.

Так же неплохо было бы включить логи для нашего DNS сервера, это необязательно, и даже наверное лучше после тестирования выключить. В общем набираем:

mkdir -p /var/log/named/
cd /var/log/named
touch ./misc.log ./query.log
chmod -R 664 /var/log/named/
chown -R bind:bind /var/log/named/

Приводим файл named.conf к следующему виду:

nano /etc/bind/named.conf

logging {
channel "misc" {file "/var/log/named/misc.log" versions 4 size 4m; print-time YES; print-severity YES; print-category YES;};
channel "query" {file "/var/log/named/query.log" versions 4 size 4m; print-time YES; print-severity NO; print-category NO;};
category default {"misc";};
category queries {"query";};
};

include "/etc/bind/named.conf.options";
include "/etc/bind/named.conf.local";
//include "/etc/bind/named.conf.default-zones";

Мы включили логирование, а так же отключили стандартные зоны (обратите внимание на строчку //include "/etc/bind/named.conf.default-zones";), т.к. мы их прописали в файле named.conf.local , их в данной конфигурации нужно выключать обязательно.

Перезапускаем bind:

/etc/init.d/bind9 restart

Проверяем, что он запустился без ошибок:

systemctl status bind9

Он должен быть в статусе active:

  Active: active (running)

После этого можно проверять — для адресов указанных в acl будут возвращаться одни адреса, для всех остальных другие.

Тут есть один нюанс — запрос на ваш сервер будет приходить с адресов DNS серверов, которые указаны у клиента, а не непосредственно с клиентского адреса. Т.е. если у клиента прописаны гугловые DNSы, то и запросы на ваш сервер будут приходить с гугловых серверов, учитывайте это.
