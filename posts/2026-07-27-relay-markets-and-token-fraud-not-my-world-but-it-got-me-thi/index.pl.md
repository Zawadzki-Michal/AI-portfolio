---
title: "Relay market i tokeny – co to ma wspólnego z moją codziennością?"
date: 2026-07-27
tags:
  - ai
  - azure
  - automation
cta_text: "Masz podobne przemyślenia albo widziałeś coś podobnego u siebie? Chętnie posłucham."
cta_link: "/collaborate"
source_url: "https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything"
---

Hej, tu Michał.

Wczoraj wieczorem trafiłem na [artykuł o relay market](https://simonwillison.net/2026/Jul/26/relay-market/#atom-everything) i przyznam, że przez chwilę zastanawiałem się, czy dobrze rozumiem o czym czytam. Relay market jako infrastruktura do odsprzedaży tokenów i oszustw? Brzmi jak coś z zupełnie innego świata niż moja codzienna praca z Azure.

Ale im dłużej o tym myślałem, tym bardziej zaczęło mi się to łączyć z rzeczami, które widzę na co dzień.

Pracuję z automatyzacją, z pipeline'ami, z różnymi integracjami które wymagają tokenów, kluczy API, tożsamości zarządzanych. I nagle zdaję sobie sprawę, że ten cały ekosystem "relay" opisany w artykule to w gruncie rzeczy infrastruktura pośrednicząca między źródłem a celem. Dokładnie tak jak działają niektóre rzeczy, które sam konfiguruję, tylko że po drugiej stronie moralności.

Co mnie uderzyło najbardziej? Że to nie są jacyś geniusze hakerzy siedzący w ciemnych piwnicach. To jest po prostu dobrze zorganizowany biznes z własnymi relay systemami, automatyzacją, skalowalnością. Gdybym nie wiedział o co chodzi, mógłbym pomyśleć że czytam o jakiejś startupowej architekturze mikroserwisów.

I teraz się zastanawiam nad swoimi własnymi konfiguracjami. Kiedy ostatnio sprawdzałem, czy tokeny które rotujemy faktycznie są rotowane wszędzie? Czy te wszystkie Service Principal w naszym tenancie mają sensowne uprawnienia, czy może któryś ma za dużo i nikt tego nie pilnuje? Szczerze? Nie jestem pewien.

To chyba jest ta rzecz która zostaje mi po przeczytaniu czegoś takiego. Nie strach jako taki, bardziej takie ciche "hm, a co u mnie?". Bo ja nie jestem żadnym celem samym w sobie, ale infrastruktura którą buduję mogłaby teoretycznie być wykorzystana jako taki relay gdyby ktoś dostał się do środka.

Nie mam tu żadnych mądrych wniosków. Raczej zostałem z listą rzeczy do sprawdzenia w poniedziałek i takim uczuciem, że świat security to naprawdę głęboka królicza nora, w którą dopiero zaczynam zaglądać.
