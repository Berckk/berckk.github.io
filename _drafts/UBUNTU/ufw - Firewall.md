http://www.ekzorchik.ru/2015/03/frondend-to-manage-iptables-rules/
Включить
`sudo ufw enable`
Выключить
`sudo ufw disable`
Чтобы посмотреть статус сетевой защиты:
`sudo ufw status`
Для более полного отображения информации введите:
`sudo ufw status verbose`

`sudo ufw allow 22`
`sudo ufw deny 22`

Для удаления правила используйте delete:
`sudo ufw delete deny 22`

`sudo ufw allow OpenSSH`



Наконец, выключите и повторно включите ufw для применения изменений:
`sudo ufw disable && sudo ufw enable`



Разрешаем все исходящее
`sudo ufw default allow outgoing`
Запрещаем все входящие
`sudo ufw default deny incoming`