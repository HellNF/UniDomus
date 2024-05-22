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
    'Film',
    'Suonare',
    'Birdwatching',
    'Collezionare',
    'Fotografia',
    'Astronomia',
    'Escursioni',
    'Scultura',
    'Giardinaggio',
    'Arrampicata',
    'Camping',
    'Passeggiate',
    'Ceramica',
    'Programmazione',
    'Modellismo',
    'Giardinaggio',
    'Ristorazione',
    'Videomaking',
    'Podcasting',
    'Letteratura',
    'Scrittura',
    'Arte',
    'Moda',
    'Design',
    'Architettura'
];

const habitsEnum = [
    'Mattiniero',
    'Dormiglione',
    'Perfezionista',
    'Ordinato',
    'Vegano',
    'Creativo',
    'Leader',
    'Amichevole',
    'Introverso',
    'Solitario',
    'Nerd',
    'Minimalista',
    'Oratore',
    'Festaiolo',
    'Couco',
    'Salutista',
    'Ritardatario',
    'Puntuale',
    'Silenzioso',
    'Casinista',
    'Avventuriero',
    'Sommelier',
    'Fumatore',
    'Laborioso',
    'Manuale',
    'Sincero'
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
