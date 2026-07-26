---
title: "Prowadzenie przypomnień o wizytach dla małej firmy na karcie SIM ze starego telefonu"
date: 2026-07-26
tags: [ai, automation, devops]
cta_text: "Budujesz coś podobnego dla kogoś bliskiego? Chętnie porównam notatki"
cta_link: "/collaborate"
---

Ktoś bliski mi prowadzi małą, jednoosobową firmę usługową działającą na
wizyty — coś, co wcześniej działało w całości na papierowym kalendarzu i
numerze telefonu. Przez ostatnie miesiące budowałem oprogramowanie, które
za tym stoi: kartoteki klientów, kalendarz zsynchronizowany z Google
Calendar, śledzenie dochodów oraz asystenta AI na czacie, który dodaje
klienta albo umawia wizytę na podstawie jednego napisanego lub
powiedzianego zdania, zamiast wypełniania formularza.

Rzeczą, na którą nie planowałem poświęcić najwięcej czasu, były
przypomnienia o wizytach. Każde płatne API do SMS-ów, jakie sprawdzałem,
albo rozlicza za wiadomość w sposób, który szybko robi się kosztowny dla
jednoosobowej firmy, albo wymaga konfiguracji nieproporcjonalnej do "wyślij
SMS dzień przed wizytą". Skończyłem więc na samodzielnie hostowanej bramce
SMS działającej na starym telefonie Android z prawdziwą kartą SIM — telefon
po prostu wisi online, a aplikacja na nim przekazuje wiadomości. Brzmi jak
hack i pewnie nim jest, ale działa stabilnie, a do tego odpowiedzi też
wracają — ktoś może napisać "czy możemy to przełożyć" i ta odpowiedź
pojawia się prosto w profilu klientki/klienta, jak normalny wątek czatu,
zamiast zniknąć w telefonie, na który nikt nie patrzy.

Część AI działa na lokalnym modelu przez Ollamę, a nie na czymkolwiek w
chmurze, głównie dlatego, że imiona, numery telefonów i notatki klientów to
akurat ten typ danych, którego nie chciałem przepuszczać przez API strony
trzeciej tylko po to, żeby zaoszczędzić komuś kilka pól formularza. To
ograniczenie utrudniło konfigurację tool-callingu bardziej, niż
zakładałem — sprawienie, żeby lokalny model wiarygodnie wybierał właściwą
funkcję i wypełniał właściwe pola, a nie wymyślał nieistniejącego klienta,
zajęło więcej iteracji promptów, niż chciałbym się przyznać.

Nic z tego nie jest przełomową inżynierią. To backend w FastAPI, baza
Postgres, frontend w React instalowalny jak aplikacja na telefonie i sporo
drobnych decyzji integracyjnych, które miały znaczenie tylko dlatego, że
prawdziwa osoba korzysta z tego codziennie, żeby prowadzić swój dochód. Ta
ostatnia część zmieniła to, jak ostrożnie testuję rzeczy — bug w osobistym
projekcie jest irytujący, bug, który podwójnie zarezerwuje komuś popołudnie,
to prawdziwy problem w czyimś dniu.
