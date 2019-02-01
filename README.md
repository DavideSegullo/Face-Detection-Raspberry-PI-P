# Face-Detection-Raspberry-PI

# Description
Il progetto mira a realizzare un architettura client-server per il riconoscimento facciale, delegando l'elaborazione del video, usando OpenCV , al server.
Il client visualizzerà una pagina web attraverso la quale verrà richiesto l'accesso alla webcam (o fotocamera) del dispositivo e si occuperà di inviare i frame dello stream video al server, il quale risponderà inviando le informazioni relative alla posione del volto.

# Installazione e Utilizzo

1. Install Node.js.
1. Install OpenCV
1. Eseguire `npm install` per installare le dipendenze (Se OpenCV è mancante, viene scaricato e compilato).
1. Spostarsi all'interno della directory 'w_server'
1. All'interno di quest'ultima è necessario installare i certificati SSL, attraverso i seguenti comandi:
      - openssl genrsa -out privatekey.pem 1024 
      - openssl req -new -key privatekey.pem -out certrequest.csr 
      - openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
1. Sempre all'interno di 'w_server', per avviare il web server è necessario eseguire il comando 'sudo node webserver.js'
1. Navigate to [https://localhost:8080/public/index.html](https://localhost:8080/public/index.html) in a browser.

