---
title: "Zbudowałem asystenta AI do zarządzania swoim życiem, a potem nauczyłem się nie wierzyć mu we wszystko"
date: 2026-07-26
tags: [ai, self-hosted, automation]
cta_text: "Budujesz coś podobnego? Chętnie posłucham, jak to ogarniasz"
cta_link: "/collaborate"
---

Od jakiegoś czasu buduję dla siebie asystenta AI — nie demo, tylko coś, z
czego faktycznie korzystam codziennie przez Telegrama, a od niedawna też
przez małą aplikację webową. Śledzi cele, zapisuje wydatki, sprawdza
kalendarz — wszystko przez rozmowę, nie formularze. Pod spodem to backend w
FastAPI, który przełącza się między lokalnym modelem Ollama a OpenRouter, w
zależności od tego, czego faktycznie wymaga dane zadanie.

Strona infrastrukturalna okazała się co najmniej połową projektu, może
więcej. Zaczęło się od klastra k3s działającego w WSL2 na moim własnym
komputerze, z Grafaną i Prometheusem śledzącymi opóźnienia modelu i wydatki
na API — a po kilku miesiącach przeniosłem produkcję na faktyczną maszynę
w Oracle Cloud, przygotowaną w Terraformie, z CI/CD wdrażającym przy każdym
pushu do main. Oryginalny setup na WSL2 wciąż działa, jako cold-standby,
którego nie miałem jeszcze odwagi wyłączyć. Kiedy zaczynałem, to wcale nie
było celem — chciałem tylko bota, który doda wydarzenie w kalendarzu bez
otwierania pięciu aplikacji — ale ciągnąłem za kolejne nitki (wejście
głosowe, potem wyjście, potem "a czemu nie wdrożyć tego właściwie", potem
"a czemu nie wdrożyć tego gdzieś, gdzie nie jest to mój komputer do
grania"), aż skończyłem z czymś bliższym prawdziwemu stackowi
produkcyjnemu, niż planowałem budować dla samego siebie.

Przeniesienie tego do chmury miało swój własny mały objazd: klaster wciąż
musi się dostać do modelu Ollama działającego z powrotem na moim domowym
komputerze, a Tailscale łączy te dwie maszyny bez problemu z normalnego
shella — ale pody na klastrze w ogóle nie mogły rozwiązać jego nazw
hostów, coś związanego z tym, że DNS klastra działa w innej sieciowej
przestrzeni nazw niż ta, w którą wpina się Tailscale. Nigdy do końca nie
doszedłem, dlaczego. Skończyłem na wpisaniu na sztywno adresu IP z
Tailscale zamiast nazwy hosta — działa, ale to nie jest odpowiedź, której
chciałem.

To, co faktycznie zmieniło sposób, w jaki z tego korzystam, nie było jednak
żadną funkcją. Było to zauważenie, że model przynajmniej raz powiedział mi,
że coś zapisał w bazie, choć tego nie zrobił. Nic katastroficznego się nie
wydarzyło, ale to wystarczyło, żebym przestał wierzyć odpowiedzi z czatu we
wszystkim, co faktycznie ma znaczenie — trzymam teraz z boku otwarty panel
admina bazy danych, żeby móc sprawdzić, co się naprawdę stało, zamiast
wierzyć asystentowi na słowo. Nie zakładałem, że będę tego potrzebował, i
wciąż nie jestem pewien, czy to problem modelu, czy problem "dać mu sposób
na sprawdzenie samego siebie", którego jeszcze nie zbudowałem.

Wejście/wyjście głosowe było najprzyjemniejszą częścią — nagrywanie
wiadomości, lokalna transkrypcja, słyszenie odpowiedzi na głos — ale to
też tam nauczyłem się najwięcej o tym, jak potrafią cię po cichu wysadzić
Docker bind-mounty. Przebudowywałem frontend, restartowałem kontener i nic
się nie zmieniało, bo bind mount używany do live-reloadu przykrywał
wszystko, co obraz właśnie zbudował. Zajęło mi dłużej, niż chciałbym się
przyznać, żeby zrozumieć, że rozwiązaniem jest budowanie prosto do
zamontowanego folderu, a nie ufanie obrazowi w ogóle.

Czy coś z tego jest konieczne dla asystenta, z którego korzysta jedna
osoba? Szczerze, nie. Ale to pierwszy projekt, w którym "nauka DevOpsu przez
robienie" i "chęć faktycznego korzystania z tego, co buduję" poszły w tę
samą stronę, a nie jedno było wymówką dla drugiego.
