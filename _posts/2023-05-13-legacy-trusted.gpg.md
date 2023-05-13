---
layout: post
title: Исправляем: ""Key is stored in legacy trusted.gpg keyring""
permalink: legacy-trusted-keyring/
tags: ubuntu trusted.gpg
---
Исправляем: "Key is stored in legacy trusted.gpg keyring"
---

## Переносим ключи в /etc/apt/keyrings
`sudo apt-key list`  
Берем последнии последнии 8 знаков из ключа, находящегося в `trusted.gpg` и по ним переносим ключ в отдельный файл в `/etc/apt/keyrings/`  
`sudo apt-key export ХХХХХХХХ | sudo gpg --dearmour -o /etc/apt/keyrings/Отдельный_репозитарий.gpg`  
Так надо сделать с каждым ключом из `trusted.gpg`.  
Затем для каждого репозитария добавляем путь до нового расположения ключа:  
`[signed-by=/etc/apt/keyrings/Отдельный_репозитарий.gpg]`  
Например:
```
deb [signed-by=/etc/apt/keyrings/mysql.gpg] http://repo.mysql.com/apt/ubuntu/ jammy mysql-tools
```
После этого удаляем ключи из `trusted.gpg`:  
`sudo apt-key del ХХХХХХХХ`  
И проверяем `sudo apt update`