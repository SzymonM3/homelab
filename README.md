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
- Montowanie po UUID: `964b8ea4-7ca1-4175-a394-cdb34441df54`
- Opcja `nofail`: brak dysku NAS nie blokuje startu systemu

## Samba NAS

- Usługa: Samba (`smbd`)
- Udział: `Dom-Dane`
- Ścieżka: `/mnt/nas`
- Użytkownik Samba: `szymon`
- Dostęp gościa: wyłączony
- Udział `[homes]`: wyłączony
- Zapis: włączony
- `create mask`: `0660`
- `directory mask`: `0770`
- Dostęp z Windows: `\\192.168.0.110\Dom-Dane`
- Dostęp z iOS: SMB przez aplikację Pliki
- `lost+found`: ukryty przed klientami SMB za pomocą `veto files`

### Testy

- Windows → NAS: zapis plików działa
- NAS → Windows: odczyt plików działa
- Uprawnienia nowych plików: `0660`
- Uprawnienia nowych katalogów: `0770`

## Monitoring — Netdata

- Narzędzie: Netdata
- Wersja: 2.12.0
- Dashboard: `http://192.168.0.110:19999`
- Usługa systemd: `netdata.service`
- Autostart: włączony
- Kanał aktualizacji: stable
- Telemetria Netdata Cloud: wyłączona

### Monitorowane obszary

- CPU
- RAM
- przestrzeń `/mnt/nas`
- I/O dysków
- ruch sieciowy
- stan usług/systemu
