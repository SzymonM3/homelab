# Domowa sieć LAN

## Cel projektu

Celem projektu było zaprojektowanie, wykonanie i uruchomienie domowej infrastruktury sieciowej opartej na okablowaniu strukturalnym Ethernet, centralnym routerze, przełączniku oraz punktach dostępowych Wi-Fi.

Sieć została wykonana z myślą o stabilnej komunikacji pomiędzy urządzeniami, możliwości dalszej rozbudowy oraz zapewnieniu infrastruktury dla serwera Homelab i usług działających w sieci lokalnej.

## Topologia fizyczna

Centralnym punktem infrastruktury jest szafa rack 9U znajdująca się w garażu. W szafie znajdują się urządzenia sieciowe oraz Homelab.

Układ urządzeń w szafie, od góry:

1. Górna półka — ONT oraz router TP-Link ER605.
2. Patch panel 24-portowy — 12 portów wykorzystanych, 12 pozostawionych jako rezerwa.
3. Switch TP-Link SG1016D.
4. Dolna półka — Fujitsu Esprimo Q9000 pełniący funkcję serwera Homelab oraz zewnętrzny dysk HDD 3,5" w obudowie USB wykorzystywany jako NAS.

ONT jest podłączony do portu WAN routera ER605. Port LAN/WAN routera ER605 jest następnie połączony z przełącznikiem SG1016D i pełni funkcję uplinku do sieci LAN.

Do switcha podłączonych jest 12 przewodów prowadzących do patch panela. Przewody te stanowią zakończenie okablowania strukturalnego prowadzonego do poszczególnych pomieszczeń.

Homelab jest podłączony bezpośrednio do switcha, niezależnie od okablowania strukturalnego.

## Okablowanie strukturalne

Instalacja posiada 24-portowy patch panel. Obecnie wykorzystanych jest 12 portów, natomiast pozostałe 12 portów pozostawiono jako rezerwę na przyszłą rozbudowę sieci.

Wszystkie 12 wykorzystywanych przewodów z patch panela jest połączonych patchcordami z przełącznikiem SG1016D. Przewody prowadzą do gniazd RJ45 rozmieszczonych w poszczególnych pomieszczeniach.

Przewody prowadzone w ścianach zostały zakończone z wykorzystaniem modułów Keystone RJ45, zamontowanych w gniazdach sieciowych w poszczególnych pomieszczeniach. Pozwala to na zakończenie okablowania strukturalnego w standardowym punkcie przyłączeniowym i podłączanie urządzeń za pomocą wymiennych patchcordów.

### Rozmieszczenie punktów sieciowych

- **Salon:** 2 porty RJ45 — 1 wykorzystany przez Xiaomi AX1500 pracujący jako Access Point, 1 wolny.
- **Pokój 1:** 2 porty RJ45 — 1 wykorzystany przez drukarkę OKI C5250, 1 wolny.
- **Pokój 2:** 2 porty RJ45 — oba wolne.
- **Biuro:** 4 porty RJ45 — 2 wykorzystywane przez komputery PC, 2 wolne.
- **Sypialnia:** 2 porty RJ45 — 1 wykorzystany przez Huawei AX1 pracujący jako Access Point, 1 wolny.

Łącznie instalacja posiada 12 punktów RJ45: 5 jest obecnie wykorzystywanych, a 7 pozostaje dostępnych do przyszłego wykorzystania.

## Topologia logiczna

Router TP-Link ER605 pełni funkcję centralnego urządzenia sieciowego. Odpowiada za połączenie z Internetem przez PPPoE, routing, NAT oraz przydzielanie adresów IP przez DHCP.

Sieć lokalna działa w jednej podsieci `192.168.0.0/24`. Urządzenia końcowe otrzymują adresy z puli DHCP, a dla wybranych urządzeń skonfigurowano rezerwacje DHCP w celu zapewnienia stałych adresów IP.

Punkty dostępowe Xiaomi AX1500 oraz Huawei AX1 pracują w trybie Access Point. Nie wykonują routingu, NAT ani DHCP i nie tworzą dodatkowych podsieci. Urządzenia przewodowe i bezprzewodowe korzystają z tej samej sieci LAN zarządzanej przez ER605.

## Adresacja IP

Sieć lokalna wykorzystuje adresację `192.168.0.0/24`. Adres routera ER605 pełniącego funkcję bramy sieciowej to `192.168.0.1`.

Dla urządzeń wymagających przewidywalnego adresu skonfigurowano rezerwacje DHCP. Adresy zostały zachowane zgodnie z przydziałami z puli DHCP, a nie ustawione ręcznie jako statyczne adresy na poszczególnych urządzeniach.

| Urządzenie | Adres IP | Rola |
|---|---|---|
| TP-Link ER605 | `192.168.0.1` | Router, brama, DHCP, NAT |
| Huawei AX1 | `192.168.0.101` | Access Point |
| OKI C5250 | `192.168.0.103` | Drukarka sieciowa |
| Xiaomi AX1500 | `192.168.0.107` | Access Point |
| Fujitsu Esprimo Q9000 | `192.168.0.110` | Homelab / serwer |

Rezerwacje adresów IP są zarządzane centralnie przez router ER605.

Komputery w sieci nie posiadają rezerwacji DHCP i korzystają ze standardowego dynamicznego przydzielania adresów. W obecnej konfiguracji nie ma potrzeby nadawania im stałych adresów IP.

## Homelab i usługi sieciowe

Fujitsu Esprimo Q9000 pełni funkcję serwera Homelab i jest podłączony bezpośrednio do przełącznika SG1016D. Serwer korzysta z systemu Debian 13 i posiada zarezerwowany adres IP `192.168.0.110`.

Do serwera podłączony jest zewnętrzny dysk HDD 3,5" w obudowie USB, wykorzystywany jako magazyn danych NAS. Dysk jest sformatowany w systemie plików ext4 i zamontowany w systemie jako `/mnt/nas`.

Na serwerze uruchomione są usługi wykorzystywane do nauki administracji systemem Linux oraz obsługi infrastruktury domowej:

- **SSH** — zdalne zarządzanie serwerem.
- **Samba** — udostępnianie danych z NAS w sieci lokalnej.
- **Netdata** — monitoring zasobów i parametrów systemu.
- **Nginx** — serwer HTTP wykorzystywany obecnie do hostowania lokalnego dashboardu Homelab.

Konfiguracja infrastruktury i kolejne etapy rozwoju Homelaba są dokumentowane w repozytorium Git oraz publikowane na GitHubie.

## Diagram topologii

Poniższy diagram przedstawia fizyczną i logiczną topologię domowej sieci LAN, wraz z lokalizacją głównych urządzeń infrastruktury oraz serwera Homelab.

![Diagram topologii sieci](network-topology.png)
