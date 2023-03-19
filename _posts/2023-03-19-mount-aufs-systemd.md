---
layout: post
title: Монтирование разделов systemd. aufs - монтирование несколько разделов как один.
permalink: mount-systemd-mount-aufs/
tags: ubuntu systemd aufs mount
---
Монтирование разделов в systemd. Очередность монтирования. aufs для объединения нескольких дисков.
---
### 1 Монтирование физических дисков.
Выполним   
`sudo blkid`  
чтобы узнать `UUID` разделов.
Определим наименование файла сервиса монтирования для точки монтирования раздела:  
`sudo systemd-escape -p --suffix=mount '/media/aufs/0'`  
где `/media/aufs/0` точка монтирования моего первого раздела.  
И файл будет `media-aufs-0.mount`.  
Создадим его:  
`sudo nano /etc/systemd/system/media-aufs-0.mount`  
Со следующим содержимым:
```
[Unit]
Description=Мой первый диск

[Mount]
What=/dev/disk/by-uuid/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
Where=/media/aufs/0
Type=ext4
Options=defaults,lazytime


[Install]
WantedBy=multi-user.target
```
Секция `[Mount]` с двумя обязательными параметрами, указывающими на устройство и точку монтирования. Секция `[Unit]` содержит строку с описанием сервиса, в нашем случае точки монтирования. Можете написать туда все что угодно, главное, чтобы вам потом было понятно, что в эту точку монтируется и зачем. Секция `[Install]` задает уровень запуска сервиса, в нашем случае это `multi-user.target` - многопользовательский режим без графики.

`Where=/media/aufs/0` точка монтирования, связанная с полученным наименованием.  
По аналогии создадим для других разделов.
### 2 Монтирование aufs - объединенного раздела.
Также определим наименование файла сервиса монтирования для точки монтирования:  
`sudo systemd-escape -p --suffix=mount '/media/data'`  
где `/media/data` точка монтирования моего первого раздела.  
И файл будет `media-data.mount`.  
Создадим его:  
`sudo nano /etc/systemd/system/media-data.mount`  
Со следующим содержимым:
```
[Unit]
Description = AUFS disk DATA
Requires = media-aufs-0.mount
Requires = media-aufs-1.mount
Requires = media-aufs-2.mount
After = media-aufs-0.mount
After = media-aufs-1.mount
After = media-aufs-2.mount

[Mount]
What = none
Where = /media/data
Type = aufs
Options = br:/media/aufs/0=rw:/media/aufs/1=rw:/media/aufs/2=rw,create=mfs,sum,lazytime

[Install]
WantedBy = multi-user.target
```
Общий раздел будет подключаться после монтирования трез разделов.
