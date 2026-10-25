# FlorianKlassik – Europaweites Oldtimer-Feuerwehr Portal

Eine moderne, dunkle Webanwendung für Oldtimer-Feuerwehr-Enthusiasten und Traditionsfeuerwehren in Deutschland und Europa mit interaktiver Treffen-Karte, Fahrzeugdatenbank, Eigentümer-Profilen, Restaurations-Leitfäden und moderiertem Community-Forum.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Zusammenfassung der spezifizierten Kernanforderungen & Entscheidungen:**
> - **Erweiterte Kartensuche**: Filterung nach Datum (Monat/Jahr/Zeitraum), Stadt, Bundesland/Region (z. B. Bayern, NRW, Baden-Württemberg, Elsass, Tirol, etc.) und spezifischen vertretenen Fahrzeugmodellen (z. B. Magirus-Deutz Rundhauber, Mercedes LF 16 Kurzhauber, Opel Blitz).
> - **Fahrzeug-Eigentümerprofile ("Mein Oldtimer")**: Vollständige Profilerstellung für eigene Fahrzeuge mit Marke, Modell, Baujahr, Fahrgestellnummer (FIN/VIN), detaillierter Restaurationsgeschichte sowie Multi-Foto-Upload mit Vorschau und Galerie.
> - **Foren-Moderationssystem**: Up-/Downvoting für Qualitätsdiskussionen, Meldefunktion mit vordefinierten Gründen, Benutzer-Sperrfunktion (Temporär/Permanent) und ein integrierter Moderator-Prüfbereich.
> - **Oldtimer-Datenbank & Restaurations-Wiki**: Umfassendes technisches Nachschlagewerk (DIN-Normen, Pumpentypen wie FP 16/8, Besatzungen, Fahrgestell-Historie) plus Schritt-für-Schritt Restaurations-Tipps (Ersatzteilbeschaffung, Blaulicht-Rechtslage, H-Kennzeichen, Motorüberholung).
> - **Visuelles Design**: Tiefes Dark-Theme (Anthrazit `#0c1017` / `#161e2e`), Feuerwehr-Karminrot (`#dc2626` / `#b91c1c`), Chrom- und Goldmessing-Akzente sowie klare Typografie ohne überladene Badges.

---

## 1. Overview & Core Concept

FlorianKlassik bietet eine zentrale Heimat für historische Feuerwehrfahrzeuge, Traditionsvereine, Sammler und Restauratoren.

- **Was die Plattform bietet**:
  1. **Interaktive Treffen- & Ausfahrtenkarte**: Europaweite Übersicht von Oldtimertreffen, Jubiläen und Sternfahrten mit mehrdimensionaler Filterung nach Region, Datum und erwarteten Fahrzeugtypen.
  2. **Erinnerungsfoto-Galerie & Upload**: Teilnehmer können nach Treffen Fotos hochladen, taggen und in einer chronologischen Veranstaltungs-Galerie durchstöbern.
  3. **Fahrzeug-Eigentümer-Garage**: Enthusiasten registrieren ihre Schätze inklusive Fahrgestellnummer, Restaurations-Meilensteinen und Vorher-/Nachher-Bildern.
  4. **Modell-Datenbank (Lexikon)**: Historische Datenblätter zu Klassikern (Magirus Rundhauber, Mercedes Kurzhauber, Borgward B 2000, Hanomag, Klöckner-Humboldt-Deutz, Steyr, Tatra).
  5. **Restaurations-Leitfaden**: Praxisberichte zur Ersatzteilsuche (Bosch-Zündungen, Magirus-Zahnräder), Pumpenwartung, H-Kennzeichen-Gutachten und DIN-Historie.
  6. **Diskussionsforum mit Moderationssystem**: Strukturierte Fachbereiche mit Beitragserstellung, Qualitäts-Voting, Meldemodal und Moderations-Konsole zur Beitragsüberprüfung und Benutzersperrung.

- **Zielgruppe**: Feuerwehrhistoriker, Vereinsmitglieder, private Sammler, Restaurationswerkstätten und Technikbegeisterte.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Treffen entdecken & filtern**: Nutzer öffnet die interaktive Karte, filtert nach "Bayern", Monat "Juni 2026" und Modell "Magirus Rundhauber". Die Karte zentriert sich, zeigt Pin-Marker mit Teilnehmerzahlen an und öffnet per Klick das Detailfenster mit Routen, Zeitplan und Fotogalerie.
2. **Eigenes Fahrzeug anlegen**: Nutzer klickt auf "Fahrzeug hinzufügen", trägt Marke, Modell, Baujahr, Fahrgestellnummer ein, dokumentiert Restaurationsschritte und lädt mehrere Fotos hoch. Das Fahrzeug wird in der öffentlichen Galerie und im persönlichen Dashboard gelistet.
3. **Forum & Moderation**: Nutzer diskutieren über Motorrestauration oder Einspritzpumpen, vergeben Upvotes für hilfreiche Antworten. Unangemessene Beiträge können gemeldet werden. Im Moderationsmodus können Beiträge geprüft, gelöscht oder störende Nutzer gesperrt werden.

### Visual Identity & Theme
- **Farbpalette (60-30-10 Disziplin)**:
  - **60% Neutral Canvas**: Tiefes Feuerwehr-Nachtschwarz/Anthrazit (`#0b0f17`, `#111827`)
  - **30% Structural Surfaces**: Robuste Gerätehaus-Grautöne (`#1e293b`, `#1f2937`), subtile 1px-Trennlinien (`border-slate-800`), metallische Chrom-Akzente
  - **10% Brand Accent**: Signalfeuerrot (`#dc2626` / `#ef4444`) mit dezentem Blaulicht-Cyan (`#0284c7`) für Status- und Kartenmarker
