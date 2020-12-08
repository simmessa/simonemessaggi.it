---
date: 2016-02-06
title: "Per chi cerca di forzarvi il server SSH"
featuredImage: "./images/K-Line.jpg"
status: published
categories: 
    - Tech
tags:
    - SSH
    - Fail2ban
    - Security
---

Oggi una ricettina veloce per evitare gli accessi non autorizzati al vostro server SSH preferito.

*Articolo originariamente pubblicato il 6 febbraio 2016 su Simmessa.com*

Se avete server pubblici su internet, con la porta 22 aperta (e se leggete questo blog mi auguro che ne abbiate...), forse è il momento di dare un occhio ai log di autenticazione del vostro server:

`tail -f /var/log/auth.log`

Fatto? Beh, se siete fortunati noterete tanti \"simpatici\" tentativi di accesso non autorizzati, giusto?

Di default, il PAM del vostro server Linux non fa altro che stare li ad attendere tentativi di connessione, se avvengono pù di 3 errori di login chiude la prompt e attende un nuovo tentativo, ma è giusto, secondo voi, dare agli scripter tutti questi infiniti tentativi di brute force su SSH?

Secondo me no,  e allora tiriamo in ballo un alleato:

**Fail2ban**

*Questo il sito del tool [Fail2ban](http://www.fail2ban.org/)*

Il concetto dietro questo utile demone è semplice, se sbagli più di tot tentativi di login ti banno!

Il ban di solito è temporaneo, ma può servire a dissuadere gli scocciatori abbastanza da fargli distogliere l'attenzione dal nostro server e dedicarsi ad altro, magari di più produttivo.

##Come si installa Fail2ban? (su Debian)

Semplice, basta un apt-get:

`$ sudo apt-get install fail2ban`

A questo punto personalizziamo la configurazione del demone copiandoci il file .conf:

`sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local`

Bene, ora possiamo passare alla personalizzazione della config:

`sudo vi /etc/fail2ban/jail.conf`

Le linee più importanti da modificare determinano il comportamento di fail2ban, ad esempio vogliaom essere tranquilli di non tagliarci fuori da soli un giorno in cui verremo inevitabilmente colpiti da un attacco di babbeite!

```
# \"ignoreip\" can be an IP address, a CIDR mask or a DNS host

ignoreip = 127.0.0.1/8 192.168.1.0/24
bantime  = 600
maxretry = 6
```

Suggerisco anche di mantenere alto il numero di maxretry, 3 sono pochi certi giorni e possono darci una mano a non fare danni.

Il bantime è il tempo (in secondi) per cui vogliamo bannare i \"cattivoni\", 10 minuti potrebbero già far desistere gli scripter (se sono capaci di scriversi gli script, perlomeno).

Altro aspetto che merita menzione è l'invio automatico di email qualora venisse intercettato un tentativo di accesso non autorizzato:

```
# Destination email address used solely for the 
interpolations in jail.{conf,local} configuration files.
destemail = mail@nonesiste.caz
```

Ma occhio, il vostro server deve essere in grado di inviare mail perché funzioni, in alternativa potete fare delivery verso un account locale...fate voi!

L'ultima parte di **Fail2ban** è quella delle azioni, che determina cosa succede quando un client oltrepassa la soglia di Maxretry.

Prima di tutto, il ban, che avviene come configurazione temporanea di iptables:

`banaction = iptables-multiport`

e quindi, il tipo di trasporto usato per l'invio della mail:

`mta = sendmail`

Con questo è tutto, mi raccomando, se avete delle box ssh in giro, proteggetevi...!