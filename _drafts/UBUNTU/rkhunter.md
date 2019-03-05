http://linux-notes.org/poisk-rutkitov-v-debian-ubuntu-linux-mint-i-red-hat-centos-fedora/
http://debian-help.ru/articles/rkhunter-programma-dlya-poiska-rutkitov-v-debian/
http://fx-files.ru/archives/741


#Обновляем rkhunter 
cd ~ && \
wget http://sourceforge.net/projects/rkhunter/files/rkhunter/1.4.6/rkhunter-1.4.6.tar.gz && \
tar xzvf rkhunter-1.4.6.tar.gz && \
cd rkhunter-1.4.6/ && \
sudo ./installer.sh --layout /usr --install && \
sudo rkhunter --versioncheck

#sudo dpkg-reconfigure rkhunter
sudo rkhunter --update
#http://www.ekzorchik.ru/2014/11/check-your-system-for-unwanted-items/
#http://hpau.tss.local:10080/gitlab/nat/raw/master/rkhunter.conf
sudo rkhunter --propupd
sudo rkhunter -c --enable all --disable none
#sudo rkhunter -c --enable all --disable none --rwo
sudo cat /var/log/rkhunter.log | grep Warning
sudo nano /etc/rkhunter.conf
sudo rkhunter --propupd
#проверяем
sudo rkhunter -C






# Пример
MAIL-ON-WARNING=hpa@ts.ru

PKGMGR=DPKG

ALLOWHIDDENDIR=/etc/.git

ALLOWHIDDENFILE=/etc/.gitignore
ALLOWHIDDENFILE=/etc/.etckeeper

ALLOWPROCLISTEN=/usr/bin/ntopng

ALLOWPROMISCIF=lan0
ALLOWPROMISCIF=wan0

USE_LOCKING=1

INSTALLDIR=/usr
DBDIR=/var/lib/rkhunter/db
SCRIPTDIR=/usr/lib/rkhunter/scripts
TMPDIR=/var/lib/rkhunter/tmp
USER_FILEPROP_FILES_DIRS=/etc/rkhunter.conf


# Пример


sudo -e /etc/cron.daily/rkhunter.sh
#//////////////////////////////////////
#!/bin/sh
(
/usr/bin/rkhunter --versioncheck
/usr/bin/rkhunter --update
/usr/bin/rkhunter --cronjob --report-warnings-only
) | mail -v -s "rkhunter (NAT)" hpa@ts.ru
#//////////////////////////////////////
