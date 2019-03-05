#Удаляем слежку
`sudo apt purge popularity-contest -y`
# Правим параметры ядра
`sudo -e /etc/default/grub`
# Для 18.04
# pti=off spectre_v2=off    
# GRUB_CMDLINE_LINUX="nospectre_v2 nopti nospec_store_bypass_disable noibrs noibpb" 

#Обновляемся 
# sudo fuser -vki /var/lib/dpkg/lock
`sudo apt update && sudo apt purge snapd -y && sudo apt upgrade -y && sudo apt autoremove -y`
#Ubuntu 18.04 kvm
`sudo apt-get install linux-tools-virtual linux-cloud-tools-virtual`
# UBUNTU 18.04 Hyper-v
`sudo apt-get install linux-azure`
#Дрова на виртуальное оборудование и полезные программы
`sudo apt-get install -y --install-recommends linux-virtual-lts-xenial linux-tools-virtual-lts-xenial linux-cloud-tools-virtual-lts-xenial etckeeper git-core logwatch ssmtp molly-guard unattended-upgrades ntp mc zram-config mailutils`

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
`sudo git config --global user.name "GitLab"`
`sudo git config --global user.email "gitlab@ts.ru"`
`sudo nano /etc/etckeeper/etckeeper.conf`
# Далее настройка удаленного репозитария и первый commit.
`sudo ssh-keygen -t rsa -C "gitlab@ts.ru" -b 4096`
#Копируем результат в ключи GitLab
`sudo cat /root/.ssh/id_rsa.pub`

#Zabbix agent
#///////////////

`cd /etc`
`sudo git init`
`sudo git remote add origin ssh://git@us1.ts.local:10022/gitlab/NEW.git`
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



