const produkt = {
    apfel: {preis: 30, abgabe: 9, menge: 1000},
    birne: {preis: 10, abgabe: 4, menge: 2000},
    mandarine: {preis: 20, abgabe: 13, menge: 5000},
}

// DB1

const dbApfel = produkt.apfel.preis - produkt.apfel.abgabe
const dbBirne = produkt.birne.preis - produkt.birne.abgabe
const dbMandarine = produkt.mandarine.preis - produkt.mandarine.abgabe

const DB1Apfel = dbApfel * produkt.apfel.menge
const DB1Birne = dbBirne * produkt.birne.menge
const DB1Mandarine = dbMandarine * produkt.mandarine.menge

const DBGesamt = DB1Apfel + DB1Birne + DB1Mandarine

const fixeKosten = (3*3000) + 15000 + 30000

// 30000 ist miete
// 15000 ist lohn
// 3000 ist lizenz

const periodenGewinn = DBGesamt - fixeKosten

console.log("Periodengewinn: ", periodenGewinn) // 20000 kommt hier als ergebnis raus

// die zahlen habe ich mir natürlich komplett ausgedacht haha

// DB2

// db1 von produkt apfel, birne, mandarine  - produktfixkosten also 3k
// ich schreibe das nur so hin weil keine funktion

// ok also jetzt die DB2

const fixKosten2 = 15000 + 30000

const lizenzKosten = 3000

const DB2Apfel = DB1Apfel - lizenzKosten
const DB2Birne = DB1Birne - lizenzKosten
const DB2Mandarine = DB1Mandarine - lizenzKosten

const DB2Gesamt = DB2Apfel + DB2Birne + DB2Mandarine

const PeriodenGewinn2 = DB2Gesamt - fixKosten2

console.log("Perdiodengewinn2", PeriodenGewinn2)