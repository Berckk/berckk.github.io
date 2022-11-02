 # Перенос настроенной UBUNTU на другую систему.
 Задача: Перенести настроенную ubuntu со всеми базами данных и конфигами установленную на железо на виртуальную машину.
Acronis-ом не получилось. Clonezilla не сжимала образы.

Поэтому устанавливаем [fsarchiver](http://www.fsarchiver.org/quickstart/)
```
sudo apt update && sudo apt install fsarchiver
```
Останавливаем процессы баз данных и д.р. рабочие которые пишут на диск.

## Создание копии.
Монтируем внешний диск для сохранения копий. 
```
mount /dev/sde1 /data
```
Создание копии для одного раздела
```
sudo fsarchiver savefs /data/myarchive1.fsa /dev/sda1
```
или для нескольких.
```
fsarchiver savefs /data/myarchive2.fsa /dev/sda1 /dev/sdb1
```

## Разворачивание.
Структуру разделов создал установив ubuntu-server.
```
sudo fsarchiver restfs /data/myarchive2.fsa id=0,dest=/dev/sda1
```
или для нескольких
```
sudo fsarchiver restfs /data/arch2.fsa id=0,dest=/dev/sda1 id=1,dest=/dev/sdb1
```

## Правки 
После копирования загружаемся с liveCD (ubuntu) и правим конфиги непосредственно на новой машине.
Исправляем UUUID дисков:
```
/etc/fstab
```
Данные о программном рейд если есть:
```
/etc/mdadm/mdadm.conf
```
и файл `efi.cfg` на разделе `efi`.

Удаляем файл с MAC-адресами сетевых интерфейсов.
```
/etc/udev/rules.d/70-persistent-net.rules
```

Загружаемся на новом железе. Все должно работать.