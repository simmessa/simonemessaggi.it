# Guida all'installazione di WSL2

Qualche giorno fa, Microsoft ha annunciato la disponibilita' di WSL2 al mondo attraverso il *fast ring* dell'insider preview (Version 10.0.18917.1000) e ho deciso di buttarmici per provare il nuovo ambiente.

Sono da anni un utilizzatore di WSL (Windows Subsytem for Linux) e quindi potete ben immaginare la mia contentezza quando, a meta' maggio, Microsoft ha annunciato i suoi piani per il rilascio di questo aggiornamento.

WSL per me e' uno strumento imprescindibile, ma che fino ad ora ha avuto alcuni limiti importanti che ne hanno in qualche modo pregiudicato la diffusione su larga scala.
Basta andare ad una convention di dev, molti dei quali windows users, per notare che pochi usano WSL come strumento di lavoro, giudicandolo troppo basico per le loro esigenze.

Ma le "inadeguatezze" di WSL sono secondo me destinate a scomparire ora che Microsoft ha cambiato approccio.

## WSL2, cosa cambia

Si perche' WSL v2 porta qualche novita' sotto il sole, non e' piu' un layer di portabilita' nativo Win32, ma diventa una specie di bridge tra la virtualizzazione di Hyper-V e le funzionalita' di Windows10.

Ritengo questo approccio valido perche' e' quello che, per anni, tutti noi abbiamo fatto: installare una VM Linux su Windows.

Le principali novita' di WSL2 consistono nelle performance, migliorate in modo evidente, e nel fatto che, finalmente, alcune operazioni difficili o impossibili in WSL v1 sono ora pienamente supportate.

Un esempio su tutti e' [Docker](https://www.docker.com/), che su Windows10 resta uno strumento parzialmente compromesso, basato su una sua VM inaccessibile, e abbastanza scomodo da usare.

WSL2 permette infatti l'uso di Docker nativo come fareste su Linux, con la mappatura dei volumi sul filesystem WSL e tutto il resto.

## Come installare WSL2 dal *Fast ring*

Vediamo subito cosa e' necessario fare per provare WSL2 subito, senza attendere la prossima update di Windows10.

