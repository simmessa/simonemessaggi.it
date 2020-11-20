# Perché Wordpress non è adatto ai siti di grosse dimensioni

Era un po' che volevo scrivere questo articolo, per varie ragioni, ma soprattutto per chiarire alcuni concetti che spesso mi trovo a ribadire in ambito professionale.

## Wordpress è un cesso

Ma come?! Il CMS del popolo, il più usato (secondo [una ricerca](https://thenextweb.com/dd/2018/03/05/30-of-the-web-now-runs-on-wordpress/) a Marzo 2018 il 30% dei siti di Internet utilizza Wordpress), il più sviluppato e quello con il maggior numero di plugin di successo, come può essere un bidone? Sicuramente ti stai sbagliando.

Non vorrei essere fraintesto, lavoro dal 2005 nel Web e dall'inizio della mia attività ho realizzato, gestito e mantenuto online centinaia di siti Wordpress, tanto per darvi un'idea la prima versione io abbia mai installato è stata la 1.5, 13 anni fa.

Ho scritto temi, plugin, ne ho installati varie centinaia di già fatti, free e a pagamento, quindi penso di poter tranquillamente smentire chi crede che questa mia critica nasca dall'ignoranza di questo CMS.

Ma allora, qual'è il vero problema di Wordpress?

Il più grave difetto di Wordpress, che lo rende di fatto inutilizzabile per siti di dimensioni "importanti" sono le performance, e il problema nasce dal modello che gli sviluppatori hanno utilizzato per salvare i dati nel database relazionale (in genere MySQl).

### La maledizione dell'EAV

Non è possibile valutare le performance di un CMS nel vuoto assoluto, perché trattandosi, appunto, di un problema di risorse, per farlo è necessario considerare un sistema fatto da:

- Il CMS usato, nel nostro caso Wordpress ([latest] (https://wordpress.org/latest.zip), nel momento in cui scrivo è la versione 4.9.6)
- l'hardware su cui questo CMS gira

Ora, qualsiasi sia l'hardware preso in esame, Wordpress è un CMS estremamente affamato in termini di memoria e CPU, questo è un dato di fatto, il problema può sembrare meno grave impiegando un server più potente ma, in ultima analisi, il vero problema di Wordpress **sta nel modo in cui usa il database.**

Wordpress, infatti, impiega per i suoi dati un modello detto EAV, ovvero Entity Attribute Value, la forza di questo modello è sicuramente la flessibilità, la debolezza, senza dubbio sono le scarse performance.

In cosa consiste EAV? Vediamolo.

In condizioni normali, una tabella su un database SQL segue una struttura di questo tipo:

*workers table, non EAV*

```
| id | nome    | cognome | lavoro    | età |
| -- |:--------|:--------| ---------:| ---:|
| 1  | Simone  | Messaggi| Ops       | 39  |
| 2  | Mario   | Rossi   | Dev       | 23  |
| 3  | Zio     | Ntunello| Dev       | 45  |
```

Questo è lo standard, e, se volete, il modello per cui i database relazionali sono stati creati ed ottimizzati nel tempo.

Al contrario, in EAV, ogni colonna viene salvata in una riga:

*workersmeta table, EAV*

```
| pseudo_id | id | chiave  | valore   |
| --------- |:--:|:--------| --------:|
| 1         | 1  | nome    | Simone   |
| 2         | 1  | cognome | Messaggi |
| 3         | 1  | lavoro  | Devops   |
| 4         | 1  | età     | 39       |
| 5         | 2  | nome    | Mario    |
| 6         | 2  | cognome | Rossi    |
| 7         | 2  | lavoro  | Soubrette|
| 8         | 2  | età     | 23       |
| 9         | 3  | nome    | Zio      |
| 10        | 3  | cognome | Ntunello |
| 11        | 3  | lavoro  | Baguette |
| 12        | 3  | età     | 45       |
```

Questo approccio, come dicevo, di esprimere le colonne come righe, ha il vantaggio di permettere facilmente la rimozione o l'inserimento di nuove "colonne" senza dover stravolgere la struttura delle tabelle. Inoltre, modificare le colonne è un'operazione costosa, a livello di performance, mentre i cambiamenti nelle righe sono il pane quotidiano di SQL e molto più veloci da effettuare.

Nel caso di Wordpress, questo approccio EAV è stato scelto proprio perché è un CMS dinamico e deve modificarsi nella struttura e nelle funzionalità costantemente, quindi il fatto di non aver particolari vincoli sulle colonne è abbastanza strategico.

Peccato però che questo approccio sia un totale disastro in termini di performance, per vedere la differenza immaginiamoci di fare una semplice query che trovi tutti i Dev che hanno più di 30 anni,

con la tabella normale, la query sarebbe:

`select * from lavoratori where 'età' > 30 and 'lavoro'='Dev'`

mentre, in caso di tabella con struttura EAV avremmo:

```
select età.id, nome.valore as nome, età.valore as età
from workersmeta età, workersmeta nome, workersmeta lavoro
where età.chiave='età' and età.valore>'50'
and età.id=nome.id
and lavoro.id=età.id
and lavoro.chiave='lavoro' and lavoro.valore='Dev'
```
E questa query ricostruisce una tabella con più colonne creando **varie tabelle temporanee** che poi vengono "joinate" tramite un valore "id" comune.

Ora, più operazioni si fanno sul DB e più una query diventa costosa, ma il vero problema è che ci sono alzune operazioni su DB che sono ben più costose di altre, e in questo caso ne abbiamo due:

- creazione di tabelle (temporanee)
- join di tabelle

Parametrizzando il costo computazionale possiamo dire che, se una tabella come quella vista ha N righe, la query EAV ha un costo di NxN, questo significa che al crescere del numero di dati nel nostro database il costo computazionale, quindi la lentezza delle query, cresce a dismisura.

MySQL fornisce parecchie ottimizzazioni per le performance, ma nel caso del modella EAV stiamo avvicinandoci parecchio al "caso peggiore" dal punto di vista del costo computazionale.

Se ci addentriamo in una classica query di join, le cose si fanno anche peggiori.

Ad esempio, se prendiamo questa struttura del DB con i dati dei turni dei nostri lavoratori:

*Turns table, non EAV:*
```
| worker_id | turn_date|
| --------- |:---------|
| 1         | 2018-6-11|
| 2         | 2018-6-2 |
| 3         | 2018-6-7 |
| ...       | ...      |
```
e facciamo la query per trovare i lavoratori di turno il giorno 2 giugno 2018:

`select * from turns, workers where turns.worker_id=workers.id and turn_date='2018-6-2'`

con la tabella in forma EAV, le cose si fanno ancora più complesse:

```
select * from workersmeta,
(select worker_id,
from turnsmeta o1, turnsmeta o2, workers
where o1.worker_id=o2.worker_id
and o1.worker_id=workers.ID
and o2.turn_date='2018-6-2') t
where workersmeta.worker_id=t.ID 
```

Cioè la *join* vista sopra diventa una *self-inner join* più una *table join* annidata.

Nel caso di M turni su N lavoratori avremo una complessità di **MxNxN**, che è davvero mostruosa.

## Wordpress e tipi di record MySQL

Un altro problemino di Wordpress nella struttura del DB consiste nell'uso spregiudicato che fa del tipo *Longtext*, che è tra i più generici.

Wordpress salva numeri, date, stringhe e oggetti serializzati in questo tipo di record, andando di fatto ad annullare alcune delle ottimizzazioni che MySQL fa sulle query, senza avere nemmeno una buona ragione per farlo!

A causa di questa *bad practice* di Wordpress tutta una serie di query MySQL di filtraggio, range, ordinamento per data, ricerca full text diventano **mortalmente lente**.

## Non è solo colpa di EAV

Al di la della scelta di usare il modello EAV, che ha qualche pregio importante in termini di flessibilità, Wordpress riesce ad utilizzare questo modello (EAV) in modo **piuttosto scadente.**

La ragione di questo ulteriore problema va, secondo me, ricercata nel fatto che i [developer di Wordpress](https://automattic.com/) avessero nei piani di creare una semplice piattaforma di blogging, poi evolutasi in modo caotico e imprevedibile nel corso degli anni (Worpress nasce, ve lo ricordo, nell 2003). Quello con cui si sono ritrovati poi è un CMS, certamente di successo inaudito, ma che, per ragioni di *marketing* hanno deciso di bloccare dal punto di vista filosofico su un **blog engine** con feature aggiuntive, perché, si sa, *squadra che vince non si cambia*.

Purtroppo il mondo ha deciso diversamente, e, va riconosciuto, attraverso una community infinita di designer, developer e smanettoni vari, oltre che di aziende innovative, Wordpress da blog è stato trasformato in un CMS tuttofare.

I risultati della trasformazione sono, com'è facile intuire, una serie imbarazzante di compromessi... ad esempio:

- La tabella dei post contiene anche immagini, attachment, record vari creati dai plugin
- qualsiasi entità è praticamente un post, usi Woocommerce? Un ordine è un post!
- La tabella dei post, con questo approccio, è destinata ad esplodere nel tempo, rendendo qualsiasi operazione su DB un'agonia
- Le operazioni sulla tabella dei post soffriranno di problemi di concorrenza, e i lock che ne conseguono rendono le operazioni ancora più lente

D'accordo, come spesso accade oggi non è difficile trovare *hosting* specializzati in Wordpress con la loro bella serie di ottimizzazioni, ma perché scegliere di andare su una 500 elaborata a livelli impensabili invece di scegliere una Lamborghini spendendo poco di più?

## Si, ma io uso la cache di Wordpress!

Questa è la prima obiezione sensata che di solito mi sento rifilare quando cerco di spiegare che Wordpress è si bello, ma non è perfetto per qualsiasi caso d'uso.

I contributor / creatori di plugin Wordpress hanno velocemente capito che un sito su questa piattaforma, all'aumentare delle dimensioni diventa via via sempre meno veloce e gestibile.

Sono quindi corsi ai ripari andando ad integrare il modello di dati con una serie di funzionalità di caching più o meno avanzate.

Quello che oggi abbiamo per mantenere decente il livello di **performance di Wordpress** sono una serie di *caching plugin*, tra cui cito i più noti:

- W3 Total Cache
- WP Super Cache
- WP Rocket
- ecc...

Alcuni di questi sono veramente ben fatti, ad esempio W3 Total Cache (quello che conosco meglio) è fantastico per chi si occupa di ops.

Quasi qualsiasi parte di Wordpress infatti si riesce a velocizzare con le cache, abbiamo a disposisizione:

- Cache delle pagine (Server)
- Cache degli oggetti (Server)
- Cache delle query sul DB (Server)
- Cache delle immagini (Server e Client)
- Cache asset statici (Client)

Il risultato è che molte pagine smettono di essere calcolate dinamicamente da PHP ma vengono staticizzate, con benefici di performance enormi.

Purtroppo, anche in questo caso si evidenziano alcuni limiti di Wordpress.

## Wordpress è fantastico, in qualche caso

Se avete un blog o un sito in cui la funzionalità principale è la **lettura di contenuti**, nessun problema, il caching diventerà il vostro miglior alleato per avere un sito performante.

Questo perché il caching è tanto più efficace quanto meno i contenuti all'interno del sito cambiano, quindi in un sito dove, idealmente, un contenuto viene creato e non più toccato, poi letto migliaia o milioni di volte dagli utenti, il caching va alla grande.

Ovviamente al crescere del numero di contenuti diventa più difficile mantenere una cache veloce che abbia al suo interno tutto il contenuto del sito.

Se vi è capitato di attendere qualche minuto per leggere qualche vecchio articolo su qualsiasi sito sapete già di cosa sto parlando.

E' inevitabile che, quei contenuti che vengono letti raramente, come ad esempio i contenuti più vecchi, siano quelli che hanno **la minor probabilità di trovarsi in cache**, quindi questi contenuti verranno caricati solo al momento della richiesta, con performance spesso scandalose su Wordpress.

Se invece il vostro modello si discosta da quello del blog o del sito di News **la situazione peggiora notevolmente.**

Prendete ad esempio uno store online o *Ecommerce*, qui in ogni momento avrete aggiornamenti, ai prodotti, agli ordini, alle quantità in magazzino, alla scontistica, offerte speciali e così via.

In un caso come questo, l'efficacia della cache va a farsi benedire, ecco una delle tante ragioni per cui Wordpress non ha mai veramente preso piede nell'ecommerce di un certo livello (dove troneggiano Magento, Zencart, Prestashop & co) nonostante la disponibilità di buoni plugin tra cui *Woocommerce*.

In generale, **il caching è una soluzione parziale al problema delle performance,** quindi migliora decisamente la situazione, ma se avete un collo di bottiglia delle dimensioni di uno spillo sul DB MySQL difficilmente questa tecnica rappresenterà la soluzione definitiva.

## Alternative a Wordpress

Se i limiti di Wordpress non fanno per voi, non vi resta che andare a caccia di alternative, ma, ve lo anticipo, non sarà facile trovare qualcosa di analogo, e a ragion veduta.

Il vero problema di Wordpress secondo me sta nel fatto che questa piattaforma negli anni ha cercato di essere tutto, e quando vuoi essere un tuttofare è facile che tu non sia davvero bravo in niente... *Jack of all trades, master of none* dicono gli inglesi, e hanno ragione.

Se sapete già di cosa vi occuperete, e siete sicuri di non dover fare altro, vi conviene orientarvi verso piattaforme meno flessibili ma più ottimizzate, per gli ecommerce abbiamo già visto che esistono varie alternative, se dovete scrivere una webapp specifica per la prenotazione di viaggi ad esempio, difficilmente troverete qualcosa di già fatto, e **dovrete svilupparvela voi** o farlo fare ad una software house.

In questi ultimi tempi stanno nascendo molti nuovi progetti che presentano un approccio alternativo a Wordpress, ad esempio ci sono i Flat CMS, dove non esiste un DB ma tutti i contenuti stanno su disco, gli headless CMS, che forniscono un backoffice e una collezione di API (solitamente REST), ma non hanno un frontend e quindi lasciano la massima libertà in questo senso.

Illustrare tutte le possibili alternative va al di la dello scopo di questo articolo, quindi non mi dilungherò oltre, sappiate che ci sono [migliaia di piattaforme](https://en.wikipedia.org/wiki/List_of_content_management_systems) in base al linguaggio utilizzato, ecco qualcuna di quelle che ho sentito nominare:

- [CMS Made Simple](https://www.cmsmadesimple.org/) in PHP
- [Django CMS](https://www.django-cms.org) in Python / Django
- [Mezzanine](http://mezzanine.jupo.org/) in Python / Django
- [Sulu](https://sulu.io/en) ih PHP / Symfony
- [Craft](https://craftcms.com/) in PHP
- [Ghost](https://ghost.org/) in NodeJS
- [Keystone](http://keystonejs.com/) in NodeJS
- [Gravity](https://getgrav.org/) flat CMS in PHP
- [GraphCMS](https://graphcms.com/) headless CMS as a Service, graphQL API

## Bibliografia

Tiro queste conclusioni dopo anni di esperienze personali, ma non è tutta farina del mio sacco, molte delle cose che scrivo le ho imparate a mia volta leggendo su internet, tra cui [questo eccellente articolo](http://www.antradar.com/blog-wordpress-and-the-curse-of-eav)