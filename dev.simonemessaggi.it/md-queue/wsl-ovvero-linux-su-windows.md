# Installare un ambiente di sviluppo Linux su Windows 10 (WSL)

Forse non tutti voi che usate Windows 10 ve ne siete accorti, anche perché se non ve la andate a cercare e ad installare non ve ne accorgerete mai, ma il 2 Agosto ricorreva il secondo anniversario dall'introduzione del **sottosistema Linux per Windows** (Windows10 Redstone 1 build 1607).

Ebbene si, dentro Windows qualche genio ha pensato di mettere Linux, ma non è una macchina virtuale, non è un container, è qualcosa di nuovo e di diverso, un'emulazione su windows delle chiamate di sistema Linux, che rendono possibile l'esecuzione non solo della shell bash, ma anche di una **vera e propria distro Ubuntu.**

Lo so, è scioccante, non me lo dite, ma ormai **sono due anni che la uso tutti i giorni** e, a parte qualche difficoltà iniziale e qualche grattacapo con cui mi trovo a fare i conti ancora adesso, è una cosa davvero utile e bella.

Non solo, ho fatto fare il salto ad un collega al lavoro e credo di avergli aperto il cervello e incasinato la testa notevolmente, ma ne è valsa la pena.

## WSL: come si installa "Bash on Windows 10"

La procedura è abbastanza semplice:

- Aprite start e **digitate "developer"**, selezionate la voce "Use developer features", se usate Windows in inglese (come è giusto!) che dovrebbe essere tradotta con "Funzionalità per sviluppatori" se avete Windows in italiano (vergogna!):

img

- Comparirà un menu di "Settings" dove dovrete andare a selezionare da un radio button il "Developer mode", fatelo e la cara M$ vi darà uno splendido warning sul fatto che potete sminchiare il vostro PC, quindi procedete baldanzosi premendo "Yes":

img

- Il terzo passo è l'abilitazione del componente aggiuntivo di windows, sempre da Start scrivete "Turn windows" e selezionate l'opzione "Turn windows features on or off":

img

- Dalla prossima finestra andatevi a scegliere "Windows subsystem for Linux" e check-ate la casella:

img

- A questo punto aprite l'odioso "Windows store" e andatevi a cercare l'app della distro Linux che più vi aggrada tra:

    - Ubuntu (16 o 18)
    - Debian
    - Kali
    - Suse / openSUSE

img

Queste sono quellew che ho individuato per ora, ma sono sicuro che la lista andrà ad arricchirsi in futuro, vi basti pensare che al lancio c'era compresa solo "Ubuntu 16".

***nota bene:** se avete una vecchia build di Windows 10 è possibile che ci sia solo l'app Bash, che incorpora Ubuntu, ma non ho conferme se non la mia scarsa memoria di 2 anni fa.*

- Lanciate l'app appena installata, a questo punto il terminale vi chiederà le credenziali dell'utente che volete creare, vi consiglio di non specificare root ma di crearvi un vostro utente non-privilegiato, state tranquilli tanto avrà i permessi di sudo

Perfetto, a questo punto avrete finito la procedura di installazione e sarete pronti ad iniziare ad usare Linux su Windows come nei vostri sogni più assurdamente sexy.

## Preparare un ambiente di sviluppo su WSL

Installata la vostra distro preferita (nel nostro esempio Debian), la prima cosa da fare è inequivocabilmente un bell'aggiornamento dei pacchetti:

`sudo apt update`

così avrete ricostruito tutte le informazioni sui repository della vostra distribuzione, vi suggerisco, già che ci siete, di procedere anche con l'installazione
di eventuali aggiornamenti:

`sudo apt upgrade`

Fatto? bene, a questo punto proseguiamo con un paio di nozioni utili

### Dove sono i miei file?

Lo standard di **WSL** prevede che il filesystem principale di Windows 10 venga montato in base alla lettera del drive su /mnt, quindi nel mio caso ho:

```
simmessa@w10:/mnt$ ls /mnt/ -la
total 0
drwxr-xr-x 1 root     root      512 Aug  6 15:21 .
drwxr-xr-x 1 root     root      512 Aug  6 15:21 ..
drwxrwxrwx 1 simmessa simmessa  512 Jul 24 13:49 c
drwxrwxrwx 1 simmessa simmessa  512 Jul 20 07:42 d
drwxrwxrwx 1 simmessa simmessa  512 Jul 20 07:42 g
```

quindi se sto cercando un file in c:\temp qui me lo troverò su:

`/mnt/c/temp/`

ottimo, quindi, qualsiasi mio file su windows lo troverò su linux con questo path, ma se si trattasse di file Linux, cioè **se devo modificare dei file dentro WSL cosa è meglio? modificarli da Linux oppure da Windows?**

Qui emerge la prima grande delicatezza di WSL, ovvero la gestione delle risorse condivise, in questo caso i file, secondo la documentazione ufficiale è **ASSOLUTAMENTE VIETATO** modificare i file WSL da Windows!

Questi si trovano dentro un percorso molto imboscato, ad esempio la cartella /etc/nginx:

`C:\Users\simme\AppData\Local\lxss\rootfs\etc\nginx`

ma ricordate, MAI E POI MAI dovrete creare o modificare file Linux da Windows, dovete farlo tramite shell.

Ma allora, siamo obbligati ad usare "vim" per editare i nostri file?

No, esistono altre opzioni, che permettono di unire i benefici di una **vera shell** con i vantaggi della UI di windows.

Quello che personalmente trovo comodo fare è creare un link simbolico tra un mount point Windows e un path Linux per ottenere i vantaggi di entrambi i sistemi, ad esempio:


```
rm -rf /var/www/
ln /mnt/c/www /var/www -s
```

A questo punto, tutti i miei repo saranno accessibili da /var/www ma avrò la possibilità di editarli anche da Windows.

L'unica controindicazione di questa tecnica sta nel fatto che per i mount point condivisi Windows setta i permessi a 777, ad esempio:

```
simmessa@w10:/mnt/c$ ls /mnt/c/Users/ -la
ls: cannot read symbolic link '/mnt/c/Users/All Users': Permission denied
ls: cannot read symbolic link '/mnt/c/Users/Default User': Permission denied
total 0
dr-xr-xr-x 1 simmessa simmessa 512 May 21 21:47 .
drwxrwxrwx 1 simmessa simmessa 512 Jul 24 13:49 ..
lrwxrwxrwx 1 simmessa simmessa   0 Apr 12 01:45 All Users
dr-xr-xr-x 1 simmessa simmessa 512 May 22 07:31 Default
lrwxrwxrwx 1 simmessa simmessa   0 Apr 12 01:45 Default User
-r-xr-xr-x 1 simmessa simmessa 174 Apr 12 01:36 desktop.ini
drwxrwxrwx 1 simmessa simmessa 512 May 22 07:42 Public
drwxrwxrwx 1 simmessa simmessa 512 Jul 23 17:29 simmessa
```

ma in realtà un modo migliore di gestire i permessi esiste, dalla build 17063 di Windows 10, anche se richiede una configurazione ulteriore, che però vi ho già descritto qui:

https://medium.com/@simmessa/problema-dei-permessi-di-wsl-bash-su-windows10-e-chiavi-ssh-ebca9bb14933

## Un buon editor?

Anni fa non avrei mai pensato di consigliarlo a nessuno, figuriamoci scriverne su questo blog... dopo anni di Sublime text sono passato a qualcosa di migliore, che mi ha consigliato un collega che usa Linux.

**Microsoft Visual Studio Code**

Si, non sto scherzando, anche se sembra, Microsoft ha sfornato un ottimo editor, completamente free, estensibile con migliaia di plugin (Docker, PlatformIO, Git, Python, Markdown, sono veramente una marea...) e soprattutto moderno, quello che sto usando in ora per scrivere questo post, tra l'altro.

