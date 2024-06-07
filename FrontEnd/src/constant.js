// constants.js


export const API_BASE_URL = "https://unidomus.onrender.com/api/";

export const notificationStatusEnum = {
    SEEN: 'visto',
    NOT_SEEN: 'non visto',
};
export const matchStatusEnum = {
    PENDING: 'in attesa',
    ACCEPTED : 'accettato',
    DECLINED : 'rifiutato',
};

export const matchPriorityEnum = {
    HIGH: 'alta',
    MEDIUM: 'media',
    LOW: 'bassa',
};

export const notificationPriorityEnum = {
    HIGH: 'alta',
    MEDIUM: 'media',
    LOW: 'bassa',
};

export const reportTypeEnum = {
    MESSAGE: 'messaggio',
    USER: 'utente',
    MATCH: 'match',
    LISTING: 'inserzione'
};
export const notificationTypeEnum = {
    MATCH: 'match',
    MESSAGE: 'messaggio',
    ALERT: 'alert',
    REMINDER: 'promemria'
};
export const matchTypeEnum = {
    APARTMENT: 'appartamento',
    ROOMMATE: 'coinquilino'
};


