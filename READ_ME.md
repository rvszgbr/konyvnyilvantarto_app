# 📚 Könyvnyilvántartó Webalkalmazás

## 📄 Projektleírás

Ez a webalkalmazás lehetővé teszi könyvek nyilvántartását, azok adatainak rögzítését, szerkesztését, törlését és keresését. További funkciók közé tartozik az értékelés, a kategória-választás és a borítóképek kezelése.

---

## 🔧 Technológiák

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express.js
- **Adatbázis**: SQLite
- **Fájlkezelés**: Multer (borítóképek feltöltése)

---

## 🔎 Fő Funkciók

- ✅ Könyv hozzáadása (cím, szerző, év, kategória, leírás, értékelés, borító)
- ✅ Könyvek listázása
- ✅ Könyv részletes megtekintése modal ablakban
- ✅ Könyv szerkesztése és mentése
- ✅ Könyv törlése
- ✅ Keresés cím vagy szerző szerint
- ✅ Szűrés kategória szerint
- ✅ Duplikált könyvek elutasítása
- ✅ Hibaüzenetek megjelenítése

---

## 📚 Adatbázis szerkezet (SQLite)

**books** tábla oszlopai:

| Oszlop      | Típus    | Leírás                      |
|-------------|----------|------------------------------|
| id          | INTEGER  | Egyedi azonosító             |
| title       | TEXT     | Könyv címe                  |
| author      | TEXT     | Szerző neve                 |
| year        | INTEGER  | Kiadási év                  |
| category    | TEXT     | Kategória megnevezése         |
| description | TEXT     | Leírás                      |
| rating      | INTEGER  | Értékelés (1-5) csillag     |
| cover       | TEXT     | Borítókép elérési útvonala     |

---

## 📁 Fájlstruktúra

```
projekt/
├── public/
│   ├── index.html      # Felhasználói felület
│   ├── style.css       # Megjelenés
│   └── script.js       # Interakciók
├── server.js           # Backend szerver
├── books.db            # SQLite adatbázis
└── package.json        # Node.js projektkonfiguráció
```

---

## 🚀 Használat

1. Futtassuk az alkalmazást a gyökérkönyvtárból az alábbi paranccsal:
   ```bash
   node server.js
   ```
2. Nyissuk meg a böngészőben:
   [http://localhost:3000](http://localhost:3000)
3. Használjuk a felületet: könyv hozzáadás, keresés, szerkesztés, törlés

---

## 🎨 Reszponzív design megvalósítása

Az alkalmazás mobilbarát kialakítást is tartalmaz. A `style.css` végén található `@media` szabályok biztosítják, hogy kis képernyőkön az űrlap, a lista és a modal ablak is jól jelenjen meg.

---

Készítette: Ajtai Alex, Rivasz Gábor