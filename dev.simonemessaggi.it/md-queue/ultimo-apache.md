#Ricette per eliminare anche l'ultimo degli Apache
---
date: 2017-01-01
title: "Bold Mage"
cover: "https://unsplash.it/400/300/?random?BoldMage"
categories: 
    - Tech
    - React
tags:
    - programming
    - stuff
    - other
---

*Che dire, su questa penso di averci più o meno preso, la lettura è ancora valida, ma tenete a mente che questo articolo è originariamente apparso il 24 agosto 2014 su Simmessa.com*

![Anche l'ultimo Apache deve morire](/tech/content/images/2014/Aug/Apache-1024x768.jpg)

No, non sto per scrivere un post razziale, non sarebbe da me. L'Apache in questione in realtà è il demone del WWW.

Possibile che il grosso della rete internet stia ancora usando un **server HTTP** rilasciato nel 1995 ?

Non solo possibile, ma anche probabile...

Ecco la situazione dei server web installati nell'anno 2013 (Novembre 20134 - fonte: Netcraft):

![La situazione a Novembre 2013 secondo netcraft](/tech/content/images/2014/Aug/wpid-graph3.png)

Drammatica, vero?

Fino al 2006 Apache contava il 60% delle installazioni totali, epico.

Fortunatamente le cose stanno migliorando molto, e nuovi server si sono imposti, anche in ambienti di produzione.

Io? ho scelto NGINX, che è sinceramente un capolavoro di software, chiaro, facile da configurare e completo, con [nginx](http://www.nginx.org) si fa di tutto, e di più.

**La difficoltà** nell'usare nginx sta più che altro nella disponibilità di questo software nei vari ambienti, se sotto windows ci si può arrangiare con dei binari, le varie distro linux spesso includono versioni veramente obsolete di nginx, e solitamente chi ne fa le spese siamo noi.

##Soluzioni per installare Nginx su una vecchia Debian

Avete debian e la versione di nginx che è inclusa vi fa venire l'orticaria? **nessun problema...**

Conosco un paio di soluzioni per voi, vediamole:

1. **installare nginx da un repository alternativo**:
2. **compilare nginx a mano con la config debian**:

###Installare Nginx da Dotdeb

In generale, **buona fortuna!** Quando installate pacchetti da un repository esterno come [dotdeb](http://www.dotdeb.org/) state mischiando una distro mint come debian con qualcosa di esterno, per cui fate molta attenzione, personalmente più di una volta mi è capitato di fare un grosso casino con le dipendenze dei pacchetti, ed oggi è una strada che preferisco evitare, se possibile.

Ad ogni modo NON fate la ca**ata di usare il repo current di dotdeb o vi troverete con un debian misto e il delirio in apt-get.

Se per esempio avete Debian Squeeze dovete editare il vostro */etc/apt/sources.list* aggiungendo queste due righe:

`deb http://nginx.org/packages/debian/ squeeze nginx
deb-src http://nginx.org/packages/debian/ squeeze nginx`

et voilà, il gioco è fatto, maggiori info li trovate su http://www.dotdeb.org/instructions/

Comunque vada, ricordatevi sempre di aggiungere la chiave di dotdeb al vostro keyring pgp per la validazione dei pacchetti con:

`wget http://www.dotdeb.org/dotdeb.gpg
sudo apt-key add dotdeb.gpg`

###Compilare Nginx dai sources con la config Debian

Dopo un po' di tentativi ho scovato questo trucchetto che vi segnalo, per installare Nginx ed averne sempre una versione recente, a patto di mantenerselo a mano, è preferibile compilare dai sorgenti.

Il problema è che così rischiate di spaccare una o più delle numerosi convenzioni di Debian (tipo i virtual hosts su /var/www, per intenderci), per cui potrebbe rivelarsi un gran casino...

**Fortunatamente** esiste un modo per rendere Nginx debian compliant, e cioè utilizzare una stringa di config che sia compatibile con le convenzioni Debian.

Cercando e sperimentando ho trovato questa che funziona benissimo:

- Prima di tutto vi procurate l'ultima versione di Nginx su http://nginx.org/en/download.html

- poi estraete il tutto in una directory comoda, se avete nginx qui: /tmp/nginx-1.6.1.tar.gz
eseguite:
- `tar zxvf nginx-1.6.1.tar.gz`

- quindi lanciate un configure così fatto:

- `./configure --sbin-path=/usr/sbin --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --pid-path=/var/run/nginx.pid --lock-path=/var/lock/nginx.lock --http-log-path=/var/log/nginx/access.log --http-client-body-temp-path=/var/lib/nginx/body --http-proxy-temp-path=/var/lib/nginx/proxy --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --with-debug --with-http_stub_status_module --with-http_flv_module --with-http_ssl_module --with-http_dav_module --with-ipv6`

- infine installate con:

- `make && make install`

E avete finito.

###La configurazione di Nginx

La config di Nginx non si esaurisce qui, ma di questo parliamo la prossima volta, sappiate che le informazioni sono tutte diszponibili alla pagina http://nginx.org/en/docs/

A presto.