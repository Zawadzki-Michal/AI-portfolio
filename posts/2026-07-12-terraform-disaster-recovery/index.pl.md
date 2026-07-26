---
title: "Czego nauczyły mnie ćwiczenia disaster recovery, a nie nauczyła dokumentacja"
date: 2026-07-12
tags: [azure, terraform, disaster-recovery]
cta_text: "Przechodziłeś/aś przez coś podobnego? Chętnie posłucham"
cta_link: "/collaborate"
---

Brałem ostatnio udział w kilku ćwiczeniach disaster recovery dla naszych
obciążeń w Azure i to sprawiło, że przemyślałem coś, co wcześniej
zakładałem: że jeśli infrastruktura jest w Terraformie, recovery jest w
zasadzie rozwiązane. Nie jest, a do tego, żeby to do mnie dotarło,
potrzebowałem faktycznie usiąść na takim ćwiczeniu.

Terraform doprowadza cię do znanego stanu. Nie mówi ci, co robić o 3 w
nocy, gdy region padł, a ktoś pyta o ETA. To dwa różne problemy i
wcześniej naprawdę nie rozdzielałem ich w głowie.

Kilka rzeczy, które mi zostały w pamięci:

Twój `.tfstate` opisuje, co powinno istnieć, a nie co robić, gdy nie
istnieje. Wiedziałem to w teorii. Oglądanie ćwiczenia sprawiło, że stało
się to konkretne.

Regiony failover potrzebują tych samych reguł whitelistingu IP co
produkcja, przygotowanych z wyprzedzeniem — a nie wymyślanych w trakcie
incydentu. Tego akurat wcześniej nie przemyślałem, dopóki nie zwrócił mi
na to uwagi ktoś bardziej doświadczony ode mnie.

Runbook, którego nikt nigdy nie przeszedł, jest bliżej hipotezy niż
procedury. Wciąż zastanawiam się, ile z DR to kod, a ile to po prostu
ludzie wiedzący, co robić, i ufający sobie nawzajem pod presją. Podejrzewam,
że więcej tego drugiego, niż zakładałem jeszcze kilka miesięcy temu.
