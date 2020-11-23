# Problema dei permessi di WSL (Bash su Windows10) e chiavi SSH

Per voi che, nonostante tutto, continuate ad amare Windows come piattaforma per i vostri progetti, compreso lo sviluppo software, scrivo questo rapido post.

Sviluppare su windows in ambienti misti Linux/Windows è diventato una realtà interessante da quando Microsoft ha lanciato Bash su Windows, purtroppo però, il prezzo da pagare per questa feature comoda sono la serie di sconvenienze e problemi che questo modello ci impone.

## Il problema delle chiavi "aperte al mondo" su SSH

Aggiornando *Ubuntu Xenial* sulle mie box Windows10 mi sono trovato versioni aggiornate del client SSH, il che è sempre bello.

In particolare, controllando la nuova versione potreste avere anche voi questa:

```
$ ssh -V
OpenSSH_7.2p2 Ubuntu-4ubuntu2.4, OpenSSL 1.0.2g  1 Mar 2016
```

Che, tra le altre cose implementa un **security fix**, per molti versi innocuo, ma che **può finire per ammazzare noi dev** che usiamo la WSL (Windows Subsystem for Linux) / Bash on Windows.

In particolare, se vi capita di usare chiavi in formato PEM per accedere in SSH su ambienti cloud come AWS potrebbe facilmente darsi che siano sulla vostra partizione Windows.

E che male c'è? direte voi?

Appunto.

Ma qui arriva il bello, perché dovete sapere che Windows10, quando usate una shell bash del WSL, monta i vostri dischi locali rispettando le lettere assegnate alle unità e ve li fa trovare nella directory mount, ad esempio:

```
C: on /mnt/c type drvfs (rw,noatime,uid=1000,gid=1000)
D: on /mnt/d type drvfs (rw,noatime,uid=1000,gid=1000)
G: on /mnt/g type drvfs (rw,noatime,uid=1000,gid=1000)
```

Se vedete il filesystem type è **drvfs** che a quanto ne so è fatto appositamente per montare le partizioni windows come *passthrough* su WSL.

Ottimo, ma dove sta il problema? Nel fatto che, facendo un `ls -la` troverete una situazione dei permessi abbastanza stramba, ad esempio:

```
total 884K
drwxrwxrwx 1 root root 4.0K May 23 09:55 .
drwxr-xr-x 1 root root  512 May 25 15:38 ..
drwxrwxrwx 1 root root 4.0K Sep 12  2017 BKP
drwxrwxrwx 1 root root 4.0K Oct 17  2017 Docker_data
drwxrwxrwx 1 root root 4.0K May 25 16:08 Drive
-rwxrwxrwx 1 root root 884K Dec  1  2006 msdia80.dll
```
Come potete vedere, infatti, abbiamo che tutti i file hanno permessi 777, iniziate a vedere dove voglio arrivare?

Il problema, se avete le vostre chiavi in formato *.pem* sulla partizione Windows è che lanciando un comando ssh con il parametro -i vedrete questo:

```
ssh -i /mnt/c/keys/mykey.pem admin@192.168.1.234

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

Permissions 0777 for '/mnt/c/keys/mykey.pem' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "/mnt/c/keys/mykey.pem": bad permissions
Permission denied (publickey).
```

Bestiale vero? Le nostre chiavi private sono troppo aperte, quindi SSH si rifiuta di usarle!!

Alla faccia dei power users...che non rispettano le regole basiche di security.

Comunque, qualsiasi sia la vostra reazione ad un avviso di questo tipo (io l'ho odiato, ovviamente, saranno c***i miei cosa faccio con le mie chiavi?) esiste un modo per fixare, come riportato sul sito della documentazione microsoft per la build 17063, con cui si può risolvere il problema.

## La soluzione

La soluzione è abbastanza semplice, perché la build 17063 di Windows10 introduce un nuovo meccanismo per DrvFs che si chiama "Linux metadata", abilitandolo potrete mantenere dei permessi diversi da 777 sui vostri file e fare in modo che Windows se li ricordi e li mantenga, quindi, procediamo con ordine:

* Verificate di avere installato una build con release > 17063
* Quindi smontate il file system "incriminato" dove si trovano le vostre chiavi (root required):

`# umount /mnt/c`

* A questo punto, dovete rimontarlo specificando il parametro che abilita il metadata (root required):

`# mount -t drvfs C: /mnt/c -o metadata`

* Infine, modificate i permessi del vostro file delle chiavi in qualcosa di più restrittivo, ad esempio:

`# chmod 755 /mnt/c/mykey.pem`

Trattandosi di un dato che può dare libero accesso ai server, un permesso più restrittivo come '650' potrebbe essere una buona idea.

Se volete verificare che il mount ora abbia il metadata, vi basterà lanciare:

```
# mount

[...]
C: on /mnt/c type drvfs (rw,relatime,metadata)
[...]
```

Ora, se rilancerete il vostro comando SSH, scoprirete che non si lamenterà più e vi permetterà di collegarvi alla vostra box.

**Problema risolto!**

Simone "Testa Tecnologica" Messaggi