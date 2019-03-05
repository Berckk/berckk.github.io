https://www.8host.com/blog/ustanovka-webmin-na-server-ubuntu-18-04/

Установка Webmin

Добавьте репозиторий Webmin, с помощью которого можно установить и в дальнейшем обновлять консоль. Его нужно добавить в файл /etc/apt/sources.list.

`sudo nano /etc/apt/sources.list`

В конец файла добавьте новый репозиторий:


`deb http://download.webmin.com/download/repository sarge contrib`

Сохраните и закройте файл.

Добавьте PGP-ключ Webmin, чтобы система знала, что новому репозиторию можно доверять.

`wget http://www.webmin.com/jcameron-key.asc`
`sudo apt-key add jcameron-key.asc`

Обновите индекс пакетов, чтобы добавить в него репозиторий Webmin.

`sudo apt update`

Установите Webmin:

`sudo apt install webmin`

После окончания установки вы увидите:

Webmin install complete. You can now login to
https://your_server_ip:10000 as root with your
root password, or as any user who can use `sudo`.