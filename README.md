# UniDomus
Progetto per Ingegneria del software UNITN

### Database constraints
- User:
	- usermane: minLength 2 - maxLength 20 - required
	- nome: minLength 2 - maxLength 30 - required
	- cognome: minLength 2 - maxLength 30 - required
	- email: minLength 5 - maxLength 50 - deve contenere @ - required
	- password: minLength 8 - deve contenere una maiuscola, una minuscola ed un carattere speciale (@$!%*?&) - required
	- dataDiNascita: deve essere una data passata
	- dataCreazione: default: data attuale
	- abitudini: maxLength 20
	- interessi: maxLength 20
	- proPic: maxLength 5
	- statoAttivita: enum validi ['attivo', 'attivo recentemente', 'inattivo'] - default: 'attivo'
	- attivo: default: 'attivo'

- Inserzioni:
	- Indirizzo:
		- via: minLength 3 - maxLength 50 - required
		- citta: minLength 3 - maxLength 50 - required
		- cap: minLength 5 - maxLength 5 - deve contenere solo cifre - required
		- numCivico: minLength 1 - maxLength 5 - required
		- provincia: minLength 2 - maxLength 2 - required
		- stato: minLength 3 - maxLength 50 - required
	- foto: maxLength 10
	- idInserzionista: required
	- idInquilini: maxLenght 12
	- tipologia: maxLength 30  - required
	- descrizione: maxLength 1000
	- prezzo: min 10 - max 10000
	- metratura: min 1 - max 10000
	- dataPubblicazione: default: data attuale - immutabile

- Matches: 
	- idRichiedente: required
	- idRicevente: required
	- dataRichiesta: default: data attuale - immutabile
	- statoMatch: enum validi ['in attesa', 'accettato', 'rifiutato'] - default: 'in attesa'
	- tipoMatch: enum validi ['match inquilino', 'match appartamento'] - required
	messaggi:
		- testo: required
		- data: default: data attuale
		- idUtente: required

- Tokens: 
	- idUtente: required
	- token: minLength 30 - minLength 30 - required
	- dataScadenza: default: data attuale + 1 ora

**maxLentgh fa riferimento sia ad array che a stringhe
**max e min fanno riferimento a numeri
