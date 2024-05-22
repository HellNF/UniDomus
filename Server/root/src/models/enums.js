// models/enums.js
const sexEnum = {
    MALE: 'Maschio',
    FEMALE: 'Femmina',
    OTHER: 'Altro'
};

const activeEnum = {
    ACTIVE: 'Attivo',
    INACTIVE: 'Inattivo',
    RECENTLY_ACTIVE: 'Recentemente Attivo'
};

const matchStatusEnum = {
    PENDING: 'In attesa',
    ACCEPTED: 'Accettato',
    REJECTED: 'Rifiutato'
};

const matchTypeEnum = {
    APARTMENT: 'Appartamento',
    ROOMMATE: 'Coinquilino'
};

const matchPriorityEnum = {
    LOW: 'Basso',
    MEDIUM: 'Medio',
    HIGH: 'Alto'
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
    notificationPriorityEnum
};
