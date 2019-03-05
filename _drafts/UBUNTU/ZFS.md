ZFS

[ФАК](http://www.bog.pp.ru/work/zfs.html)

[Gentoo_на_ZFS](https://www.linux.org.ru/gallery/screenshots/8556285)

[ZFS_on_linux](https://habr.com/post/314506/)

[nas-faq](http://nas-faq.github.io/zfs/)

[oracle](https://docs.oracle.com/cd/E19253-01/820-0836/index.html)

[Шпаргалка](http://dreamcatcher.ru/2010/01/10/%D0%A8%D0%BF%D0%B0%D1%80%D0%B3%D0%B0%D0%BB%D0%BA%D0%B0-%D0%BF%D0%BE-zfs/)

[Небольшое_руководство](https://habr.com/sandbox/32385/)

[Debian](http://www.alv.me/ustanovka-i-konfigurirovanie-zfs-on-linux-v-debian-jessie-8-1/)

[habr](https://habr.com/post/314506/)


The old isw_raid_member signature will be removed by a write command.
решение:
`sudo mdadm --misc --zero-superblock /dev/sdX`
```
sudo zpool create -o ashift=12 -O atime=off -O compression=lz4 -O mountpoint=legacy -O xattr=on pool mirror /dev/disk/by-id/ata-WDC_WD40EFRX-68N32N0_WD-WCC7K2JSP9KE /dev/disk/by-id/ata-WDC_WD40EFRX-68N32N0_WD-WCC7K7JN23R2
```
```
zpool create -f -o ashift=12 \
  -O atime=off -O compression=lz4 -O normalization=formD \
  -O mountpoint=none \
  boot_pool mirror /dev/disk/by-id/ata-Micron_1100-part2 /dev/disk/by-id/ata-Samsung_SSD_850_PRO-part2
zfs create -o mountpoint=/boot boot_pool/boot
zpool set bootfs=boot_pool/boot boot_pool
zfs mount|grep /boot
```

ashift — степень, в которую надо возвести двойку, чтобы получить указанный размер блока.
12 — это блок 4K.
Получить размер блока возможно командой blockdev --getbsz /dev/<disk>, либо из технической спецификации на устройство.

`zfs create -o utf8only=on -o compression=lz4 -o atime=off -o relatime=on -o acltype=posixacl -o mountpoint=legacy -o xattr=on pool/data`

Эта ФС тоже не имеет точки монтирования, а также содержит ряд полезных опций, которые будут унаследованы всеми созданными в последствии ФС (если вы не укажете других опций).

Используемые опции
Опции atime=off и relatime=on значительно повысят производительность ФС, соответственно пожертвовав метками времени доступа к файлам.

Опция compression=lz4 включит на ФС «очень производительную» версию алгоритма сжатия lzjb. Где-то даже есть тесты, и, помнится, меня они впечатлили. Включать компрессию или нет — дело не только вкуса, но и комфорта в работе, а также очень сильно зависит от назначения ФС. Об этом, возможно, напишу в последующей статье.

Хотите поддержки utf8 в именах файлов и отсутствие неприятностей с мултиязычHblми наименованиями? Лучший выбор — опция utf8only=on.

Ну и поддержка xattr нужна однозначно (xattr=on).
Появление поддержки POSIX ACL (опция acltype=posixacl) в ZFSonLinux я лично встретил как праздник (убейте, но не помню в какой версии добавили эту фичу).
```
echo "options zfs zfs_arc_max=16847271936" >> /etc/modprobe.d/zfs.conf
echo 16847271936 >> /sys/module/zfs/parameters/zfs_arc_max

free -b
16847271936
```

`sudo zfs set mountpoint=/media/data pool/data`

`sudo zfs status`

`sudo zfs list`

`sudo zfs create -o utf8only=on -o compression=lz4 -o atime=off -o relatime=on -o acltype=posixacl -o mountpoint=/media/docker -o xattr=on pool/docker`
