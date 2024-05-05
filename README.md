# UniDomus
Progetto per Ingegneria del software UNITN

### Database constraints
- Users:
	- usermane: minLength 2 - maxLength 20 - required
	- name: minLength 2 - maxLength 30 - required
	- surname: minLength 2 - maxLength 30 - required
	- email: minLength 5 - maxLength 50 - deve contenere @ - required
	- password: minLength 8 - deve contenere una maiuscola, una minuscola ed un carattere speciale (@$!%*?&) - required
	- birthDate: deve essere una data passata
	- creationDate: default: data attuale
	- habits: maxLength 20
	- hobbies: maxLength 20
	- proPic: maxLength 5
	- activityStatus: enum validi ['attivo', 'attivo recentemente', 'inattivo'] - default: 'attivo'
	- active: default: 'attivo'

- Listings:
	- address:
		- street: minLength 3 - maxLength 50 - required
		- city: minLength 3 - maxLength 50 - required
		- cap: minLength 5 - maxLength 5 - deve contenere solo cifre - required
		- houseNum: minLength 1 - maxLength 5 - required
		- province: minLength 2 - maxLength 2 - required
		- country: minLength 3 - maxLength 50 - required
	- photos: maxLength 10
	- publisherID: required
	- tenantsID: maxLenght 12
	- typology: maxLength 30  - required
	- description: maxLength 1000
	- price: min 10 - max 10000
	- floorArea: min 1 - max 10000
	- publicationDate: default: data attuale - immutabile

- Matches: 
	- requesterID: required
	- receiverID: required
	- requestDate: default: data attuale - immutabile
	- matchStatus: enum validi ['in attesa', 'accettato', 'rifiutato'] - default: 'in attesa'
	- matchType: enum validi ['match inquilino', 'match appartamento'] - required
	messages:
		- text: required
		- date: default: data attuale
		- userID: required

- Tokens: 
	- userID: required
	- token: minLength 30 - minLength 30 - required
	- expirationDate: default: data attuale + 1 ora

**maxLentgh fa riferimento sia ad array che a stringhe

**max e min fanno riferimento a numeri
