# Container security: migliorare la sicurezza con i distroless container

----

**Bio:**
La mia storia d'amore con i computer è iniziata ad 8 anni, grazie al Commodore64, poi ho fatto di questa passione la mia professione.

Ho lavorato su reti, sviluppo web (back & front), come sysadm Linux, technical project manager e ho creato e guidato team tecnologici nelle aziende di cui ho fatto parte.

Negli ultimi anni ho iniziato ad adottare la filosofia DevOps con grande soddisfazione.

Adoro Docker, Kubernetes ed Elasticsearch.

**Title:**
Devops e Operation Master presso Mia-Platform, 

---
**Titolo:**
Rafforzare la security con i distroless container

**Descrizione:**
Viviamo nell'era della container revolution e questo trend già diffuso esploderà ulteriormente nei prossimi anni.

I container continuano ad essere uno dei trend più caldi del momento, ma se con i container progettiamo, sviluppiamo e deployamo applicazioni, perché spesso non dedichiamo più di 5 minuti alla sicurezza dei container?

Parliamo di distroless container, una tecnica promettente ideata da Google con cui è possibile limitare al massimo la superficie di attacco delle nostre applicazioni containerizzate. Vedremo i principali metodi per realizzare distroless container e impareremo ad:

- Analizzare container con tool per individuarne le vulnerabilità di sicurezza
- Ottenere immagini snelle attraverso le build multi-stage 
- Fare il debugging di container distroless in modo efficace

----
Siamo nel 2019, e viviamo ormai nell'era della *Container revolution*, nel giro di pochi anni siamo passati dallo shared hosting alle VPS fino al cloud e ai container dei giorni nostri.

L'utilizzo dei container in produzione e' ormai un fenomeno "normale" e consolidato, secondo [Gartner](https://www.gartner.com/smarterwithgartner/6-best-practices-for-creating-a-container-platform-strategy/) entro il 2022 il 75% delle aziende utilizzera' in produzione applicazioni containerizzate (la percentuale nel 2019 e' di circa il 30% e in crescita).

Come sempre succede, quando emergono nuove tecnologie, la prima preoccupazione e' fare in modo che "funzionino" e alcuni aspetti vengono tralasciati, per questa ragione docker e i container si sono fatti una reputazione tutt'altro che buona per quanto riguarda gli aspetti di **cybersecurity.**

Molte realta', per la fretta di inseguire l'ultimo trend tecnologico/informatico (oggi sono i container, domani...chissa'!), hanno tralasciato in parte o del tutto la parte di sicurezza, e sottovalutato il fatto che, alcune caratteristiche di isolamento dei processi a cui ci avevano abituato le VM nei container nemmeno esistono!

Volendo vedere, il ridotto grado di isolamento offerto dai container non deriva da un disinteresse verso il tema security ma, piu' semplicemente, e' una feature della containerizzazione che serve a guadagnare in termini di flessibilita'.

## Distroless container

Proprio per approfondire il tema security, oggi vi voglio proporre una tecnica per la messa in sicurezza di container che utilizza l'approccio *distroless*.

Se con le VM il focus era su istanze di macchine virtuali isolate e ciascuna "dedicata" ad una certa applicazione, con i container arriviamo ad avere quasi un'identita' tra l'applicazione stessa e il container in cui gira. Arriviamo a dire che **il container, in fondo e' l'applicazione.**

Chiunque di voi si sia preso la briga di scrivere un *Dockerfile* o due sa pero' bene che non e' cosi' semplice. 

Perche' oltre all'applicazione nel container e' presente una base costituita dal sistema operativo sottostante, leggero quanto volete, ma comunque sempre presente.

Per i miei primi Dockerfile, ad esempio, mi sono sempre affidato ad una base **debian** (debian:stretch) perche' avevo bona confidenza con questo OS e sapevo quanti e quali pacchetti potevo installare, inoltre avevo a disposizione software testato e stabile, anche se a discapito del numero di versione. Immagini basate su debian pesavano facilmente centinaia di MB ma erano piu' facili da usare e da debuggare.

Poi nel tempo, sono passato alla **stretch-slim**, una distribuzione debian minimale che pero' garantiva l'80% degli strumenti di debian, in un formato piu' compatto ed efficiente.

Con gli anni, sono venuto a conoscenza di **Alpine**, una distro Linux estremamente minimale e dal peso irrisorio, perfetta per mantenere leggeri e performanti i container. Alpine e' davvero la versione di Linux piu' ristretta all'osso che mi sia capitata di vedere, si tratta in pratica di un **busybox** (usato nel mondo embedded) con l'aggiunta del package manager minimale apk. Le immagini basate su Alpine tendono a pesare anche meno di 100 MB il che comporta un bel guadagno in termini risparmio di banda e tempo.

I distroless, se volete, sono un ulteriore passo avanti verso container efficienti dove il sistema operativo scompare e sono presenti solo le librerie minime necessarie ad eseguire la nostra applicazione.

Questa tecnica non e' nuova, ma esiste da qualche anno ed e' stata introdotta da Google, che si trova da tempo nella situazione di avere molte applicazioni containerizzate deployate in produzione.

In poche parole, un container distroless fa a meno del sistema operativo e contiene solo il kernel linux e le librerie necessarie all'applicazione che vogliamo deployare.

