const { DateTime } = require('luxon');


const isPremium = (membershipType) => {
    const premiumMemberships = ['premium1', 'premium3', 'premium6', 'premium12'];
    return premiumMemberships.includes(membershipType);
  };

// Lista dei giorni festivi fissi in Italia
const fixedHolidays = [
    { month: 1, day: 1 },   // Capodanno
    { month: 1, day: 6 },   // Epifania
    { month: 4, day: 25 },  // Festa della Liberazione <--- Questo deve essere presente
    { month: 5, day: 1 },   // Festa del Lavoro
    { month: 6, day: 2 },   // Festa della Repubblica
    { month: 8, day: 15 },  // Ferragosto
    { month: 11, day: 1 },  // Ognissanti
    { month: 12, day: 8 },  // Immacolata Concezione
    { month: 12, day: 25 }, // Natale
    { month: 12, day: 26 }  // Santo Stefano
  ];
  
  // Funzione per calcolare la data di Pasqua (algoritmo computus)
  function calculateEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
    const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
    return DateTime.local(year, easterMonth, easterDay);
  }
  
  // Funzione per ottenere tutti i giorni festivi di un anno
  function getHolidaysForYear(year) {
    const holidays = [];
  
    // Aggiungi i giorni festivi fissi
    fixedHolidays.forEach(({ month, day }) => {
      holidays.push(DateTime.local(year, month, day));
    });
  
    // Aggiungi Pasqua e Lunedì dell'Angelo
    const easter = calculateEaster(year);
    holidays.push(easter); // Pasqua
    holidays.push(easter.plus({ days: 1 })); // Lunedì dell'Angelo
  
    return holidays;
  }

  // Funzione per verificare se una data è festiva
  function isHoliday(date) {
    const dt = date instanceof DateTime ? date.startOf('day') : DateTime.fromJSDate(date).startOf('day');
    const year = dt.year;
    const holidays = getHolidaysForYear(year);
    return holidays.some(holiday => holiday.startOf('day').equals(dt));
  }

module.exports = { isPremium, isHoliday };