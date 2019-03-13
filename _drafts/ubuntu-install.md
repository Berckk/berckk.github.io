---
layout: post
title: Первоначальная настройка UBUNTU 18.04 server
permalink: setup-ubuntu-server/
tags: ubuntu 18.04
---
Пошаговая инструкция.
---

Удаляем слежку
`sudo apt purge popularity-contest -y`

Правим параметры ядра.
`sudo -e /etc/default/grub`

Для отключения патчей и для ускорения работы

`GRUB_CMDLINE_LINUX="nopti nospectre_v1 nospectre_v2 nospec_store_bypass_disable noibrs noibpb l1tf=off no_stf_barrier"`

Удаляем snap. Считаю, что на сервере это лишнее.
`sudo apt purge snapd -y `

Обновляемся 
`sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y`

# Добавляем модули в загрузку для работы в виртуальной среде Hyper-v.
Для чего, в конец фала "modules" 
`sudo -e /etc/initramfs-tools/modules`
добавляем следующие строки:
```
 hv_vmbus
 hv_storvsc
 hv_blkvsc
 hv_netvsc
```
Устанавливаем ядро с поддержкой виртуального оборудования и полезные программы:
`sudo apt install linux-tools-virtual linux-cloud-tools-virtual linux-virtual linux-azure etckeeper git-core logwatch ssmtp molly-guard unattended-upgrades ntp mc zram-config mailutils`

 - `linux-tools-virtual linux-cloud-tools-virtual linux-virtual linux-azure` - Ядро и интеграционные службы.
[Supported Ubuntu virtual machines on Hyper-V](https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/supported-ubuntu-virtual-machines-on-hyper-v)


 - etckeeper - позволяет легко сохранять содержимое каталога /etc в хранилище системы контроля версий (VCS). Он отслеживает когда apt автоматически сохраняет изменения в /etc при установке или обновлении пакетов. Помещение /etc под контроль версий сейчас рассматривается как лучшая практика в индустрии, и преимуществом etckeeper является то, что он делает этот процесс безболезненным насколько это возможно. [ссылка](https://help.ubuntu.ru/wiki/руководство_по_ubuntu_server/другие_полезные_приложения/etckeeper)




#Включим автообновление безопасности. 
`sudo dpkg-reconfigure unattended-upgrades`
#Обновим время
`sudo dpkg-reconfigure tzdata`
`sudo ntpq -pn`
#или для 18.04
`timedatectl`

`sudo -e /etc/network/interfaces`

`sudo nano /etc/cloud/cloud.cfg`
# Установим 
`preserve_hostname: true`

`sudo hostnamectl set-hostname ИмяКомпьютера`
`sudo -e /etc/hostname`
#http://10.11.11.12:10080/gitlab/nat/raw/master/hosts
`sudo -e /etc/hosts`


#Правим конфиги
#В файле /etc/default/rcS прописываем «FSCKFIX=yes», чтобы в случае аварийной перезагрузки 
#ошибки были по-возможности исправлены автоматически.
`sudo -e /etc/default/rcS`
#Поменяем настройки по-умолчанию, чтобы у вновь созданных пользователей домашние директории были доступны для чтения только самим этим пользователям, 
#заменяем «DIR_MODE=0755» на «DIR_MODE=0750».:
`sudo -e /etc/adduser.conf`
`sudo chmod -R 750 ~/`
#SSHD Следующий код не работает. качаем вручную.
#wget http://10.11.11.12:10080/gitlab/nat/raw/master/ssh/sshd_config && sudo mv -f sshd_config /etc/ssh/sshd_config 
`sudo -e /etc/ssh/sshd_config `

#etckeeper
`sudo git config --global user.name "service"`
`sudo git config --global user.email "service@local.local"`
`sudo nano /etc/etckeeper/etckeeper.conf`
# Далее настройка удаленного репозитария и первый commit.
`sudo ssh-keygen -t rsa -C "service@local.local" -b 4096`
#Копируем результат в ключи GitLab
`sudo cat /root/.ssh/id_rsa.pub`

#Zabbix agent
#///////////////

`cd /etc`
`sudo git init`
`sudo git remote add origin ssh://git@us1.local.local:10022/gitlab/NEW.git`
`sudo git add .`
`sudo git commit`
`sudo git push -u origin master`


# 18.04 Настройки ротации логов можно также прописать в конфигурационном файле.
`sudo nano /еtc/systemd/journald.conf`
#который включает в числе прочих следующие параметры:
`SystemMaxUse=1G`
 #максимальный объём, который логи могут занимать на диске;

#http://itautsors.ru/ssmtp-nastroyka-otpravki-pochty-s-ubuntudebianlinux
#http://10.11.11.12:10080/gitlab/nat/raw/master/ssmtp/revaliases
`sudo -e /etc/ssmtp/revaliases `
#http://10.11.11.12:10080/gitlab/nat/raw/master/ssmtp/ssmtp.conf
#Исправляем hostname=
`sudo -e /etc/ssmtp/ssmtp.conf`
#
#



#Обновляем rkhunter 
#////////////////////////



