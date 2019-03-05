# systemctl stop smbd nmbd winbind

Desative estes serviços para que eles não iniciem no boot

# systemctl disable smbd nmbd winbind

Remove o script samba-ad-dc existente

# systemctl unmask samba-ad-dc

Inicie o Samba como DC

# systemctl start samba-ad-dc

Habilite o serviço para subir no Boot

# systemctl enable samba-ad-dc