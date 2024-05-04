const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://albibalbi715:BalbiPanciFaddy22@unidomus.y18p9ks.mongodb.net/UniDomusTest"

const Utente = require("./schemaUtenti")
const Inserzione = require("./schemaInserzioni")
const Match = require("./schemaMatches")
const Token = require("./schemaTokens")

mongoose.connect(mongoURI)

run()

async function run() {

    try {
        // Crea un nuovo utente
        const nuovoUtente =await Utente.create({
            username: 'esempio',
            nome: 'Mario',
            cognome: 'Rossi',
            email: 'mario.rossi@example.com',
            password: 'Password123%',
            dataDiNascita: new Date('1990-01-01'),
            abitudini: ['sport', 'lettura'],
            interessi: ['musica', 'viaggi'],
            proPic: ['pic1.jpg', 'pic2.jpg'],
            statoAttivita: "attivo",
            inserzioniID: new mongoose.Types.ObjectId(), // ID di un'eventuale inserzione associata
            listaMatchID: [new mongoose.Types.ObjectId(),new mongoose.Types.ObjectId()] // Array di ID di match associati
        });

        await nuovoUtente.save()
        console.log(nuovoUtente)


        // Creazione di un nuovo oggetto Inserzione
        const nuovaInserzione = new Inserzione({
            indirizzo: {
                via: 'Via Roma',
                citta: 'Milano',
                cap: '32100',
                numCivico: '10H',
                provincia: 'MI',
                stato: 'Italia'
            },
            foto: ['foto1.jpg', 'foto2.jpg'],
            idInserzionista: new mongoose.Types.ObjectId(), // Assicurati di inserire un ObjectId valido dell'utente inserzionista
            tipologia: 'Appartamento',
            descrizione: 'Appartamento luminoso e spazioso nel cuore di Milano',
            prezzo: 400,
            metratura: 80,
            disponibilita: 'Disponibile'
        });

        // Salvataggio dell'inserzione nel database
        nuovaInserzione.save()
            .then(inserzioneSalvata => {
                console.log('Inserzione creata con successo:', inserzioneSalvata);
            })
            .catch(errore => {
                console.error('Errore durante la creazione dell\'inserzione:', errore);
            });

        // Creazione di un nuovo oggetto Match
        const nuovoMatch = new Match({
            idRichiedente: new mongoose.Types.ObjectId('6635178c83fcc9c656016016'), // Assicurati di inserire un ObjectId valido dell'utente richiedente
            idRicevente: new mongoose.Types.ObjectId('6635178cd6a801e0061e2a35'), // Assicurati di inserire un ObjectId valido dell'utente ricevente
            statoMatch: 'accettato',
            tipoMatch: 'match appartamento', // Tipo di match (es. match inquilino o match appartamento)
            messaggi: [{
                testo: 'Ciao, come stai?',
                idUtente: '6635178c83fcc9c656016016' // Assicurati di inserire un ObjectId valido dell'utente che ha inviato il messaggio
            },
            {
                testo: 'bene grazie',
                idUtente: '6635178c83fcc9c656016016' // Assicurati di inserire un ObjectId valido dell'utente che ha inviato il messaggio
            }
            ]
        });

        // Salvataggio del nuovo match nel database
        nuovoMatch.save()
            .then(matchSalvato => {
                console.log('Match creato con successo:', matchSalvato);
            })
            .catch(errore => {
                console.error('Errore durante la creazione del match:', errore);
            });

        // Creazione di un nuovo oggetto Token
        const nuovoToken = new Token({
            idUtente: new mongoose.Types.ObjectId('6635178c83fcc9c656016016'), // Assicurati di inserire un ObjectId valido dell'utente a cui appartiene il token
            token: '30caratterialfanumericicasuali', // Sostituisci 'token_generato' con il valore effettivo del token
        });

        // Salvataggio del nuovo token nel database
        nuovoToken.save()
            .then(tokenSalvato => {
                console.log('Token creato con successo:', tokenSalvato);
            })
            .catch(errore => {
                console.error('Errore durante la creazione del token:', errore);
            });

    } catch (e) {
        console.log(e.message)
    }
}
