---
layout: post
title: Исправляем "127.0.0.53 server can't find"
permalink: nslookup_resolv/
tags: ubuntu nslookup resolv
---
$ nslookup domen.local

Server:     127.0.0.53
Address:    127.0.0.53#53

** server can't find web1: SERVFAIL
---

Все из-за неправильной ссылки `ls -l /etc/resolv.conf`  
`lrwxrwxrwx 1 root root 39 Apr 26 12:07 /etc/resolv.conf -> ../run/systemd/resolve/stub-resolv.conf`  
Исправляем
```
sudo unlink /etc/resolv.conf
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf
ls -l /etc/resolv.conf

sudo reboot
```
И проверяем `nslookup domen.local`
