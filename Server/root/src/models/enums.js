// models/enums.js
const sexEnum = {
    MALE: 'Maschio',
    FEMALE: 'Femmina',
    OTHER: 'Altro'
};

const activeEnum = {
    ACTIVE: 'attivo',
    INACTIVE: 'inattivo',
    RECENTLY_ACTIVE: 'recentemente Attivo'
};

const matchStatusEnum = {
    PENDING: 'in attesa',
    ACCEPTED: 'accettato',
    REJECTED: 'rifiutato'
};

const matchTypeEnum = {
    APARTMENT: 'appartamento',
    ROOMMATE: 'coinquilino'
};

const matchPriorityEnum = {
    LOW: 'basso',
    MEDIUM: 'medio',
    HIGH: 'alto'
};

const notificationTypeEnum = {
    MATCH: 'match',
    MESSAGE: 'messaggio',
    ALERT: 'alert',
    REMINDER: 'promemria'
};

const notificationStatusEnum = {
    SEEN: 'visto',
    NOT_SEEN: 'non visto',
};

const notificationPriorityEnum = {
    LOW: 'basso',
    MEDIUM: 'medio',
    HIGH: 'alto'
};

const reportTypeEnum = {
    USER: 'utente',
    LISTING: 'inserzione',
    MATCH: 'match',
    MESSAGE: 'messaggio'
};

const reportStatusEnum = {
    PENDING: 'in attesa',
    REVIEWED: 'revisionato',
    RESOLVED: 'risolto'
};

const hobbiesEnum = [
    'Lettura',
    'Corsa',
    'Cucina',
    'Fotografia',
    'Giochi',
    'Pittura',
    'Viaggiare',
    'Escursionismo',
    'Ciclismo',
    'Scrittura',
    'Canto',
    'Danza',
    'Pesca',
    'Nuoto',
    'Yoga',
    'Giardinaggio',
    'Guardare Film',
    'Suonare Strumenti Musicali',
    'Birdwatching',
    'Collezionare',
    'Fotografia Astronomica',
    'Astronomia Amatoriale',
    'Escursioni in Montagna',
    'Cucina Etnica',
    'Escursioni in Kayak',
    'Escursioni in Barca a Vela',
    'Scultura',
    'Lavorazione del Legno',
    'Giardinaggio Verticale',
    'Arrampicata Sportiva',
    'Camping',
    'Escursioni Naturalistiche',
    'Passeggiate Fotografiche',
    'Ceramica',
    'Programmazione',
    'Progettazione di Giochi',
    'Modellismo',
    'Caccia al Tesoro',
    'Progettazione di Giardini',
    'Modellismo Ferroviario',
    'Escursioni Botaniche',
    'Scoperta di Nuovi Ristoranti',
    'Videomaking',
    'Esplorazione Urbana',
    'Podcasting',
    'Letteratura Fantastica',
    'Letteratura Classica',
    'Cucina Vegana',
    'Scrittura Creativa',
    'Raccolta di Antiquariato',
    'Arte Digitale',
    'Escursioni di Fotografia Naturalistica'
];

const habitsEnum = [
    'Lettura',
    'Esercizio',
    'Meditazione',
    'Scrittura diario',
    'Svegliarsi presto',
    'Andare a letto presto',
    'Alimentazione sana',
    'Praticare gratitudine',
    'Imparare qualcosa di nuovo ogni giorno',
    'Pianificare la giornata in anticipo',
    'Prendere pause regolari',
    'Limitare il tempo davanti allo schermo',
    'Risparmiare denaro',
    'Volontariato',
    'Programmare esercizio regolare',
    'Mantenere uno spazio ordinato',
    'Evitare la procrastinazione',
    'Riflettere sulla giornata',
    'Socializzare',
    'Pratica dello Yoga',
    'Mangiare consapevolmente',
    'Seguire una routine mattutina',
    'Seguire una routine serale',
    'Lavorare su obiettivi personali',
    'Pratica della Mindfulness',
    'Seguire una dieta bilanciata',
    'Esprimere gratitudine quotidiana',
    'Coltivare relazioni positive',
    'Dedicare tempo alla lettura quotidiana',
    'Esplorare nuove attività ricreative',
    'Sviluppare abilità sociali',
    'Praticare la compassione',
    'Cercare di imparare dagli errori',
    'Dedicare tempo alla creatività',
    'Stabilire limiti sani',
    'Ridurre lo stress quotidiano',
    'Mantenere un diario di gratitudine',
    'Essere gentili con se stessi',
    'Sviluppare una mentalità positiva',
    'Stabilire obiettivi realistici',
    'Praticare la resilienza',
    'Coltivare un atteggiamento ottimista',
    'Sperimentare nuove attività fisiche',
    'Mantenere un elenco di cose da fare',
    'Dedicare tempo alla meditazione',
    'Praticare la moderazione',
    'Mantenere un bilancio finanziario',
    'Rendere la gentilezza una priorità',
    'Stabilire priorità giornaliere',
    'Mantenere uno spazio pulito e ordinato',
    'Coltivare un atteggiamento grato'
];

module.exports = {
    hobbiesEnum,
    habitsEnum,
    sexEnum,
    activeEnum,
    matchStatusEnum,
    matchTypeEnum,
    matchPriorityEnum,
    notificationTypeEnum,
    notificationStatusEnum,
    notificationPriorityEnum,
    reportTypeEnum,
    reportStatusEnum
};
