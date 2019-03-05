sudo apt-get install arpwatch

Например, если вы хотите отправлять сообщения о событиях arpwatch на eth0 в
arpwatch+eth0@example.com, файл конфигурации можно создать с помощью
выполнить следующую команду:


echo 'IFACE_ARGS="-m arpwatch+eth0@example.com"' > /etc/arpwatch/eth0.iface
