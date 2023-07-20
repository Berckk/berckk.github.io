---
layout: post
title: Создание и монтирование раздела диска из консоли.
permalink: Docker-apache2/
tags: ubuntu fstab uuid
---
Создание и форматирование разделов из консоли. Монтирование разделов по UUID.
---
### 1 Создание раздела.
 Посмотрим какие диски есть в наличии: 
```
sudo fdisk -l
```
Перейдем к редактированию диска: 
```
sudo fdisk /dev/sdb
```
Введем `m` чтобы получить список всех доступных команд.  
`g` чтобы создать новую пустую таблицу разделов GPT.  
`n` чтобы создать новый раздел.  
Программа спросит про номер раздела и попросит указать первый и последний сектор раздела, т.к. у нас будет единственный раздел на диске, то оставляем все поумолчанию.  
`w` чтобы сохранить изменения и выйти.  
Снова введем команду `sudo fdisk -l` чтобы убедиться, что все получилось.
Теперь у нас есть не отформатированный раздел `/dev/sdb1`.

### 2  Форматирование раздела.
 Следующая команда:
 ```
 sudo mkfs.ext4 /dev/sdb1
 ```
 отформатирует раздел в файловую систему ext4.
 ### 3  Монтирование раздела по UUID.

Посмотрим присвоенные UUID устройствам:
```
sudo blkid
```
Находим нужный UUID и копируем его.  
Открываем fstab для редактирования:
```
sudo nano /etc/fstab
```
Добавляем в конце файла строку вида:
```
UUID=babf3fe9-29f4-4385-b298-98636d31addf /mnt ext4 defaults 0 2
```
Где `UUID=babf3fe9-29f4-4385-b298-98636d31addf` идентификатор созданного раздела.  
`/mnt` точка монтирования раздела.  
`ext4` файловая система.  
`defaults` параметры монтирования раздела.  
`0` указывает нужно ли делать резервную копию раздела, может принимать значения только 0 и 1.  
`2` указывает в какой очереди нужно проверять устройство на ошибки, 1 - в первую очередь, 2 - вторую, 0 - не проверять.  
Сохраняем файл `CTRL+O` и выходим `CTRL+X`.  
Попробуем примонтировать раздел и проверим, что в `fstab` нет ошибок: 
`sudo mount -a`
