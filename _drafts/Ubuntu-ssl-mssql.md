Посмотреть самоподписанные сертификаты на сервере
 openssl s_client -connect 212.193.27.92:1433 -showcerts 
скачать самоподписанный сертификат с сервера
openssl s_client -connect 212.193.27.92:1433 -showcerts </dev/null 2>/dev/null | openssl x509 -outform PEM > sql-server-cert.pem
скопировать самоподписанный сертификат 
sudo cp sql-server-cert.pem /usr/local/share/ca-certificates/sql-server-cert.crt
установить права
sudo chmod 644 /usr/local/share/ca-certificates/sql-server-cert.crt
обновить хранилище сертификатов
sudo update-ca-certificates 
