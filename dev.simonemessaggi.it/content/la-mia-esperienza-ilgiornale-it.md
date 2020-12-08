---
date: 2018-11-11
title: "La mia esperienza di lavoro a ilGiornale.it"
featuredImage: "./images/redazione.jpg"
status: published
canonical: https://medium.com/@simmessa/la-mia-esperienza-di-lavoro-a-ilgiornale-it-327bdf543fa3
categories: 
    - Humans
tags:
    - Startups
    - Teambuilding
---

In quest'ulimo periodo, mi è capitato di riflettere a vario titolo su quello che ho realizzato professionalmente negli ultimi 12 anni di attività e, più specificamente, da quando lavoro per [ilGiornale.it](http://www.ilgiornale.it); quello che segue, è un riassunto di questa riflessione, di quello che ho affrontato e di quanto mi sto trovando davanti in questo periodo, se vi ritrovate anche voi in quello che scrivo o se avete altre domande vi aspetto come sempre nei commenti, buona lettura.

*Repost di articolo apparso per la prima volta su [Medium](https://medium.com/@simmessa/la-mia-esperienza-di-lavoro-a-ilgiornale-it-327bdf543fa3)*

## Early years (2006-2012)

Quando ho iniziato a lavorarci (2006) il sito internet ilGiornale.it era poco più di uno script di importazione del quotidiano su un sistema proprietario in PHP e MySQL, i server erano macchine fisiche **Linux** in housing presso un hosting center.

Nel giro di pochi anni, (2008) dopo aver integrato varie piattaforme esterne con il sistema principale, ho realizzato che questo motore proprietario non era più in grado di reggere la crescita del nostro prodotto, così ho cominciato a creare un team interno di sviluppatori (2010) e nel 2012 abbiamo migrato ilGiornale.it su una nuova piattaforma, il **CMS** open source **Drupal**, che è stato la base per lo sviluppo interno di moduli custom necessari a realizzare ed estendere le funzionalità del prodotto editoriale.

## Welcome to the Cloud era (2013-2016)

Visto che l'aumento del traffico era continuo, ma difficile da prevedere, ho capito che il fatto di possedere un'infrastruttura di server "bare metal" era diventato un problema da gestire più che un valore, quindi ho iniziato a valutare l'ipotesi di migrare completamente li nostro ambiente su **Cloud.**

Il primo passo è stato quello di far passare tutto il traffico del sito tramite **CDN Akamai**, in questo modo abbiamo ridotto i tempi di latenza e diminuito il carico sulle macchine, evitando di dover acquisire nuovi server per gestire le situazioni di picco tipiche di eventi popolari o eccezionali che hanno un forte impatto sulla vita di un sito di news, come le emergenze nazionali, le elezioni politiche o i disastri naturali.

Poi è stato il momento di ripensare l'architettura in ambiente Cloud, su **AWS**, attivando una batteria di server **EC2** in ottica IAAS (Infrastructure As A Service) su cui andare a creare il nostro stack tecnologico (**Varnish, Nginx, PHP-FPM** ma anche **Glusterfs** ed **Elasticsearch**) mischiandolo ad altri servizi PAAS (Platform As A Service) come [**RDS (MySQL)**](/fare-un-dump-da-uno-snapshot-rds-con-python-e-terraform) ed **Elasticache (Memcache).**

Definita l'architettura e la strategia di migrazione, nel 2015 abbiamo fatto il grande passo, dismesso parecchi armadi rack in housing e puntato tutto sul Cloud.

## Present and future challenges (2017-2018)

A distanza di alcuni anni dalla migrazione in **Cloud AWS**, con un ritmo di crescita costante del traffico su tutto il network e la creazione di nuove properties editoriali per andare a ingaggiare segmenti di pubblico sempre nuovi sono emerse anche le principali problematiche legate alle prestazioni del CMS.

Lo sviluppo del prodotto su una piattaforma CMS monolitica come Drupal ci ha reso evidenti i problemi di scalabilità delle prestazioni all'aumento del traffico e ha richiesto una fase di analisi approfondita delle soluzioni software e tecnologie impiegate.

E' emersa la necessità di rinnovare ed innovare le basi della nostra piattaforma editoriale per rompere il monolita Drupal e trasformarlo in una serie di **piattaforme e servizi** fortemente integrati.

Per questa ragione ho deciso di investire, a livello personale e di team, tempo e risorse nell'apprendimento di nuove tecnologie, tra cui la più importante è forse costituita da **Docker** e dalle tecniche di **containerizzazione** di applicazioni e servizi.

Forti di questa nuova conoscenza abbiamo lanciato (2017) il primo servizio e la prima web app sviluppata in **NodeJS + React** e interamente basata su container, per gestire dati e risultati delle elezioni politiche e amministrative.

Oltre all'impiego di Docker, oggi stiamo radicalmente trasformando i metodi di sviluppo e rilascio del software per renderli aderenti all'ideologia **devops**, il nostro codice non segue più il ciclo di "release day", come si faceva prima e con tutte le difficoltà che questo metodo implicava, ma viene modificato e rilasciato costantemente.

Per questo i nostri prodotti evolvono costantemente grazie alle pipeline di **continuos deployment**, utilizzando i tool principali tra cui **Git, Jenkins e Docker**, grazie a cui viene rilasciato in produzione solo ciò che ha effettivamente superato i **test automatici.**

Allo stesso modo, ogni componente dello stack registra i suoi log con un modello centralizzato, grazie allo **stack ELK (Elasticsearch / Logstash / Kibana),** oggi siamo in grado di individuare i problemi in modo rapido e, soprattutto, automatico.

L'utilizzo dei container ha inoltre richiesto un vero rinnovamento degli ambienti di produzione, che si stanno trasformando a loro volta, non più server EC2 individuali da lanciare e AMI da mantenere, ma veri e propri cluster in tecnologia **Kubernetes** con un forte grado di automazione e capacità di scaling pressoché illimitate.

In questo modello ogni modifica infrastrutturale è descritta dal codice, e vive in un proprio repository Git, grazie a **Terraform e Kops**. Nel mondo Kubernetes in cui ci stiamo muovendo i container contenenti le applicazioni vengono orchestrati direttamente dal supervisor, e ogni deployment è descritto da uno script preciso, per cui è **attivabile, scalabile e replicabile** nel giro di pochi secondi.

Mi chiamo Simone Messaggi e se volete approfondire potete trovarmi su:
*http://linkedin.com/in/simmessa*