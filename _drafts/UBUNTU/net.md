http://blog.sedicomm.com/2018/05/25/kak-nastroit-staticheskij-ip-adres-v-ubuntu-18-04/


$ sudo netplan generate

все файлы в файле /etc/netplan/*.yaml будут прочитаны netplan


статический адрес

# This file describes the network interfaces available on your system
# For more information, see netplan(5).
network:
version: 2
renderer: networkd
ethernets:
enp0s3:
dhcp4: yes
enp0s8:
dhcp4: no
dhcp6: no
addresses: [192.168.56.110/24, ]
gateway4: 192.168.56.1
nameservers:
addresses: [8.8.8.8, 8.8.4.4]



    enp0s8 — имя сетевого интерфейса.
    dhcp4 и dhcp6 — dhcp свойства интерфейса для IPv4 и IPv6.
    addresses — последовательность статических адресов для интерфейса.
    gateway4 — адрес IPv4 для шлюза по умолчанию.
    nameserver — последовательность IP-адресов для сервера имен.



Сохраните файл и выйдите. Затем примените последние сетевые изменения, используя следующую команду netplan.

$ sudo netplan apply


динамический адрес

# This file describes the network interfaces available on your system
# For more information, see netplan(5).
network:
version: 2
renderer: networkd
ethernets:
enp0s8:
dhcp4: yes
dhcp6: yes




Prefix size         | Subnet mask   
/24                 | 255.255.255.0 
/25                 | 255.255.255.128
/26                 | 255.255.255.192
/27                 | 255.255.255.224
/28                 | 255.255.255.240
/29                 | 255.255.255.248
/30                 | 255.255.255.252




network:
  version: 2
  ethernets:
    eth0:
     dhcp4: no
     dhcp6: no
     addresses: [192.168.1.2/24, ]
     gateway4: 192.168.1.1
     nameservers:
      addresses: [192.168.1.1, 192.168.1.254]



network:
    version: 2
    ethernets:
      eno1:
       dhcp4: yes
       dhcp6: no
       nameservers:
         search: [local.local]
         addresses: [10.11.11.1]
      eno2:
       dhcp4: no
       dhcp6: no
       addresses: [192.168.0.202/24, ]
       gateway4: 192.168.0.1
       nameservers:
         search: [local1.local]
         addresses: [127.0.0.1]

