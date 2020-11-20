#Refused to execute script from X because its MIME type ('application/json') is not executable, and strict MIME type checking is enabled.

*Articolo originariamente pubblicato su Simmessa.com il 30 giugno 2016*

![Vietato sniffare](/tech/content/images/2016/06/k9-marijuana-dog.jpg)
Vi è capitato questo errore? Tranquilli, può succedere a tutti...

Diciamo che vi siete fatti la vostra bella API json e poi, per risolvere lo spiacevole problema del caricamento cross-domain in AJAX

Ma come c***o si risolve? vediamo subito.

##Dove nasce l'errore

Questo problema non dipende dal browser o da diavolerie varie, ma da un simpatico header:

`X-Content-Type-Options: nosniff`

Si, basta un semplice header come questo per distruggere il vostro amato gateway JSONP. L'header dipende da un aggiornamento di sicurezza volto a proteggere i siti dal MIME sniffing possibile in alcuni browser, e se volete approfondire leggetevi pure [questo articolo](http://stopmalvertising.com/security/securing-your-website-with-.htaccess/.htaccess-http-headers.html).

Ma la sostanza del problema è che alcuni browser (tra cui Chrome latest) si rifiuteranno di leggere dati in JSONP se il server che li fornisce specifica questo header.

Ma vediamo di capire meglio perché Chrome restituisce l'errore.

Solitamente, quando chiamiamo delle API JSON in AJAX riceviamo i dati con un ben determinato content type, che, se tutto è configurato correttamente è:

`Content-type: application/json`

Ma se facciamo la richiesta in JSONP, cosa succede?

Ad esempio la chimata json in jQuery:

`$.ajax({
     url: someurl,
     type: 'get',
     dataType: 'json',  
     success: function (data) {
      //fai qualcosa
     },
     error: function(xhr, status, error) {
        console.log(xhr.responseText);
     }
 });`

in jsonp diventa:

`$.ajax({
     url: someurl,
     type: 'get',
     dataType: 'jsonp',  
     success: function (data) {
      //fai qualcosa
     },
     error: function(xhr, status, error) {
        console.log(xhr.responseText);
     }
 });`

e qui iniziamo ad avere l'errore.

Se guardiamo gli header di risposta notiamo che:

nel primo caso il content type è:

`Content-type: application/json`

nel secondo caso, invece:

`Content-type: application/json`

Notate qualcosa di strano? Il content type è lo stesso!! Questo perché il server non sa distinguere il json dal jsonp, in condizioni normali.

###Qual'è il content type giusto?

Attenti a non farvi fregare, può capitare di pensare di poter risolvere con un content type:

`Content-type: application/jsonp`

Ma si tratta di una grande cavolata, perché jsonp non esiste! Quello che noi chiamiamo jsonp infatti altro non è che una banale funzione in javascript, il cui type è:

`Content-type: application/javascript`

##Come si risolve?

Dipende da cosa preferite voi, qualcuno suggerisce la strada di [inserire nel web server](http://erikzaadi.com/2012/07/16/jquery-compatible-jsonp-with-nginx/) la logica necessaria ad aggiornare il content type in base al tipo di richiesta, personalmente non mi piace come strada.

Qualcun altro sostiene che il fix al problema sia quello di rimuovere l'header che causa il problema, un po' come dire che se partecipi spesso alle sparatorie ma il giubbetto antiproiettile ti causa irritazione alla pelle dovresti smettere di indossarlo...!

Non entro nel dettaglio della vostra specifica architettura, ma per me è ovvio che la soluzione migliore non sia rimuovere l'header \"nosniff\" bensì andare a specificare il content type corretto!

Come si fa? Ad esempio, in php, bastano queste cinque righe di codice:

`if($_GET['callback'] != ''){
    header('Content-type: application/javascript');
  } else{
    header('Content-type: application/json');  
  }`

Se la richiesta gestita dalle API contiene il parametro callback, il server ora risponderà con il content type più adatto per il JSONP, che è \"application/javascript\"