Comunque, non dovete credere per forza a me, che sono un infedele, ma andate e scaricatevelo, poi se volete ne riparliamo nei commenti:

https://code.visualstudio.com/

A questo punto, se dovessimo creare un progetto dentro /var/www/bingobongo:

```
simmessa@w10:/var/www$ mkdir bingobongo
simmessa@w10:/var/www$ cd bingobongo/
simmessa@w10:/var/www/bingobongo$ git init
Initialized empty Git repository in /mnt/o/www/bingobongo/.git/
```

Possiamo poi lavorarci come folder, o meglio ancora, Workspace, dentro VS Code.

## E il terminale? alternative a quello standard di Windows 10

Per quanto riguarda invece il terminale, onestamente credo che quello di Windows, per quanto migliorato a detta loro, puzzi ancora parecchio, inoltre, sono abituato a qualcosa che supporti perlomeno le tab, quindi, vi consiglio caldamente di provare uno dei seguenti terminal emulator per windows:

1. Hyper: https://hyper.is/

img

Dopo vari mesi di utilizzo, ho iniziato ad odiarlo, in teoria gli elementi per volerlo usare ci sono tutti, è bello graficamente, pulito, supporta le tab, html, estensioni, package manager basato su node, ecc ecc, ma in realtà tutte queste cose sembrano non funzionare o funzionare davvero male su Windows 10, la mia idea è che sia preferibile su Mac OS X, ma potrei anche sbagliarmi. Il principale problema, oltre alle cose che non funzionano, è che è di una lentezza esasperante, ma quale tool basato su Electron non lo è?

2. Terminus Alpha: https://github.com/Eugeny/terminus

img

** **FORTEMENTE CONSIGLIATO** **

Ci sono arrivato dopo un po', ma ora è il mio terminal emulator di riferimento, sempre basato su Electron, sempre lento, ma almeno è stabile (forse un paio di crash in 6 mesi), e soprattutto, non serve installare alcuna estensione per usarlo agevolmente.

Forse tra qualche mese riproverò Hyper, ma per il resto **Viva Terminus Alpha!**

## Per chi usa i container: configurare Docker su WSL

Per voi che amate i container, la modalità con cui trovo più comodo usare Docker non è esattamente quella più ortodossa.

Il problema sta nel fatto che Docker come software su Linux quando viene emulato da Windows non funziona, ed è a mio parere un limite comprensibile.

Quello che normalmente faccio è installare il client docker su WSL per poi farlo interagire con il demone docker di Windows (Docker per windows: https://www.docker.com/docker-windows)

Per farlo è necessario:

1. impostare una variabile d'ambiente, io lo faccio da ~/.bashrc:

`export DOCKER_HOST=tcp://0.0.0.0:2375`

2. Abilitare le connessioni al demone sui settings di Docker per Windows:

img

Questo ovviamente ci permette di interagire da WSL con il Docker su windows, ma rimane pur sempre Docker per Windows, il che per molti versi è limitante, in alcuni casi diciamo che ho preferito crearmi una VM con Hyper-V per usare Docker "nativamente" su Linux.

## Più distribuzioni Linux in parallelo su Windows 10 

Ok, ora che abbiamo visto come installare WSL, configurare un link che fa da ponte tra Windows e Linux e preparare un ambiente di sviluppo basico, un piccolo extra.

Pazzesco ma vero, si può ufficialmente fare, anche se al momento credo la funzionalità sia un po' immatura, ma se vi va di sporcarvi le mani visitate il link ufficiale su:

https://docs.microsoft.com/en-us/windows/wsl/wsl-config

Addirittura è prevista la possibilità di farsi la propria **custom distro**, quindi se volete smanettare accomodatevi pure.

**WARNING:** *è importante ricordare che, anche se possiamo avere vari ambienti WSL indipendenti, in realtà le risorse del nostro PC sono uniche e condivise! Ad esempio: se ci mettiamo ad usare la porta 80 su Debian, non potremo più farlo su Windows oppure su Ubuntu!*