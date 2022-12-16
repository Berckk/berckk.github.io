---
layout: post
title: Скрипт обновления Ubuntu.
permalink: Upgrade/
tags: ubuntu upgrade
---
Скрипт обновления Ubuntu.
---
Создаем файл.
```
sudo -e /usr/local/bin/upgrade.sh
```
Сам скрипт:
```
#!/bin/bash

if [ "$(id -u)" -ne 0 ]; then
    echo 'This script must be run with root privileges' >&2
    exit 1
fi

apt update && apt upgrade -y && apt autoremove -y
# Обновление Clamav неофициальных репозитариев.
#clamav-unofficial-sigs.sh --upgrade && clamav-unofficial-sigs.sh --force

if [ -f /var/run/reboot-required ]; then
    echo "A reboot is required." >&2
    echo "Please reboot." >&2
    exit 1
fi

#sudo nano /usr/local/bin/upgrade.sh 
#sudo chmod +x /usr/local/bin/upgrade.sh 
```
Сохраняем. И делаем выполняемым.
```
sudo chmod +x /usr/local/bin/upgrade.sh
```
