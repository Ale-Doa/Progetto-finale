# Sistema di Prenotazioni Palestra

## Descrizione
Questo progetto è un sistema web per la gestione delle prenotazioni in una palestra. Gli utenti possono registrarsi, accedere al sistema e prenotare slot orari per gli allenamenti. Gli amministratori hanno accesso a una dashboard dedicata per gestire gli utenti e i loro abbonamenti.

Il sistema include funzionalità avanzate come:
- Gestione degli abbonamenti (basic e premium).
- Calendario delle prenotazioni con limiti sui posti disponibili.
- Blocco automatico delle prenotazioni nei giorni festivi nazionali italiani e nei weekend.
- Cancellazione automatica delle prenotazioni quando un utente passa da premium a basic.

---

## Tecnologie Utilizzate
- **Backend:** Node.js con Express.
- **Database:** MongoDB (utilizzando Mongoose per la modellizzazione dei dati).
- **Frontend:** EJS come motore di template.
- **Sicurezza:** Password hashate con bcrypt, sessioni gestite con express-session e MongoStore.
- **Gestione delle Date:** Luxon per il calcolo preciso delle date e dei giorni festivi.

---

## Struttura del Progetto
La struttura del progetto segue il pattern MVC (Model-View-Controller):
```
Progetto Node-Gym/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── bookingsController.js
│   └── dashboardController.js
├── models/
│   ├── Bookings.js
│   └── User.js
├── public/
│   └──CSS
│       ├── calendar.css
│       ├── dashboard-admin.css
│       ├── dashboard-member.css
│       ├── home.css
│       ├── login.css
│       └── register.css
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   └── bookingsRoutes.js
├── views
│   ├── admin
│   │   └── dashboard.ejs
│   ├── auth
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── bookings
│   │   └── calendar.ejs
│   ├── dashboard.ejs 
│   └── home.ejs
├── app.js
├── package-lock.json
├── package.json
├── README.md
└── utils.js
```

---

## Installazione

### Prerequisiti
- Node.js (versione 14 o superiore)
- MongoDB (versione 4 o superiore)
- npm (incluso con Node.js)

### Passi per l'installazione

1. **Clona il Repository**
   Clona il repository del progetto sul tuo computer:
   ```
   git clone <URL_DEL_REPOSITORY>
   cd nome-della-cartella
   ```
2. **Installa le dipendenze**
    Installa tutte le dipendenze necessarie utilizzando npm:
    ```
    npm install
    ```
3. **Configura le variabili d'ambiente**
    Crea un file .env nella radice del progetto e aggiungi le seguenti variabili:
    ```
    SESSION_SECRET=your-secret-key
    MONGODB_URI=mongodb://localhost:27017/your-database-name
    PORT=3000
    ```
    `SESSION_SECRET`: Una chiave segreta per crittografare le sessioni.
    `MONGODB_URI`: L'URI di connessione al database MongoDB.
    `PORT`: La porta su cui il server deve essere avviato.
4. **Avvia il server**
    Avvia il server usando node:
    ```
    node app.js
    ```

---

## Funzionalità

**Utenti comuni**
- Registrazione: Nuovi utenti possono registrarsi fornendo nome, email e password.
- Login: Gli utenti possono accedere al sistema con le proprie credenziali.
- Dashboard Utente: Visualizza informazioni personali e il tipo di abbonamento.
    - Gli utenti premium possono visualizzare e gestire le proprie prenotazioni.
    - La data di scadenza dell'abbonamento premium viene mostrata automaticamente.
- Prenotazioni:
    - Gli utenti premium possono prenotare slot orari per gli allenamenti.
    - Le prenotazioni non sono consentite nei weekend o nei giorni festivi nazionali italiani.
    - Ogni slot ha un limite massimo di 15 posti disponibili.

**Amministratori**
- Dashboard Admin: Visualizza l'elenco di tutti gli utenti registrati, con informazioni come nome, email, tipo di abbonamento e data di scadenza (per gli abbonamenti premium).
- Gestione degli Abbonamenti: Gli admin possono cambiare il tipo di abbonamento di un utente.
Se un utente premium passa a basic, tutte le sue prenotazioni vengono cancellate automaticamente.
- Accesso Limitato: Solo gli utenti con ruolo admin possono accedere alla dashboard admin.

---

## Come Usare il Sistema

**Per gli utenti**
1. Apri il sito e vai alla home page (/).
2. Clicca su "Registrati" per creare un nuovo account o su "Accedi" per loggarti.
3. Dopo aver effettuato il login, vai alla dashboard:
    - Se hai un abbonamento premium, puoi gestire le tue prenotazioni tramite la sezione "Prenota un Allenamento".
    - Visualizza la data di scadenza del tuo abbonamento premium.

**Per gli amministratori**
1. Accedi con un account che ha il ruolo admin.
    - L'unico modo per dare a un account i permessi da amministratore è farlo direttamente dal database
2. Vai alla dashboard admin (/admin/dashboard) per visualizzare l'elenco degli utenti.
3. Usa il menu a tendina per cambiare il tipo di abbonamento di un utente.
    - Se un utente premium passa a basic, le sue prenotazioni verranno cancellate automaticamente.

--- 

## Licenza

Questo progetto è rilasciato sotto licenza MIT . Sono consentite copia, modifica e distribuzione del codice, purché venga mantenuto il riferimento alla licenza originale.