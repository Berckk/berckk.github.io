http://www.creative-impulse.ru/2018/06/how-to-remove-cloud-init-from-ubuntu-18-04-server/


#После установки Ubuntu 18.04 Server на виртуальную систему под Virtualbox сразу же заприметил, что в системе предустановлено что-то что пытается связаться с облачными сервисами, а мне это не нужно. Я самолично все хочу контролировать и настраивать. А ввиду сего факта я покажу, как я удалить Cloud Init из Ubuntu 18.04 редакции Server:

`sudo apt-cache search cloud-init`

#cloud-init - Init scripts for cloud instances

`sudo bash -c "echo 'datasource_list: [ None ]' sudo -s tee /etc/cloud/cloud.cfg.d/90_dpkg.cfg"`

#datasource_list: [ None ] sudo -s tee /etc/cloud/cloud.cfg.d/90_dpkg.cfg

`sudo apt purge -y cloud-init`

`sudo rm -Rf /etc/cloud /var/lib/cloud`

`sudo reboot`

#Итого заметка завершена, я добился поставленной задачи, как впрочем я и делаю всегда, разбиваю задачу или задумку на маленькие составляющие и прорабатываю каждую из них и на выходе получать завершенную. Я не прощаюсь, а говорю увидемся на моих блогах где я подписываюсь, с уважением Олло Александр aka ekzorchik.
