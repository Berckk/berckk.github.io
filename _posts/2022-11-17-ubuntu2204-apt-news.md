---
layout: post
title: В Ubuntu 22.04 при обновлении предлагает новости.
permalink: Journalctl/
tags: ubuntu 22.04 apt news
---
Ubuntu 22.04 APT News
---
Сегодня при обновлении домашней Ubuntu 22.04 появилось сообщение.

```
 News about significant security updates, features and services will    
 appear here to raise awareness and perhaps tease /r/Linux ;)
 Use 'pro config set apt_news=false' to hide this and future APT news.
```
Canonical добавила в консоль свою "рекламу".
Отключается командой:
```
pro config set apt_news=false
```
Проверяем:
```
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
```