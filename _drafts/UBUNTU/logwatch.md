http://www.itword.net/page/logwatch-linux


# Папка с логами по умолчанию
LogDir = /var/log/
# Папка для временных файлов, или указываем свою или создаем эту, так как она ни создается
TmpDir = /var/cache/logwatch

Скрыть
#Output/Format Options
#By default Logwatch will print to stdout in text with no encoding.
#To make email Default set Output = mail to save to file set Output = file
Output = stdout
#To make Html the default formatting Format = html
# В каком формате выводить данные, можно text или html
Format = html
#To make Base64 [aka uuencode] Encode = base64
Encode = none
# Кому будем отсылать уведомление. Можно указать локального
# пользователя, можно просто e-mail адрес.
# Если у вас не настроена почта для root имеет смысл указать необходимый адрес полностью
MailTo = root
# Здесь можно указать дополнительные адреса, на которые будут
# отсылаться уведомления
# Mailto_host1 = xxxxxx@localhost
# Имя отправителя письма
MailFrom = logwatch
# Указывает либо печатать вывод в консоль (YES) либо отправлять отчёт на почту (NO)
Print = No
# Можно сохранить файл отчета, указываешь путь на сервере при необходимости
# Save = /tmp/logwatch-mail
# Использовать ли архивы
# (к примеру /var/log/messages.1 или /var/log/messages.1.gz)
# Если отчёт генериться за одни день нет смысла включать эту опцию.
# Также эта опция зависит от режима ротации логов в системе
# Archives = No
# Указывает период за который составляется отчёт (All, Today, Yesterday)
Range = yesterday
# Уровень детализации отчёта
# Low = 0
# Med = 5
# High = 10
Detail = High
# Собирать ли информацию в всех сервисах, данные о которых лежат в папке
# /usr/share/logwatch/scripts/services/ или только по определенному (например ftpd)
Service = All

# Дополнительно можно исключить определенные сервисы из набора для анализа
Service = "-zz-network" # Prevents execution of zz-network service, which
# prints useful network configuration info.
Service = "-zz-sys" # Prevents execution of zz-sys service, which
# prints useful system configuration info.
Service = "-eximstats" # Prevents execution of eximstats service, which
# is a wrapper for the eximstats program.
# If you only cared about FTP messages, you could use these 2 lines
# instead of the above:
# Service = ftpd-messages # Processes ftpd messages in /var/log/messages
# Service = ftpd-xferlog # Processes ftpd messages in /var/log/xferlog
# Maybe you only wanted reports on PAM messages, then you would use:
# Service = pam_pwdb # PAM_pwdb messages - usually quite a bit
# Service = pam # General PAM messages... usually not many
# Аналогично, можно читать только определенные лог-файлы
# LogFile = messages
# например только /var/log/messages.
# Почтовая программа по умолчанию. Обычно используется
# sendmail или просто mail
mailer = "/usr/bin/mail"
#
# Собирать логи только с этого хоста. Имеет смысл, если на машине
# хранятся не только ее собственные логи
# HostLimit = Yes 
