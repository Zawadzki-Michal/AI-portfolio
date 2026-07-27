---
title: "Rynek przekaźników i oszustwa tokenowe — co to ma wspólnego z moją codziennością?"
date: 2026-07-27
tags: [ai, automation, azure]
cta_text: "Zetknąłeś się z czymś podobnym? Chętnie posłucham o twoich doświadczeniach."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything"
---

Cześć, tu Michał. Wczoraj wieczorem, zamiast odpocząć po pracy, zacząłem przekopywać się przez artykuły, które odłożyłem na później. Jeden z nich kompletnie mnie wciągnął — chodzi o [tekst o rynku przekaźników i oszustwach tokenowych](https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything), który trafił na bloga Simona Willisona.

Na pierwszy rzut oka pomyślałem, że to temat totalnie obok mojej codziennej pracy z Azure i automatyzacją. Relay market? Token resellers? Fraud? Brzmi jak coś dla specjalistów od bezpieczeństwa albo ludzi śledzących darknet, nie dla kogoś kto głównie walczy z Terraformem i pipeline'ami.

Ale im dłużej czytałem, tym bardziej zaczynało mi to rezonować z rzeczami, które widzę na co dzień. Infrastruktura, którą konfiguruję, może nieświadomie stać się częścią większego łańcucha. Te tokeny, które rotujemy, te service principal'e, te managed identity — wszystko to ma swoją wartość na rynku, o którym nawet nie myślę.

Nie do końca rozumiem jeszcze wszystkie mechanizmy opisane w artykule. Szczerze mówiąc, połowa terminów była dla mnie nowa i musiałem googlować w trakcie czytania. Ale jedna rzecz uderzyła mnie najbardziej: skala automatyzacji po drugiej stronie. To nie są pojedyncze osoby próbujące czegoś ręcznie. To są zorganizowane systemy, pipeline'y (ironicznie), które działają non-stop.

Zacząłem się zastanawiać nad rzeczami, które do tej pory traktowałem jako formalność. Alerting na nietypowe logowania? Mam, ale czy naprawdę patrzę na te alerty? Rotacja sekretów? Teoretycznie automatyczna, ale ostatnio sprawdzałem kiedy faktycznie się wykonała? No właśnie.

Ten artykuł sprawił, że w poniedziałek zamierzam przejrzeć nasze polityki dostępu z trochę innej perspektywy. Dopiero zaczynam rozumieć jak wygląda krajobraz po drugiej stronie i chyba najwyższy czas, żebym zaczął patrzeć na te rzeczy poważniej.
