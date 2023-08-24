# LearnUniVerse

LearnUniVerse è una piattaforma di tutorato P2P che consente agli studenti di tutti gli Atenei italiani di partecipare o erogare dei corsi.
Ogni studente può creare il proprio corso, definendone il corso di studi e la materia.
Lo studente che crea il corso può inoltre definire il syllabus con gli argomenti trattati durante il corso, caricandone anche la videolezione.
Per ogni corso viene messa a disposizione una chat di gruppo, in cui studenti e tutor potranno interagire.
Se lo studente dovesse avere dubbi o lacune, potrà contattare tramite chat private il tutor del corso.

Il tutor del corso, qualora lo ritenesse necessario, ha la possibilità di avviare una videoconferenza con lo studente cha ha bisogno di aiuto.

Il progetto è stato realizzato utilizzando le seguenti tecnologie:

* <a href="https://angular.io/">Angular</a> - Frontend
* <a href="https://learn.microsoft.com/it-it/dotnet/core/introduction">.NET Core</a> - Backend
* <a href="https://learn.microsoft.com/it-it/ef/core/">EF Core</a> - Entity Framework
* <a href="https://learn.microsoft.com/it-it/aspnet/signalr/overview/getting-started/introduction-to-signalr">SignalR</a> - RealTime Communication
* <a href="https://webrtc.org/?hl=it">WebRTC</a> - Video Call
 <br>

### Prerequisiti
* DB relazionale (Sql Server, MySql, PostgreSQL ... )
* .NET Core SDK (.NET 6)
* NodeJs 16.10.0

### Avviare il progetto

Dopo aver clonato la repository, o aver scaricato i file di progetto, basterà eseguire i seguenti comandi per avviare LearnUniverse.

## Frontend
```shell
$ cd /frontend
$ npm i
$ npm run start
```

## Backend

Prima di eseguire i comandi, è importante aggiorare la connection string al database, presente nel file appsettings.json.
Il db verrà automaticamente creato con i comandi sottostanti

```shell
$ cd /backend
$ dotnet build
$ dotnet ef database update
$ dotnet run
```

