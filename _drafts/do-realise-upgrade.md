https://itisgood.ru/2020/04/27/kak-ispravit-oshibku-do-release-upgrade-command-not-found-error-na-ubuntu/

Исправление do-release-upgrade: command not found Error на Ubuntu
Я выполнил следующую команду для обновления до сервера Ubuntu 20.04:

$ sudo do-release-upgrade -d
Мы используем команду «do-release-upgrade» для обновления серверов Ubuntu без среды графического интерфейса.
Пример вывода:

sudo do-release-upgrade: command not found
Чтобы устранить эту ошибку на Ubuntu, вам необходимо установить пакет «ubuntu-release-upgradeder-core».
Он предоставляет команду «do-release-upgrade», которая позволяет пользователям обновиться до последней доступной Ubuntu с помощью Ubuntu Release Upgrader.
Чтобы установить этот пакет, просто запустите следующую команду:

$ sudo apt install ubuntu-release-upgrader-core 
