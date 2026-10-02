# Homelab

## Cel projektu

Nauka administracji Linux, Git i budowa serwera NAS na Debianie 13.

## Storage

- System: Debian 13
- Dysk NAS: 1 TB HDD
- Urządzenie: `/dev/sdb`
- Partycja: `/dev/sdb1`
- Tablica partycji: GPT
- System plików: ext4
- Punkt montowania: `/mnt/nas`
- Automatyczne montowanie: `/etc/fstab`

## Samba NAS

- Usługa: Samba (`smbd`)
- Udział: `NAS`
- Ścieżka: `/mnt/nas`
- Użytkownik Samba: `szymon`
- Dostęp gościa: wyłączony
- Zapis: włączony
- `create mask`: `0660`
- `directory mask`: `0770`
- Dostęp z Windows: `\\192.168.0.110\NAS`

### Testy

- Windows → NAS: zapis plików działa
- NAS → Windows: odczyt plików działa
- Uprawnienia nowych plików: `0660`
- Uprawnienia nowych katalogów: `0770`