C'e' [una pagina dedicata](https://docs.microsoft.com/en-us/windows/wsl/wsl2-install) di Microsoft che spiega nel dettaglio i passaggi, ma cerchero' di sintetizzare qui cosa dovete fare perche' le istruzioni di Microsoft richiedono la navigazione di piu' pagine sconnesse tra loro, che e' davvero scomoda.

>**NOTA BENE:** il prerequisito per seguire questa guida e' possedere *Windows10 professional edition*, la Home edition non funziona, sorry...

### Passare al fast ring

Prima di qualsiasi altra cosa, per provare WSL2 dovrete passare al fast ring.

Per farlo cercate dal menu' di avvio la parola 'insider' e selezionate l'opzione 'Windows Insider Program Settings':

IMG

Dopodiche' scegliete il fast ring nella pagina dei settaggi:

IMG2

Windows a questo punto vi chiedera' il vostro Microsoft account e di abilitarlo alle versioni pre-release, quindi assicuratevi di avere le vostre credenziali a portata di mano.

Una volta fatta questa procedura' Windows10 vi chiedera' di riavviare il PC, fatelo e, una volta loggati, andate alla pagina di Windows Update.

E' il momento di aggiornare il vostro PC al fast ring, vi potrebbe servire un po' di tempo per scaricare la nuova build per cui vi consiglio di  procurarvi altro da fare per ingannare l'attesa.

Una volta aggiornato alla **build 18917** possiamo passare all'attivazione di WSL2.

### Installare Hyper-V e WSL2

Prima di tutto controllate se avete gia' abilitato la *Virtual Machine Platform* di Microsoft (un modo elaborato di dire Hyper-V).
Lo potete fare nei settings scrivendo hyperv dentro la ricerca del menu' start:

IMG3

Anche in questo caso, se l'avete appena abilitata sara' necessario un altro avvio, portate pazienza...

Una volta fatto tutto questo e' il momento di aprire Powershell come Administrator:

IMG4

Ed eseguire alcuni comandi, nell'esempio vedrete che faccio riferimento alla distro *Ubuntu-18.04*, ma nel vostro caso potrebbe essere diversa, quindi ricordatevi di adeguare i comandi di conseguenza:

```
PS C:\WINDOWS\system32> wsl -l -v
  NAME            STATE           VERSION
* Ubuntu-18.04    Running         1

PS C:\WINDOWS\system32> wsl --set-version Ubuntu-18.04 2

PS C:\WINDOWS\system32> wsl --set-default-version 2
```
A questo punto Windows si occupera' di migrare tutto il vostro WSL alla v2, e vi avviso che ci vorranno alcuni minuti, in base alla complessita' del vostro WSL, quindi mettetevi comodi.

Una volta terminato vi aspetta l'ennesimo reboot, dopodiche' vi consiglio di verificare che il WSL sia effettivamente alla v2:
```
PS C:\WINDOWS\system32> wsl -l -v
  NAME            STATE           VERSION
* Ubuntu-18.04    Running         2
```

Ottimo, possiamo iniziare a divertirci un po'.

## Ottimizzare WSL per la v2

Se siete passati alla V2 noterete subito una maggiore velocita' di esecuzione dell'ambiente Linux, ma per ottenere il massimo Microsoft consiglia di spostare tutti i file nel filesystem di WSL2.

Questo dopo aver chiesto, per anni, di tenere i file sul disco C (/mnt/C), suona un po' strano, ma e' effettivamente necessario per l'architettura a VM di WSL2.

Purtroppo cosi' facendo perderete l'accesso ai file da Windows, ma una delle novita' di WSL2 e' che potrete lanciare File Explorer direttamente da Linux/WSL:

```
explorer.exe .
```
IMG

Se non vi stupisce questo io non so, comunque in generale se volete vedere i file linux potrete accedere da windows (file explorer) con questo meta-path:

```
\\wsl$\Ubuntu-18.04
```

Sostanzialmente come se fosse un disco di rete, e senza perdere nemmeno un minuto con la configurazine di samba!

Un altro fix che e' stato necessario per me e' quello della *umask* di default, che WSL v1 configurava a 0000 per limitazioni del filesystem (in realta' gia' risolte da tempo in WSL1, ma tant'e'):

```
umask
0000
```

Potrebbe non essere necessario nel vostro caso, ma se fosse utile, per risolvere la cosa dovete mettere:
```
umask 0002
```
nei settaggi della vostra shell (.bashrc se usate bash).

## Installare Docker e docker-compose (bonus)

Se siete arrivati fino a qui e volete provare qualcuna delle novita' di WSL2 vi consiglio caldamente di procedere installando docker.

Trovate tutti i comandi necessari nello script qui sotto, che potrete creare ad esempio tramite VS code, lanciando 'code get-docker.sh':

```
#!/bin/bash

sudo apt-get update
sudo apt-get install -yqq apt-transport-https ca-certificates curl gnupg2 software-properties-common
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -yqq docker-ce
#docker-compose
echo
echo "*** Now installing docker-compose binaries ***"
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
echo
echo "Done."
```

a questo punto vi consiglio di controllare se il vostro sistema mappa un DOCKER_HOST come ENV var perche', in quel caso, potreste avere problemi:

`export | grep DOCKER`

Se ottenete qualcosa da questo comando e' il caso di rimuovere la var, perche' finalmente Docker su WSL2 si collega al demone Docker direttamente via socket.

Una volta finita l'installazione vi consiglio di aggiungere il vostro user al gruppo docker per lanciare i comandi senza essere root:

```
sudo usermod -aG docker your_username
```

e testate che tutto sia a posto con un `docker ps`.

## Aggiungere una GUI con X11 forwarding (bonus)

Se volete provare l'ebrezza di un sistema grafico Linux dentro il vostro Windows, vi consiglio di installare alcune cose che lo renderanno possibile.

Prima di tutto, servono alcune app grafiche per testare X:

```
apt install x11-apps
```

Lato windows, invece, ci servira' un X server, ce ne sono alcuni gratuiti e open source come:

- [Xming](https://sourceforge.net/projects/xming/)
- [Vcxsrv](https://sourceforge.net/projects/vcxsrv/)

oppure esiste un'alternativa commerciale che non mi e' sembrata affatto male:

- [X410](https://token2shell.com/x410/)

Bene, ora non resta che indicare a Linux dove si trova il server X, vi consiglio di aggiungere questa riga ai settings della vostra shell:

```
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0
```

Ora fate una prova verificando che esista la ENV var DISPLAY e lanciando, ad esempio xterm:

```
. ~/.bashrc
echo $DISPLAY
192.168.154.129:0
xterm
```

Se per caso non dovesse funzionare vi consiglio di controllare i settings del vostro X server, in alcuni casi e' necessario abilitare le connessioni da PC esterni, perche' WSL e' visto proprio in questo modo:

IMG

Se invece state usando Vcxsrv ricordatevi che e' necessario lanciarlo con lo switch '-ac' per farlo funzionare in WSL.

`vcxsrv -ac`

Ottimo, ora potete lanciare app X su WSL con performance simili a quelle native di Linux!

Ad esempio... [Emacs](https://www.gnu.org/software/emacs/):

IMG

## Concludendo, WSL2

Se mi avete seguito fino a qui: Bene!
Spero vi sia stato utile e vi lascio con le mie conclusioni su WSL2.

Personalmente adoro quello che Microsoft sta facendo negli ultimi tempi e spero che continui per molto tempo in questa direzione, Windows10, partito forse un po' in sordina come l'ennesima versione di Windows, sta diventando forse l'unico sistema 2-in-1 in circolazione.

Credo che in futuro i Mac, oggi un monopolio hardware "insopportabile", saranno un po' meno appetibili di PC Windows in cui saremo sempre piu' liberi di sceglierci l'hardware che piu' ci piace e di abbinarlo al software che preferiamo (Linux, Windows, BSD, ecc).

Certo WSL2 non e' perfetto e ci sono ancora alcune cose da sistemare, ad esempio un baco / non-feature di VS code che non sa editare in "remote" tutti i file a cui accede via symlink (Cfr. [Issue #4152](https://github.com/microsoft/WSL/issues/4152) che ho aperto proprio oggi).

Cio' nonostante WSL2 per me rappresenta oggi forse l'unico modo di unire i vantaggi di Windows (diffusione software in qualsiasi ambito esistente) con la flessibilita' e potenza della CLI Linux in un pacchetto molto interessante.

A questo punto, non resta che sostituire uno dei componenti piu' vetusti dell'ecosistema windows, ovvero il terminale!

Fortunatamente il [Windows10 terminal](https://www.theverge.com/2019/5/6/18527870/microsoft-windows-terminal-command-line-tool) e' dietro l'angolo per cui non vedo davvero l'ora di metterci su le mani e di provarlo.

Per il momento, se vi serve un buon terminale multi-tab, vi consiglio l'eccellente [Terminus Alpha](https://github.com/Eugeny/terminus), che pur essendo in Alpha e' gia' parecchio usabile, e il cui developer, [Eugeny](https://github.com/Eugeny), e' una persona a dir poco squisita!
