#Un paio di ricette per nginx (nginx tutorial)

![Se nginx e Apache facessero a botte, vince nginx, sia chiaro](/tech/content/images/2015/06/nginx_vs_apache.png)

*Articolo originariamente pubblicato su Simmessa.com in data 12 giugno 2015, un po' datato ma sempre buono!*

Bah, un po' che non scrivo su questo Ghost, ma l'ho appena aggiornato alla latest, e sarebbe a dire la 0.6.4, visto che ero alla 0.5 lo definireri un discreto passo avanti.

Detto ciò, il tema id oggi è altro, ed esattamente: continuo a scoprire cose assolutamente fighe di **nginx** che lo rendono la piattaforma *definitiva* per qualsiasi sito web che si rispetti.

Io ve le indico, poi vedete voi, se state usando Apache beh, siete fermi agli anni 70.
Poi, tira di più un pelo di food che un carro di tech, quindi questa cosa delle ricette potrebbe addirittura eventualmente avere un senso per il SEO.

## Ricetta 1: Sautè di virtual host parametrici in salsa di nginx

Non so se avete presente una config di nginx, tipo questa:

        server {
          listen 80;
          root /var/www/mywebsite/;
          index index.html index.htm index.php;
          server_name www.mywebsite.it;

          [...]
        }

fin qui nulla di sconvolgente vero? Abbiamo semplicemente, nel blocco server, definito su che porta stare in ascolto (la 80) e dato un path per la root del sito (/var/www/mywebsite/), dopodiché definiamo il **server_name** che è in sintesi il nome del nostro virtual host.

Beh, la ricettina a questo punto prevede l'uso, invece della solita stringhetta statica, nientepopòdimenoche ...**le regex!**

Cosa succederebbe se invece di usare un virtualhost statico usassimo una regex rendendo di fatto i virtualhost parametrici?

Con nginx si fa prima a farlo che a dirlo, ad esempio:

        server {
          listen 80;

          root /var/www/mywebsite/;
          index index.html index.htm index.php;

          #server_name with some regex fun!
          server_name ~^www\\d+\\.mywebsite\\.it$;

          [...]
        }

Ok, la vedete la differenza? Ora nginx risponderà con lo stesso virtual host sia che le chiamate arrivino a:

* www1.mywebsite.it
* www2.mywebsite.it
* www234942395209359025203023509230952309509235.mywebsite.it

Insomma penso di aver reso l'idea! Utile ad esempio se voleste utilizzare un meccanismo di load balancing basato sul nome del dominio (ma non vi consiglio di farlo, siamo nel 2015!!!).

## Ricetta 2: Pennette all'amatriciana con grattuggiata di proxy nginx

Sono sicuro che Google andrà in confusione, e non poco, nel tentativo di analizzare semanticamente questa pagina, ma ho fiducia, e preferirei tornare alle nostre dissertazioni tecnologiche.

Proxare è bello, proxare è figo, giusto? **Sbagliato!** Però ogni tanto a tutti noi è servito proxare, per questa o quella ragione.

E allora proxiamo, ma con Apache, installare mod_proxy, è brutto, osceno e volgare.

Oltre a questi fattori, mod_proxy è come apporre uno scolapasta ad Apache, ovvero lo riempie di buchi, meglio lasciar stare.

Su nginx proxare è facile come... aggiungere una riga di configurazione!!!

Vediamo come, prendendo ad esempio questa configurazione:

    server {
        listen 80;

        root /var/www/mywebsite/;
        index index.html index.htm index.php;

        # Make site accessible from http://localhost/
        server_name www.mywebsite.it;

        #logs
        access_log /var/www/mywebsite/mywebsite.access.log;
        error_log /var/www/mywebsite/mywebsite.error.log;

        location / {
          index index.php index.html index.htm;
        }

        #some very magic elastic proxying...
        location /myotherwebapp/ {
          proxy_pass http://1.2.3.4:5678/;
          proxy_set_header Host $host;
        }

        location ~ \\.php$ {
          try_files $uri =404;
          fastcgi_pass unix:/var/run/php5-fpm.sock;
          fastcgi_index index.php;
          include /etc/nginx/fastcgi_params;
        }
    }

Se ci fate caso sotto il blocco `location /` c'è un una serie di configurazioni piuttosto interessanti, ovvero:

        #some very magic elastic proxying...
        location /myotherwebapp/ {
          proxy_pass http://192.168.0.1:8080/;
          proxy_set_header Host $host;
        }

Vediamo di capire cosa fanno... noi abbiamo un nostro web server che risponde al nome di:

* www.mywebsite.it

e vorremmo che questo sito esportasse come proxy anche un secondo sito, a cui accediamo con un ip interno, tanto è accessibile dal nostro nginx, e che altrimenti noi potremmo \"mostrare\" al resto del mondo se non con configurazioni apposite (routing, web server, ecc ecc).

Bene, con la nostra bella config ora ogni volta che chiamiamo un uri ben definito come:

* http://www.mywebsite.it/myotherwebapp/file

Avremo in mezzo nginx che proxa la richiesta, portando \"fuori\" il server originale, quindi questa richiesta in realtà è tradotta in:

* http://192.168.0.1:8080/file

E tutto in modo completamente trasparente per l'utente finale!!! L'unica accortezza nella configurazione sta nell'impostare che al proxy arrivi l'host originale del client, e non quello dell'nginx che proxa:

`proxy_set_header Host $host;`

Ma quanto è figo nginx?

**tanto.**

Se avete dubbi o non mi fossi spiegato bene (capita) commentate qui sotto, qualcosa vi dirò ;)

C U Soon!

*Simmessa*

p.s.: ~~non ricordavo, quanto fosse figo markdown...~~ ora me lo ricordo!