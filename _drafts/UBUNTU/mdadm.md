https://ixnfo.com/nastroyka-programmnogo-raid1-na-rabotayushhey-sisteme-ubuntu.html
http://ashep.org/2012/programmnyj-raid-v-linux-testirovanie-i-monitoring/


Настройка программного RAID1 на работающей системе Ubuntu

Приведу пример миграции работающей системы Ubuntu на программный RAID1.
В процессе необходимо будет выполнить две перезагрузки.

Первым делом переключимся на root пользователя если еще не под ним:
`sudo -i`

Посмотрим список дисков и разделов:
`fdisk -l
fdisk -l | grep '/dev/sd'
lsblk -o NAME,UUID`

Предположим что в системе используется один диск, например /dev/sda и имеет один основной раздел /dev/sda1.
Для теста установил чистый Ubuntu Server 18.04, диск так был размечен по умолчанию, swap был файлом на этом же разделе.

Чтобы создать рейд, подключим еще один диск такого же размера, он будет называться /dev/sdb.

Установим mdadm и необходимые утилиты (обычно они установлены по умолчанию):
	
`apt-get install initramfs-tools mdadm`

Для того чтобы удостовериться, что все необходимые модули и компоненты установлены, выполним следующую команду:
	
`cat /proc/mdstat`

Если необходимые модули не загружены, то загрузим их:
	
`modprobe linear
modprobe multipath
modprobe raid1`

Разобьем новый диск /dev/sdb аналогично установленному:
	
`sfdisk -d /dev/sda | sfdisk --force /dev/sdb`

Проверим:
	
`fdisk -l`

На следующем шаге изменим тип разделов нового жесткого диска /dev/sdb на «Linux raid autodetect» (так как раздел 1 то после «t» не будет задан вопрос указать номер раздела):
	
`fdisk /dev/sdb
t
fd
w`

Убедимся что тип разделов /dev/sdb — Linux raid autodetect:
	
`fdisk -l`

Создадим массив md0 используя опцию missing:
	
`mdadm --create /dev/md0 --level=1 --metadata=1.0 --raid-disks=2 missing /dev/sdb1`

Проверим:

`cat /proc/mdstat`

Если что-то не получилось, то можно удалить рейд и попробовать снова:
	
`mdadm --stop /dev/md0`

Укажем файловую систему массива:
	
`mkfs.ext4 /dev/md0`

Сделаем резервную копию файла конфигурации mdadm и добавим информацию о новом массиве:
	
`cp /etc/mdadm/mdadm.conf /etc/mdadm/mdadm_backup.conf`
`mdadm --examine --scan >> /etc/mdadm/mdadm.conf`

Смонтируем /dev/md0 в систему:
	
`mkdir /mnt/md0
mount /dev/md0 /mnt/md0
mount`

У меня отобразилось в конце списка:
	
`/dev/md0 on /mnt/md0 type ext4 (rw,relatime,data=ordered)`

В файле /etc/fstab комментируем строки о /dev/sda и добавим о массиве:
	
`nano /etc/fstab`
`/dev/md0 /               ext4    errors=remount-ro 0       1`

Посмотрим файл /etc/mtab есть ли там запись о рейде:

`cat /etc/mtab`

Посмотрим точные имена файлов /vmlinuz, /initrd.img:
	
`ls /`

Создадим файл с меню загрузки GRUB2 и откроем его в редакторе:
	
`cp /etc/grub.d/40_custom /etc/grub.d/09_raid1_test
nano /etc/grub.d/09_raid1_test`

Добавим содержимое (вместо /vmlinuz и /initrd.img укажем правильные имена если они другие):
	
`#!/bin/sh
 exec tail -n +3 $0`
`# This file provides an easy way to add custom menu entries.  Simply type the`
`# menu entries you want to add after this comment.  Be careful not to change`
`# the 'exec tail' line above.`
`menuentry 'Debian GNU/Linux, with Linux' --class debian --class gnu-linux --class gnu --class os {
        insmod mdraid1x
        insmod part_msdos
        insmod ext2
        set root='(md/0)'
        echo    'Loading Linux'
        linux   /vmlinuz root=/dev/md0 ro  quiet
        echo    'Loading initial ramdisk ...'
        initrd  /initrd.img
 }`

Откроем в текстовом редакторе файл /etc/default/grub:
	
`nano /etc/default/grub`

Раскомментируем пару строк:
	
`GRUB_TERMINAL=console
GRUB_DISABLE_LINUX_UUID=true`

Обновим загрузчик:

`update-grub`

Подготовим ramdisk:

`update-initramfs -u`

Установим загрузчик на оба диска:
	
`grub-install /dev/sda`
`grub-install /dev/sdb`

Скопируем все данные на примонтированный ранее массив md0:
	
`cp -dpRx / /mnt/md0`

Перезагрузим систему:

`reboot`

При запуске системы, в меню загрузки будет первым меню /etc/grub.d/09_raid1_test, если будут проблемы с загрузкой, то можно будет выбрать загрузку с /dev/sda.

Убедимся что система запущена с /dev/md0:

`df -h`

Снова переключимся на root пользователя если не под ним:

`sudo -i`

Изменим тип раздела старого жесткого диска:
	
`fdisk /dev/sda
 t
 fd
 w`

Проверим:

`fdisk -l`

Добавим к массиву старый диск:
	
`mdadm --add /dev/md0 /dev/sda1`

Подождем когда завершится синхронизации и убедимся что рейд в порядке — UU:
	
`cat /proc/mdstat`

Обновим информацию о массиве в файле конфигурации mdadm:

`cp /etc/mdadm/mdadm_backup.conf /etc/mdadm/mdadm.conf
mdadm --examine --scan >> /etc/mdadm/mdadm.conf`

Удалим наше временное меню GRUB, оно больше не нужно:

`rm -f /etc/grub.d/09_raid1_test`

Снова обновим и установим GRUB:
	
`update-grub
 update-initramfs -u
 grub-install /dev/sda
 grub-install /dev/sdb`
 
#Для дисков GPT

`grub-install /dev/sda1
 grub-install /dev/sdb1`

Перезагрузим систему чтобы убедится что она успешно запускается:
	
`reboot`

На этом миграция работающей системы Ubuntu на программный RAID1 завершена.
Если один из дисков, /dev/sda или /dev/sdb перестанет работать, то система будет работать и загружаться.
Для стабильности можно добавить в массив еще дисков аналогичного размера.

Восстановление:

Состояние:
`sudo mdadm --detail /dev/md0`


Если физически с диском всё порядке и ошибка была вызвана, например, некачественным кабелем, то после её устранения и подключения диска, необходимо вернуть его в массив:
`sudo mdadm --manage --re-add /dev/md0 /dev/sdc`


Если же устройство, которое вышло из строя, к жизни вернуть не представляется возможным, то после замены его новым, вместо опции --re-add следует использовать опцию --add:

`sudo mdadm --manage --add /dev/md0 /dev/sdc`