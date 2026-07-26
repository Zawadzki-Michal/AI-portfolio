---
title: "Podpiąłem tego bloga, żeby sam publikował się na LinkedIn, głównie żeby sprawdzić, czy się da"
date: 2026-07-26
tags: [devops, ai, automation]
cta_text: "Chcesz wdrożyć coś podobnego u siebie? Napisz do mnie"
cta_link: "/collaborate"
---

Większość porad o "budowaniu marki osobistej" traktuje publikowanie jako
ręczny obowiązek: napisz coś, otwórz LinkedIna, wklej, sformatuj, opublikuj,
powtórz. Nie mam zbyt dużo cierpliwości do powtarzalnych, ręcznych kroków —
pewnie dlatego, że sporo czasu spędzam wśród infrastruktury, która domyślnie
jest zautomatyzowana, więc wszystko ręczne mnie irytuje.
Spróbowałem więc sprawić, żeby ten blog działał bardziej jak infrastruktura,
której uczę się w pracy: coś, co zmieniasz przez PR, a nie formularz
wypełniany ręcznie.

Mniej więcej tak to teraz działa:

1. Otwieram PR z nowym folderem pod `posts/YYYY-MM-DD-slug/`.
2. Gdy trafi do `main`, strona się wdraża.
3. GitHub Action czeka, aż nowa strona faktycznie będzie live, wrzuca
   ewentualne zdjęcia na LinkedIn i publikuje post z linkiem zwrotnym.

Nie będę udawał, że zrobiłem to dobrze za pierwszym razem — wręcz
przeciwnie, wysłałem wersję, która mogła zawiesić job CI na zawsze, jeśli
request nigdy nie wracał, i dowiedziałem się o tym dopiero, gdy jeden z
runów wisiał "in progress" przez osiem minut, nic nie robiąc. Drobiazg, ale
to ten typ błędu, który nauczył mnie więcej o tym, jak Node faktycznie
obsługuje otwarte połączenia, niż jakikolwiek tutorial.

To, co podoba mi się w efekcie, to że post jest teraz po prostu plikiem w
repo, recenzowanym tak samo jak wszystko inne. Czy to faktycznie lepszy
system niż zwykłe ręczne publikowanie — szczerze, jeszcze nie wiem — ale
fajnie się to budowało i debugowało.
