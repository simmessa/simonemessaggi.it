# CORS
Le CSP sono direttive che permettono di stabilire quali risorse si possono caricare cross origin.

NON E' Come CORS:

https://devonblog.com/security/difference-between-cors-and-csp-security-headers/

dominio1.com vuole chiamare risorse di dominio2.com

La soluzione CORS:

Su dominio2.com mettere header:

Access-Control-Allow-Origin:'dominio1.com'

Il che spesso e' un casino perche' non e' detto che abbiamo accesso agli header (quindi la config) del dominio2.com

A volte, anche configurando le cose propriamente, se ci sono di mezzo CDN o cose simili si va a finire per impostare il CORS header of DOOM:

Access-Control-Allow-Origin: '*' 
Oppure
Access-Control-Allow-Origin: 'any'

Che significa, TUTTO IL MONDO puo' usare le mie risorse… (no buono)

La soluzione CSP:

Il problema viene affrontato al contrario, ovvero sul dominio chiamante (dominio1.com), dove si specifica un header CSP:

Content-Security-Policy: script-src dominio2.com

Con CSP di fatto controlliamo che risorse possono essere caricate dal dominio chiamante! (dominio1.com)

Ma questo non e' sufficiente, e' solo meta' del lavoro…

ATTENZIONE: CSP E CORS lavorano in tandem!

Quindi su dominio2.com dovremo comunque avere:

Access-Control-Allow-Origin:'dominio1.com'

Qualche esempio:

No cross origin:

Content-Security-Policy "default-src 'self';"

From <https://www.netsparker.com/blog/web-security/content-security-policy/> 

Cross origin da example.com (tutti i protocolli):

Content-Security-Policy: default-src *://*.example.com

From <https://www.netsparker.com/blog/web-security/content-security-policy/> 

Con CSP e' possibile ovviamente specificare piu' valori separati da spazi (poi faremo qualche esempio) con il limite che ogni direttiva puo' essere specificata solo una volta nello stesso header. 

Oa vediamo le direttive piu' comuni per CSP, con una breve spiegazione:

default-src:

Direttiva di fallback per la default content policy, generalmente si specifica default-src 'self' per matchare il caso di default con lo scenario piu' restrittivo, DA NOTARE: il dominio origine puo' caricare da se stesso ma NON dai sottodomini. Altro valore usato e' default-src 'none' che blocca TUTTO cio' che non e' esplicitamente messo in whitelist.

script-src:

Direttiva usata per mettere in whitelist una qualsiasi source, ad esempio:

script-src 'self'

o anche:

script-src 'dominio2.com'

o anche:

script-src '*.dominio2.com'

oppure specificando il protocollo:

script-src 'https://*.dominio2.com'

style-src:

Direttiva usata per mettere in whitelist solo fogli stile CSS, ad esempio:

style-src 'self'

connect-src:

Direttiva usata per mettere in whitelist origin per chiamate JavaScript dirette come EventSource, WebSocket o XMLHttpRequest

object-src:

Direttiva che permette il controllo delle source di plugin come Flash, in combinazione ad esempio con le direttive plugin-types

img-src / font-src / media-src:

Direttive per il controllo delle src di immagini, font e audio/video

child-src / frame-src & worker-src:

La direttiva child-src (level 2) permette il whitelisting delle source di JavaScript workers e embedded frame contents. Nello standard level 3 invece si possono controllare individualmente con frame-src e worker-src

frame-ancestors:

Questa direttiva limita gli URL che possono embeddare la pagina corrente via <iframe>, <object> e simili

## Embedded JavaScript, 'unsafe-inline' e 'unsafe-eval'

CSP prevede di evitare esplicitamente il javascript all'interno della pagina html. Questo significa niente `javascript:` e <script> embeddati.

Se proprio non fosse possibile evitarne l'uso, esiste la keyword unsafe-inline per permettere l'embed (inline) di js per alcune risorse.

Ad esempio:

`script-src 'unsafe-inline'` permette di utilizzare risorse js embeddate con `javascript:` o <script>

L'analogo di unsafe-inline per la valutazione dinamica di codice js, ovvero eval() è unsafe-eval, ad esempio:

`script-src 'unsafe-eval'`

Utile ricordare che entrambe sono delle bad practice dal punto di vista della security, e andrebbero evitate (quasi) ad ogni costo.

## Nonce e hash

Abbiamo visto che usare unsafe-inline non è molto salutare dal punto di vista della security, giusto? Bene, perche' esistono dei metodi alternativi per fare la stessa cosa, ad esempio con un token numerico utilizzabile solo una volta, il cosiddetto nonce (number once): 

<script nonce="d2XuFuqLBuiywMPzExVvHmGT">alert('Hello world');</script>

Il nonce ci da la possibilita' di whitelisting individuale sullo script tag specifico con:

Content-Security-Policy: script-src 'nonce-d2XuFuqLBuiywMPzExVvHmGT'

Rigenerare il nonce per ogni refresh della pagina puo' essere impegnativo, la soluzione alternativa consiste nell'utilizzare l'hash dello script stesso, ovvero:

   alert('Hello world');

echo "alert('Hello world');" | sha256sum 
aab92fa2392cd1bc4d52eee119ea0e5de58868faa051ba8a6617d91c8d1b40fc -

Ci permette di mettere in whitelist il codice con:

Content-Security-Policy: script-src 'sha256-aab92fa2392cd1bc4d52eee119ea0e5de58868faa051ba8a6617d91c8d1b40fc'

From <https://www.netsparker.com/blog/web-security/content-security-policy/> 

Anche se è piuttosto laborioso.

## Direttive a livello di pagina

A parte le whitelist esistono altre CSP utili da conoscere.

sandbox:

Questa direttiva ci permette di trattare la pagina come se fosse inclusa in un iframe, ottimo per i test.

upgrade-insecure-requests:

Lo scopo di questa direttiva è quello di riscrivere gli url non sicuri (HTTP) con gli equivalenti sicuri.
In pratica, questa direttiva costringe il client a chiamare le risorse con https.