- **Typografie**:
  - **Display / Brand**: *Plus Jakarta Sans* / *Outfit* – markant, präzise und modern
  - **Body**: *Plus Jakarta Sans* – hervorragende Lesbarkeit bei technischem Text
  - **Zahlen / FIN / Baujahre**: *tabular-nums* Monospace für Baujahre, Fahrgestellnummern und technische Spezifikationen
- **Komponenten**:
  - Unboxed Metadaten mit typografischen Trennern (`·` / `/`)
  - Saubere Top-Navigation nach dem 3-Zonen-Vertrag: Brand-Wordmark links, 5 Hauptlinks mittig, "Neues Treffen melden" CTA rechts
  - Hochwertige Detailkarten mit großzügigem Padding und responsivem Layout

---

## 3. Key Product Decisions & Trade-Offs

- **Entscheidung 1: Karten-Darstellung**:
  - *Gewählter Ansatz*: Interaktive, hochperformante Leaflet-basierte Karte mit Dark-Mode-Tiles (CartoDB Dark Matter / Stadia / OSM), individuellen SVG-Feuerwehr-Pins, Popups und synchroner Listenansicht mit erweiterter Mehrfachfilterung.
  - *Warum*: Ermöglicht reibungslose Navigation auf Desktop und Mobilgeräten ohne externe API-Key-Sperren, bei voller Interaktivität.
- **Entscheidung 2: Datenhaltung & Vorbefüllung**:
  - *Gewählter Ansatz*: Reaktives State-Management mit browser-seitiger `localStorage`-Persistenz, initial vorbefüllt mit realitätsgetreuen Treffen in Deutschland/Österreich/Schweiz/Frankreich, echten historischen Fahrzeugmodellen, bebilderten Restaurationsberichten und Forumsdiskussionen.
  - *Warum*: Sofortiges, vollwertiges Erlebnis ohne leere Bildschirme; neue Einträge (Profile, Fotos, Forenbeiträge, Meldungen) bleiben dauerhaft gespeichert.
- **Entscheidung 3: Forenmoderation & Qualitätsbewertung**:
  - *Gewählter Ansatz*: Vollständiges Reputations- und Moderationssystem mit Netto-Upvotes (`+` / `-`), Melde-Modal mit Kategorien (Spam, Beleidigung, Falschinformation, Urheberrecht), sichtbarem Moderator-Umschalter für autorisierte Einsicht, Freigabe/Löschung gemeldeter Beiträge und Benutzer-Sperrverwaltung.
  - *Warum*: Erfüllt exakt die vom Nutzer geforderten Qualitätssicherungs- und Moderationsmechanismen.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FlorianKlassik Platform                         │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation: Brand · Karte · Fahrzeuge · Restauration · Forum     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│  │ Interaktive Karte     │  │ Filter & Event-Suche                 │  │
│  │ - Leaflet Dark Canvas │  │ - Datum / Stadt / Bundesland         │  │
│  │ - Pins & Routen       │  │ - Erwartete Oldtimer-Modelle         │  │
│  │ - Treffen-Details     │  │ - Foto-Upload & Erinnerungsgalerie   │  │
│  └───────────────────────┘  └──────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│  │ Oldtimer-Datenbank    │  │ Mein Oldtimer (Eigentümer-Garage)    │  │
│  │ - Modell-Katalog      │  │ - Marke, Modell, Baujahr, FIN        │  │
│  │ - DIN & Pumpendaten   │  │ - Restaurationshistorie              │  │
│  │ - Baujahre & Hauben   │  │ - Multi-Foto Upload & Meilensteine   │  │
│  └───────────────────────┘  └──────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────┐  ┌──────────────────────────────────────┐  │
│  │ Restaurations-Tipps   │  │ Community-Forum & Moderation         │  │
│  │ - Guides & Vorher/Nach│  │ - Themen & Beitragsdiskussionen      │  │
│  │ - H-Kennzeichen FAQ   │  │ - Up-/Downvoting & Score             │  │
│  │ - Teile-Börse Tipps   │  │ - Meldesystem & Moderator-Panel      │  │
│  └───────────────────────┘  └──────────────────────────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Datenmodelle (TypeScript Entities)
1. **FireEvent**: ID, Name, Datum/Zeitraum, Ort, Bundesland, Land, Koordinaten (`[lat, lng]`), Beschreibung, erwartete Fahrzeugmodelle, Galerie-Erinnerungsfotos (URLs/Base64, Fotograf, Jahr), Kontakt/Veranstalter.
2. **VehicleProfile**: ID, Eigentümer, Name, Marke, Modell, Typ (LF 16, TLF 16, DL 30, TSF, etc.), Baujahr, Fahrgestellnummer (FIN), frühere Dienststelle, Restaurationsgeschichte (Meilensteine mit Datum & Notizen), Fotos-Array, technische Daten (Motor, PS, Pumpe).
3. **ModelDatabaseEntry**: ID, Modellname, Hersteller, Bauzeitraum, Aufbauhersteller (Metz, Magirus, Ziegler, Bachert), Pumpenleistung, Fahrgestelltyp, Besatzungsstärke, historische Bedeutung, Spezifikations-Tabelle.
4. **ForumThread & Post**: ID, ThreadID, Autor, Datum, Inhalt, Upvotes, Downvotes, gemeldet (`isReported`), Meldegrund, Status (`active` / `hidden`), Autor gesperrt (`isUserBanned`).
5. **ModerationReport**: ID, PostID, GemeldetVon, Grund, Zeitstempel, Status (`offen`, `geprüft`, `gelöscht`).
