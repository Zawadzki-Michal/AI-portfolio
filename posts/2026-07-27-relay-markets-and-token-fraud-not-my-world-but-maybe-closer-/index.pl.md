---
title: "Rynek relay i oszustwa tokenowe — co to w ogóle jest?"
date: 2026-07-27
tags:
  - ai
  - automation
cta_text: "Spotkałeś się z czymś podobnym? Daj znać, chętnie pogadam."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything"
---

Cześć, tu Michał. Siedzę sobie po pracy, przeglądam co tam nowego w świecie i natrafiłem na coś, co mnie zatrzymało na dłużej.

Simon Willison opisał [rynek relay](https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything) — infrastrukturę, która napędza resellerów tokenów i całą maszynkę do oszustw. Szczerze? Pierwszy raz o tym słyszę w takim ujęciu. Wiedziałem, że tokeny API są cennym towarem, że ludzie je wykradają i odsprzedają. Ale że istnieje cały rynek pośredników, którzy to profesjonalizują na poziomie przypominającym normalny biznes?

Zacząłem się zastanawiać, jak to w ogóle wygląda od strony technicznej. Relay to w sumie proxy, które przekierowuje zapytania przez skradzione lub nielegalnie pozyskane tokeny, tak żeby końcowy użytkownik nie musiał się martwić skąd one pochodzą. Eleganckie w swojej paskudności, jeśli można tak powiedzieć.

I teraz myślę o tym przez pryzmat tego, co robię na co dzień. Pracuję z Azure, pilnuję konfiguracji, staram się, żeby rzeczy były bezpieczne. A tu nagle widzę, że po drugiej stronie jest zorganizowana ekonomia. Ludzie, którzy traktują kradzież tokenów jak normalną działalność operacyjną. Mają swoich dostawców, swoich klientów, pewnie jakieś SLA.

Nie wiem, czy to ma bezpośrednie przełożenie na moje codzienne zadania w Terraform czy przy konfiguracjach sieciowych. Pewnie nie wprost. Ale zmienia mi to trochę perspektywę. Do tej pory myślałem o bezpieczeństwie jako o checkliście — czy klucze są w Key Vault, czy rotacja jest ustawiona, czy dostępy są minimalne. Teraz zaczynam rozumieć, że po drugiej stronie są ludzie, którzy aktywnie szukają luk. To nie jest kwestia czy ktoś spróbuje, tylko kiedy.

Przyznam, że jeszcze nie do końca ogarniam, jak taki rynek relay dokładnie funkcjonuje technicznie. Jak wygląda flow zapytania? Jak ukrywają źródło tokenów? To są pytania, na które chciałbym znaleźć odpowiedzi, ale na razie jestem na etapie "o, to istnieje".

Ciekawe, czy ktoś z was miał do czynienia z wykrywaniem tego typu nadużyć w praktyce.
