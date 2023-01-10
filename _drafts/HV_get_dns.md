Check if there is any error message:

1
tail /var/log/syslog
If you get following errors:

1
2
sh: 1: /usr/libexec/hypervkvpd/hv_get_dns_info: not found
sh: 1: /usr/libexec/hypervkvpd/hv_get_dhcp_info: not found
Copy hyper-v daemon binaries to location mentioned in errors:

1
2
3
4
5
6
find /usr/|grep hv_set_ifconfig
/usr/src/linux-headers-4.15.0-55/tools/hv/hv_set_ifconfig.sh
/usr/sbin/hv_set_ifconfig
mkdir -p /usr/libexec/hypervkvpd/
cp /usr/sbin/hv_* /usr/libexec/hypervkvpd
systemctl restart hv-kvp-daemon 
