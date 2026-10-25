import {
  FireEvent,
  FireMuseum,
  VehicleProfile,
  FireModelDatabaseEntry,
  RestorationGuide,
  ForumThread,
  ModerationReport,
} from '../types';

import magirusImg from '../assets/images/magirus_rundhauber_1792774359333.jpg';
import mercedesImg from '../assets/images/mercedes_kurzhauber_1792774371750.jpg';
import rallyImg from '../assets/images/feuerwehr_treffen_rally_1792774385236.jpg';
import werkstattImg from '../assets/images/restauration_werkstatt_1792774397969.jpg';

export const INITIAL_EVENTS: FireEvent[] = [
  {
    id: 'evt-1',
    title: '58. Internationale Historische Sternfahrt & Magirus-Treffen',
    dateStart: '2026-06-12',
    dateEnd: '2026-06-14',
    locationCity: 'Ulm',
    locationState: 'Baden-Württemberg',
    country: 'Deutschland',
    address: 'Münsterplatz & Donauwiese, 89073 Ulm',
    coordinates: [48.3984, 9.9916],
    description:
      'Europas renommiertes Traditions-Treffen zu Ehren der Ulmer Feuerwehr-Pioniere. Über 140 angemeldete Rundhauber, Eckhauber und Magirus-Drehleitern. Große Ausfahrt durch das Donautal mit Schauübung historischer Motorspritzen.',
    expectedModels: [
      'Magirus-Deutz Rundhauber',
      'Magirus-Deutz Eckhauber D-Serie',
      'Mercedes-Benz Kurzhauber LF 16',
      'Opel Blitz LF 8',
    ],
    organizer: 'Freundeskreis Historische Feuerwehrfahrzeuge Ulm e.V.',
    contactEmail: 'kontakt@feuerwehroldtimer-ulm.de',
    websiteUrl: 'https://feuerwehroldtimer-ulm.de',
    attendeeVehiclesCount: 145,
    photos: [
      {
        id: 'p-1',
        url: rallyImg,
        caption: 'Aufstellung vor dem Münsterplatz bei strahlendem Sonnenschein',
        uploaderName: 'FlorianUlm1963',
        year: 2025,
        uploadedAt: '2025-06-15',
      },
      {
        id: 'p-2',
        url: magirusImg,
        caption: 'Magirus-Deutz Mercur LF 16 in Bestzustand',
        uploaderName: 'Hannes_Deutz',
        year: 2025,
        uploadedAt: '2025-06-15',
      },
    ],
  },
  {
    id: 'evt-2',
    title: 'Fränkisches Feuerwehr-Oldtimerfestival & Jubiläumskorso',
    dateStart: '2026-07-04',
    dateEnd: '2026-07-05',
    locationCity: 'Rothenburg ob der Tauber',
    locationState: 'Bayern',
    country: 'Deutschland',
    address: 'Spitaltor & Schrannenplatz, 91541 Rothenburg',
    coordinates: [49.3768, 10.1788],
    description:
      'Historische Löschzüge im mittelalterlichen Ambiente. Große Gleichmäßigkeitsfahrt der Vorkriegs- und 50er-Jahre-Fahrzeuge, Oldtimer-Ersatzteilbörse und Fachvorträge zur Instandhaltung von Vorbaupumpen.',
    expectedModels: [
      'Mercedes-Benz Kurzhauber LF 16',
      'Borgward B 2000 A/O',
      'Magirus-Deutz Rundhauber',
      'Hanomag L 28',
    ],
    organizer: 'Feuerwehrhistorik Franken e.V.',
    contactEmail: 'info@franken-feuerwehroldtimer.de',
    attendeeVehiclesCount: 92,
    photos: [
      {
        id: 'p-3',
        url: mercedesImg,
        caption: 'Mercedes Kurzhauber LF 16 vor historischer Kulisse',
        uploaderName: 'FrankenFeuer',
        year: 2024,
        uploadedAt: '2024-07-08',
      },
    ],
  },
  {
    id: 'evt-3',
    title: 'Rheinland-Pfalz Klassiker-Tage & Blaulichtparade',
    dateStart: '2026-08-22',
    dateEnd: '2026-08-23',
    locationCity: 'Koblenz',
    locationState: 'Rheinland-Pfalz',
    country: 'Deutschland',
    address: 'Deutsches Eck & Festung Ehrenbreitstein',
    coordinates: [50.3644, 7.6061],
    description:
      'Treffen von über 80 historischen Feuerwehr- und Rettungsdienstfahrzeugen am Zusammenfluss von Rhein und Mosel. Mit Vorführung historischer Handdruckspritzen und mechanischer Drehleitern.',
    expectedModels: [
      'Mercedes-Benz Kurzhauber LF 16',
      'Magirus-Deutz Eckhauber D-Serie',
      'Ford FK 1000 / Transit Feuerwehr',
      'Opel Blitz LF 8',
    ],
    organizer: 'Oldtimerfreunde Rhein-Mosel',
    contactEmail: 'treffen@blaulicht-koblenz.de',
    attendeeVehiclesCount: 84,
    photos: [],
  },
  {
    id: 'evt-4',
    title: 'Norddeutsches Drehleiter- & Klassikertreffen',
    dateStart: '2026-05-30',
    dateEnd: '2026-05-31',
    locationCity: 'Bremen',
    locationState: 'Bremen',
    country: 'Deutschland',
    address: 'Überseestadt Speicher XI, 28217 Bremen',
    coordinates: [53.0975, 8.7758],
    description:
      'Sonderschau historischer Drehleitern von Metz und Magirus (DL 18, DL 22, DL 30). Ausstellung von Industrie- und Hafenlöschfahrzeugen der 1950er bis 1980er Jahre.',
    expectedModels: [
      'Magirus-Deutz Eckhauber D-Serie',
      'Mercedes-Benz Kurzhauber LF 16',
      'Klöckner-Humboldt-Deutz S 3000',
    ],
    organizer: 'Freundeskreis Bremer Feuerwehrgeschichte e.V.',
    contactEmail: 'orga@bremer-feuerwehrhistorie.de',
    attendeeVehiclesCount: 65,
    photos: [],
  },
  {
    id: 'evt-5',
    title: 'Alpen-Sternfahrt historische Feuerwehrfahrzeuge',
    dateStart: '2026-09-18',
    dateEnd: '2026-09-20',
    locationCity: 'Salzburg',
    locationState: 'Salzburg',
    country: 'Österreich',
    address: 'Residenzplatz & Festungsgelände, 5020 Salzburg',
    coordinates: [47.7981, 13.0465],
    description:
      'Grenzüberschreitende Ausfahrt durch das Salzkammergut und Berchtesgadener Land. Steigungen bis 14% testen historische Diesel- und Ottomotoren. Fachsymposium zu Erhaltungsrichtlinien in der EU.',
    expectedModels: [
      'Steyr 680 g LF',
      'Magirus-Deutz Rundhauber',
      'Mercedes-Benz Kurzhauber LF 16',
      'Saurer 2DM Feuerwehr',
    ],
    organizer: 'Österreichischer Feuerwehr-Oldtimerverband & FF Salzburg',
    contactEmail: 'alpenfahrt@feuerwehroldtimer.at',
    websiteUrl: 'https://feuerwehroldtimer.at',
    attendeeVehiclesCount: 110,
    photos: [],
  },
  {
    id: 'evt-6',
    title: 'Rassemblement Européen Véhicules Anciens de Pompiers',
    dateStart: '2026-07-18',
    dateEnd: '2026-07-19',
    locationCity: 'Strasbourg',
    locationState: 'Elsass / Grand Est',
    country: 'Frankreich',
    address: 'Parc de l’Orangerie, 67000 Strasbourg',
    coordinates: [48.5839, 7.7455],
    description:
      'Deutsch-französisches Freundschaftstreffen historischer Löschfahrzeuge. Austausch von Restaurierungskniffen für Berliet, Renault, Magirus und Mercedes-Benz.',
    expectedModels: [
      'Magirus-Deutz Rundhauber',
      'Mercedes-Benz Kurzhauber LF 16',
      'Berliet GAK Pompiers',
      'Citroën Type H Premier Secours',
    ],
    organizer: 'Association Mémoire des Sapeurs-Pompiers d’Alsace',
    contactEmail: 'contact@pompiers-histoire-alsace.fr',
    attendeeVehiclesCount: 78,
    photos: [],
  },
  {
    id: 'evt-7',
    title: 'Industriekultur & Blaulicht – Zeche Zollern Treffen',
    dateStart: '2026-09-05',
    dateEnd: '2026-09-06',
    locationCity: 'Dortmund',
    locationState: 'Nordrhein-Westfalen',
    country: 'Deutschland',
    address: 'Grubenweg 5, 44388 Dortmund',
    coordinates: [51.5178, 7.3342],
    description:
      'Imposante Werkfeuerwehr-Klassiker und kommunale Löschfahrzeuge vor der Jugendstil-Kulisse der Zeche Zollern. Schwerpunkt: Großtanklöschfahrzeuge und Schaumlöschtechnik.',
    expectedModels: [
      'Mercedes-Benz Kurzhauber LF 16',
      'Magirus-Deutz Eckhauber D-Serie',
      'MAN Hauber 415 L1F',
      'Opel Blitz LF 8',
    ],
    organizer: 'Werkfeuerwehr-Historik Ruhr e.V.',
    contactEmail: 'zeche@ruhr-blaulicht.de',
    attendeeVehiclesCount: 105,
    photos: [],
  },
];

export const INITIAL_MUSEUMS: FireMuseum[] = [
  {
    id: 'mus-1',
    name: 'Deutsches Feuerwehr-Museum Fulda',
    locationCity: 'Fulda',
    locationState: 'Hessen',
    country: 'Deutschland',
    address: 'St.-Laurentius-Straße 3, 36041 Fulda',
    coordinates: [50.5512, 9.6834],
    description:
      'Das zentrale Nationalmuseum der deutschen Feuerwehrgeschichte auf über 4.500 m² Ausstellungsfläche. Von der ältesten Handdruckspritze der Welt (1624) bis hin zu fahrbereiten Magirus-Rundhaubern, Dampfspritzen und Flugfeldlöschfahrzeugen.',
    openingHours: 'Di - So: 10:00 - 17:00 Uhr (Mo geschlossen)',
    admissionFee: 'Erwachsene: 8,00 € · Ermäßigt: 5,00 €',
    highlightExhibits: [
      'Älteste Handdruckspritze der Welt (1624)',
      'Magirus Pferdedrehleiter von 1904',
      'Magirus-Deutz Saturn Flugfeldfahrzeug "Krokodil"',
      'Originale Dampfspritze Nacke 1908',
    ],
    websiteUrl: 'https://dfm-fulda.de',
    imageUrl: rallyImg,
  },
  {
    id: 'mus-2',
    name: 'Feuerwehrmuseum München (Feuerwehr-Informationszentrum)',
    locationCity: 'München',
    locationState: 'Bayern',
    country: 'Deutschland',
    address: 'An der Hauptfeuerwache 8, 80331 München',
    coordinates: [48.1328, 11.5684],
    description:
      'Untergebracht in der historischen Hauptfeuerwache 1. Zeigt die Entwicklung der ältesten Berufsfeuerwehr Bayerns mit prächtigen Vorkriegsfahrzeugen, historischen Uniformen und Alarmierungstechnik.',
    openingHours: 'Sa & So: 10:00 - 16:00 Uhr sowie n. V.',
    admissionFee: 'Eintritt frei (Spenden erwünscht)',
    highlightExhibits: [
      'Daimler Motorspritze von 1912',
      'Historische Drehleiter DL 26 auf Benz-Gaggenau',
      'Magirus Rundhauber TLF 16 im Originalzustand',
    ],
    websiteUrl: 'https://feuerwehr-muenchen.de/museum',
    imageUrl: magirusImg,
  },
  {
    id: 'mus-3',
    name: 'Feuerwehrmuseum Stuttgart',
    locationCity: 'Stuttgart',
    locationState: 'Baden-Württemberg',
    country: 'Deutschland',
    address: 'Münsterstraße 142, 70373 Stuttgart',
    coordinates: [48.8105, 9.2215],
    description:
      'Ausstellung in der denkmalgeschützten ehem. Papierfabrik. Beherbergt über 30 historische Großfahrzeuge, Metz-Mechanik und die Geschichte der Stuttgarter Berufsfeuerwehr.',
    openingHours: 'Sa: 10:00 - 16:00 Uhr, So: 11:00 - 17:00 Uhr',
    admissionFee: 'Erwachsene: 5,00 €',
    highlightExhibits: [
      'Metz Holz-Drehleiter DL 22 auf Mercedes LO 2750',
      'Borgward B 2000 Kübelwagen',
      'KHD S3000 Allrad-Löschfahrzeug',
    ],
    websiteUrl: 'https://feuerwehrmuseum-stuttgart.de',
    imageUrl: mercedesImg,
  },
  {
    id: 'mus-4',
    name: 'Feuerwehrmuseum Schleswig-Holstein',
    locationCity: 'Norderstedt',
    locationState: 'Schleswig-Holstein',
    country: 'Deutschland',
    address: 'Friedrichsgaber Weg 290, 22845 Norderstedt',
    coordinates: [53.7121, 9.9958],
    description:
      'Das größte Feuerwehrmuseum in Norddeutschland. Zeigt auf über 2.000 m² seltene Spritzen der nordischen Küstenwehren, Dampfspritzen und Magirus-Eckhauber.',
    openingHours: 'Mi - Sa: 15:00 - 18:00 Uhr, So: 11:00 - 18:00 Uhr',
    admissionFee: 'Erwachsene: 6,00 €',
    highlightExhibits: [
      'Bremer Dampfspritze "Weser"',
      'Opel Blitz LF 8 von 1958',
      'Magirus-Deutz Rundhauber DL 23',
    ],
    websiteUrl: 'https://feuerwehrmuseum-sh.de',
    imageUrl: werkstattImg,
  },
  {
    id: 'mus-5',
    name: 'Feuerwehrmuseum Wien',
    locationCity: 'Wien',
    locationState: 'Wien',
    country: 'Österreich',
    address: 'Am Hof 9, 1010 Wien',
    coordinates: [48.2114, 16.3689],
    description:
      'Im Herzen von Wien in der ältesten Wache der Berufsfeuerwehr Wien. Zeigt prachtvolle k.u.k. Kutschenspritzen, Austro-Daimler Löschfahrzeuge und Steyr-Klassiker.',
    openingHours: 'So & Feiertage: 09:00 - 12:00 Uhr',
    admissionFee: 'Erwachsene: 4,00 €',
    highlightExhibits: [
      'Austro-Daimler Benzin-Automobilspritze 1912',
      'Steyr 680 g Löschfahrzeug',
      'Historische Feuerwehr-Telegrafenzentrale',
    ],
    websiteUrl: 'https://feuerwehr.wien.at/museum',
  },
  {
    id: 'mus-6',
    name: 'Musée des Sapeurs-Pompiers d’Alsace',
    locationCity: 'Leimbach / Mulhouse',
    locationState: 'Elsass',
    country: 'Frankreich',
    address: '12 Rue de la Grand Rue, 68800 Leimbach',
    coordinates: [47.7891, 7.1022],
    description:
      'Deutsch-französisches Traditionsmuseum mit seltener Sammlung historischer Berliet-, Delahaye- und Laffly-Löschwagen sowie elsässischer Handdruckspritzen.',
    openingHours: 'Sa & So: 14:00 - 18:00 Uhr',
    admissionFee: 'Erwachsene: 5,50 €',
    highlightExhibits: [
      'Delahaye Type 84 Premier Secours (1922)',
      'Berliet GAK Pompiers avec échelle Riffaud',
      'Citroën Type H Pompiers d’Alsace',
    ],
    websiteUrl: 'https://musee-pompiers-alsace.fr',
  },
];

export const INITIAL_VEHICLE_PROFILES: VehicleProfile[] = [
  {
    id: 'veh-1',
    ownerName: 'Gerhard & Martin Weiss',
    ownerCity: 'Ulm',
    brand: 'Magirus-Deutz',
    model: 'Mercur 125 A (Rundhauber)',
    fireCode: 'LF 16 (Löschgruppenfahrzeug)',
    buildYear: 1963,
    vin: 'MD-1963-88421-U',
    formerStation: 'Freiwillige Feuerwehr Ulm, Löschzug 1 (Altlöschzug)',
    restorationStory:
      'Fahrzeug wurde 1991 nach 28 Jahren treuem Einsatzdienst stillgelegt und stand 14 Jahre trocken in einer Scheune. 2017 haben wir mit der Totalrestauration begonnen. Der luftgekühlte Deutz-V6-Dieselmotor F6L 714 wurde vollständig zerlegt, neue Kolbenringe und Ventilschaftdichtungen verbaut. Die FP 16/8 Magirus-Kreiselpumpe erhielt eine neue Bronzegleitringdichtung. Originalgetreue Lackierung in RAL 3000 Feuerrot mit Handlinierung.',
    milestones: [
      {
        id: 'm-1',
        date: '2017-04-10',
        title: 'Scheunenfund & Bergung',
        notes: 'Motor drehte noch von Hand. Rahmen oberflächlich korrodiert, aber keine Durchrostungen.',
        costEuro: 4500,
      },
      {
        id: 'm-2',
        date: '2019-08-20',
        title: 'Motor- & Getriebeüberholung',
        notes: 'Deutz F6L 714 komplett gereinigt, Einspritzdüsen auf 125 bar abgedrückt, Zylinderköpfe geplant.',
        costEuro: 6200,
      },
      {
        id: 'm-3',
        date: '2021-05-15',
        title: 'Löschkreiselpumpe & Wassertank',
        notes: 'Magirus FP 16/8 überholt, Entlüftungseinrichtung Gasstrahler neu eingedichtet.',
        costEuro: 2800,
      },
      {
        id: 'm-4',
        date: '2023-04-12',
        title: 'H-Kennzeichen Vollabnahme & TÜV',
        notes: 'Erteilung des Gutachtens nach § 23 StVZO ohne Mängel. Historisches Kennzeichen UL-MD 63H zugeteilt.',
        costEuro: 850,
      },
    ],
    photos: [magirusImg, werkstattImg],
    specs: {
      engine: 'Deutz F6L 714, luftgekühlter V6-Wirbelkammer-Diesel',
      powerHp: 125,
      pumpModel: 'Magirus FP 16/8 (1.600 l/min bei 8 bar)',
      waterTankLiters: 800,
      crewSeats: 9,
      weightTons: 7.49,
    },
  },
  {
    id: 'veh-2',
    ownerName: 'Klaus Ebersbach',
    ownerCity: 'Wiesbaden',
    brand: 'Mercedes-Benz',
    model: 'L 1113 B (Kurzhauber)',
    fireCode: 'LF 16-TS (Tragkraftspritzenfahrzeug)',
    buildYear: 1974,
    vin: 'MB-1974-328911-W',
    formerStation: 'Freiwillige Feuerwehr Wiesbaden-Biebrich',
    restorationStory:
      'Gekauft bei der VEBEG-Versteigerung. Das Fahrzeug war als Katastrophenschutzfahrzeug top gewartet, hatte aber Standschäden an der Bremsanlage und verharzte Dieselleitungen. Kabine wurde im Originalfarbton neu gespritzt. Das charakteristische Zweiklanghorn von Martin mit Kompressoranlage funktioniert wieder tadellos.',
    milestones: [
      {
        id: 'm-21',
        date: '2018-09-02',
        title: 'Bremsüberholung 2-Kreis-Druckluft',
        notes: 'Radbremszylinder und Hauptbremsventil ausgetauscht. Bremsbeläge neu vernietet.',
        costEuro: 2400,
      },
      {
        id: 'm-22',
        date: '2022-10-18',
        title: 'Lackaufbereitung & Originalbeklebung',
        notes: 'Wappen der Stadt Wiesbaden nach Schablone handgemalt.',
        costEuro: 1650,
      },
    ],
    photos: [mercedesImg],
    specs: {
      engine: 'Mercedes-Benz OM 352, wassergekühlter 6-Zylinder-Reihendiesel',
      powerHp: 130,
      pumpModel: 'Ziegler FP 16/8 & Tragkraftspritze TS 8/8 im Heck',
      waterTankLiters: 0,
      crewSeats: 9,
      weightTons: 7.49,
    },
  },
];

export const MODEL_DATABASE: FireModelDatabaseEntry[] = [
  {
    id: 'mod-1',
    name: 'Magirus-Deutz Rundhauber "Mercur / Sirius"',
    manufacturer: 'Klöckner-Humboldt-Deutz (Magirus-Deutz, Ulm)',
    era: '1951 - 1967',
    typeBadge: 'LF 16 / TLF 16 / DL 25',
    pumpCapacity: 'FP 16/8 (1.600 l/min bei 8 bar)',
    chassisType: 'Haubenfahrzeug (Rundhaube mit Ulmer Münster-Logo)',
    crew: '1:8 (Gruppe) bzw. 1:5 (Staffel)',
    description:
      'Der Magirus-Deutz Rundhauber gilt als die unangefochtene Ikone der westdeutschen Nachkriegs-Feuerwehren. Die markante bauchige Motorhaube mit dem integrierten Ulmer Münster im Kühlergrill beherbergt den legendären luftgekühlten Deutz-Dieselmotor, der auch bei extremer Kälte oder sommerlichem Dauerbetrieb im Löscheinsatz ohne Kühlwasser-Kollaps lief.',
    keySpecs: [
      { label: 'Motorvarianten', value: 'Deutz F4L 514 (85 PS) bis F6L 714 (125 PS)' },
      { label: 'Kühlung', value: 'Gebläse-Luftkühlung (kein Kühlerfrostschutz nötig)' },
      { label: 'Getriebe', value: 'ZF 5-Gang-Schaltgetriebe mit zuschaltbarem Allrad' },
      { label: 'Zulässiges Gesamtgewicht', value: '7.500 kg bis 9.000 kg' },
      { label: 'Höchstgeschwindigkeit', value: 'ca. 78 - 85 km/h' },
    ],
    historicalSignificance:
      'Prägte über vier Jahrzehnte das Bild der freiwilligen und Berufsfeuerwehren. Aufgrund der Unverwüstlichkeit der Deutz-Motoren wurden viele Fahrzeuge bis weit in die 1990er Jahre im aktiven Dienst gehalten.',
    imageUrl: magirusImg,
    commonDerivatives: ['LF 16 Löschgruppenfahrzeug', 'TLF 16 Tanklöschfahrzeug', 'DL 25 h Drehleiter hydraulisch', 'KW 15 Kranwagen'],
  },
  {
    id: 'mod-2',
    name: 'Mercedes-Benz Kurzhauber (L 1113 / L 322)',
    manufacturer: 'Daimler-Benz AG (Werk Mannheim / Wörth)',
    era: '1959 - 1995',
    typeBadge: 'LF 16 / TLF 16 / RW 2',
    pumpCapacity: 'FP 16/8 (1.600 l/min bei 8 bar)',
    chassisType: 'Kurzhauber (stumpfe Motorhaube vor der Frontscheibe)',
    crew: '1:8 (Gruppe) / 1:2 (Trupp)',
    description:
      'Als Antwort auf die neuen gesetzlichen Längenbeschränkungsvorschriften von Verkehrsminister Seebohm entwickelte Daimler-Benz die legendären Kurzhauber. Das Design verband die Wartungsfreundlichkeit eines Haubers mit der Kompaktheit eines Frontlenkers.',
    keySpecs: [
      { label: 'Motor', value: 'OM 352 / OM 314 6-Zylinder Direkteinspritzer (130 - 168 PS)' },
      { label: 'Hubraum', value: '5.675 cm³' },
      { label: 'Antrieb', value: 'Hinterradantrieb oder Allradantrieb (LA / LAK)' },
      { label: 'Aufbauten', value: 'Metz, Bachert, Ziegler, Schörling' },
    ],
    historicalSignificance:
      'Einer der meistgebauten Feuerwehr-Lkw weltweit. Exportiert in über 80 Länder, in Deutschland das Rückgrat des Katastrophenschutzes und der Bundeswehr-Feuerwehren.',
    imageUrl: mercedesImg,
    commonDerivatives: ['LF 16-TS KatS', 'TLF 16/25', 'RW 2 Rüstwagen', 'SW 2000 Schlauchwagen'],
  },
  {
    id: 'mod-3',
    name: 'Opel Blitz 1,75t / 2,5t LF 8',
    manufacturer: 'Adam Opel AG (Rüsselsheim)',
    era: '1952 - 1975',
    typeBadge: 'LF 8 (Löschgruppenfahrzeug)',
    pumpCapacity: 'Vorbaupumpe FP 8/8 (800 l/min)',
    chassisType: 'Schnellastwagen-Hauber',
    crew: '1:8 (Löschgruppe)',
    description:
      'Der "Blitz" war das Standardfahrzeug für kleine und mittlere Freiwillige Feuerwehren in ganz Deutschland. Sein seidenweich laufender 6-Zylinder-Reihen-Ottomotor aus dem Opel Kapitän sorgte für PKW-ähnliche Fahrdynamik und schnelle Ankunft an der Einsatzstelle.',
    keySpecs: [
      { label: 'Motor', value: 'Opel 2.5L / 2.6L 6-Zylinder Benzinmotor (58 - 70 PS)' },
      { label: 'Vergaser', value: 'Opel-Fallstromvergaser mit Choke' },
      { label: 'Vorbaupumpe', value: 'Ziegler oder Bachert FP 8/8 direkt an der Kurbelwelle angeflanscht' },
      { label: 'Zul. Gesamtgewicht', value: '3.800 kg' },
    ],
    historicalSignificance:
      'Machte unzählige Landgemeinden erstmals motorisiert einsatzfähig. Heute einer der beliebtesten und fahrbarsten Oldtimer der Feuerwehrszene.',
    imageUrl: rallyImg,
    commonDerivatives: ['LF 8-TS mit Tragkraftspritze', 'TSF Tragkraftspritzenfahrzeug'],
  },
  {
    id: 'mod-4',
    name: 'Magirus-Deutz Eckhauber D-Serie',
    manufacturer: 'Magirus-Deutz (KHD)',
    era: '1968 - 1982',
    typeBadge: 'TLF 24/50 / DL 30 / RW 2',
    pumpCapacity: 'FP 24/8 bis FP 32/8',
    chassisType: 'Kantiger Eckhauber der 3. Generation',
    crew: '1:2 Trupp oder 1:5 Staffel',
    description:
      'Geprägt durch die markante, geometrisch-kantige Motorhaube. Ausgestattet mit bulligen Deutz V8- und V10-Dieselmotoren waren diese Fahrzeuge vor allem als schwere Flughafen- und Industriefeuerwehren sowie Drehleitern im Einsatz.',
    keySpecs: [
      { label: 'Motor', value: 'Deutz F8L 413 / F10L 413 V-Diesel (170 - 256 PS)' },
      { label: 'Sonderausstattung', value: 'Dachwasserwerfer monitor, 5.000 l Wassertank' },
    ],
    historicalSignificance:
      'Letzte echte Magirus-Hauber-Generation vor der Eingliederung in Iveco. Beeindruckt durch den unverwechselbaren luftgekühlten V8-Klang.',
    imageUrl: werkstattImg,
    commonDerivatives: ['TLF 24/50 Großtanklöschfahrzeug', 'DL 30 h Drehleiter mit Korb', 'TroTLF 16'],
  },
];

export const RESTORATION_GUIDES: RestorationGuide[] = [
  {
    id: 'guide-1',
    title: 'Instandsetzung der Vorbau- & Heckkreiselpumpe FP 16/8',
    category: 'Pumpe & Löschtechnik',
    difficulty: 'Meister / Spezialist',
    summary:
      'Detaillierter Leitfaden zur Überholung mehrstufiger Feuerlösch-Kreiselpumpen: Dichtringe tauschen, Gasstrahler-Entlüfter instand setzen und Laufrad-Spaltmaß einstellen.',
    durationEst: '16-24 Arbeitsstunden',
    steps: [
      {
        title: '1. Demontage und Trockenlaufkontrolle',
        content:
          'Pumpe entleeren, Saug- und Druckstutzen abbauen. Prüfen Sie das Wellenspiel der Pumpenwelle mit einer Messuhr. Maximal zulässiges Radialspiel: 0,08 mm.',
        warning: 'Pumpe niemals ohne Wasservorlage unter Last trocken laufen lassen! Dichtpackungen verbrennen binnen Sekunden.',
      },
      {
        title: '2. Tausch der Gleitringdichtung / Packung',
        content:
          'Ältere Pumpen vor 1970 besitzen oft getränkte Teflongarn- oder Asbest-Ersatz-Gleitpackungen. Ersetzen Sie diese durch moderne graphitierte PTFE-Packungsbänder im 45°-Schnitt versetzt.',
        tip: 'Überwurfmutter beim Einlaufen nur handfest anziehen. Leichte Tropfenbildung (ca. 10 Tropfen/Minute) zur Schmierung ist bei Packungen gewollt.',
      },
      {
        title: '3. Gasstrahler- und Trokomat-Entlüftung',
        content:
          'Prüfen Sie die Abgasklappe und die Venturidüse. Rußablagerungen im Schieberventil führen zum Verlust des Unterdrucks. Reinigen mit Bremsenreiniger und Dichtflächen mit Kupferpaste montieren.',
      },
      {
        title: '4. Dichtheitsprüfung nach DIN EN 1028',
        content:
          'Pumpe auf 0,8 bar Unterdruck evakuieren. Druckanstieg darf maximal 0,1 bar in 60 Sekunden betragen.',
      },
    ],
    partsTips: [
      'Originale Wellendichtringe DIN 3760 bei Fa. Freudenberg Simrit erhältlich',
      'Ersatzdichtungen für Ziegler-Pumpen über Traditionsvereine oder Pumpen-Service Schornstein',
      'Gasstrahler-Membranen aus NBR-Gummi maßschneiden lassen',
    ],
    author: 'Oberbrandmeister a.D. Klaus Heinemann',
    likes: 42,
    userLiked: false,
  },
  {
    id: 'guide-2',
    title: 'Blaulicht, Martinshorn & Sondersignal auf Privatfahrzeugen mit H-Kennzeichen',
    category: 'H-Kennzeichen & Recht',
    difficulty: 'Einsteiger',
    summary:
      'Rechtssichere Nutzung historischer Rundumkennleuchten (RKL) und Folgetonhörner auf deutschen Straßen nach § 52 und § 55 StVZO.',
    durationEst: '2-4 Stunden Lektüre & Montage',
    steps: [
      {
        title: '1. Grundsatz der StVZO',
        content:
          'Nach § 52 Abs. 3 StVZO sind blaue Rundumkennleuchten nur für den behördlichen Einsatzdienst zulässig. Für private Oldtimerbesitzer gilt ein striktes Betriebsverbot auf öffentlichen Straßen!',
      },
      {
        title: '2. Zulässige Lösungen für das H-Kennzeichen',
        content:
          'Option A: Blaulichter dürfen montiert bleiben, wenn sie mit blickdichten Hüllen (Hauben mit Aufdruck "Außer Betrieb" oder Feuerwehr-Vereinslogo) abgedeckt sind.\nOption B: Funktionale Trennung durch versteckten Sicherungsschalter oder herausgenommene Glühbirnen.',
        tip: 'TÜV-Prüfer verlangen für das Gutachten nach § 23 StVZO meist den Nachweis, dass das Horn nicht versehentlich im Straßenverkehr betätigt werden kann.',
      },
      {
        title: '3. Ausnahmegenehmigung für Korsofahrten',
        content:
          'Bei genehmigten Festumzügen und Korsofahrten kann die örtliche Straßenverkehrsbehörde nach § 70 StVZO das temporäre Einschalten der Rundumleuchten gestatten.',
      },
    ],
    partsTips: [
      'Originale Hella KL 7 / KL 80 Lichthauben-Abdeckungen in Kunstleder',
      'Schalter mit mechanischer Schutzklappe (Missbrauchsschutz)',
    ],
    author: 'Rechtsanwalt & Oldtimersammler Dr. Tilman Vogt',
    likes: 89,
    userLiked: true,
  },
  {
    id: 'guide-3',
    title: 'Deutz-Diesel F6L 614/714: Ventilspiel & Einspritzdüsen einstellen',
    category: 'Motor & Antrieb',
    difficulty: 'Fortgeschritten',
    summary:
      'Schritt-für-Schritt Justierung der hängenden Ventile und Überprüfung des Zerstäubungsbildes der Bosch-Zapfendüsen.',
    durationEst: '6 Stunden',
    steps: [
      {
        title: '1. Kalter Motorzustand',
        content:
          'Die Einstellung MUSS bei vollständig abgekühltem Motor (< 30 °C) vorgenommen werden. Ventilspiel Einlass: 0,20 mm, Auslass: 0,25 mm.',
      },
      {
        title: '2. Zündfolge und Überschneidung',
        content:
          'Zündfolge beim Deutz V6: 1-4-2-5-3-6. Drehen Sie den Motor an der Kurbelwelle im Uhrzeigersinn, bis Zylinder 1 auf Überschneidung steht, dann Zylinder 6 einstellen.',
      },
    ],
    partsTips: [
      'Fühlerlehrensatz mit 0,05 mm Teilung',
      'Ventildeckeldichtungen aus Kork immer mit hitzefester Dichtmasse dünn bestreichen',
    ],
    author: 'Werkstattleiter Hannes Meier',
    likes: 56,
    userLiked: false,
  },
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'th-1',
    category: 'Technik & Motoren',
    title: 'Magirus Deutz F6L 714: Starker Ölaustritt am hinteren Kurbelwellensimmerring',
    author: 'Hannes_Deutz',
    createdAt: '2026-03-14',
    isPinned: true,
    posts: [
      {
        id: 'p-101',
        threadId: 'th-1',
        author: 'Hannes_Deutz',
        authorRole: 'Restaurator',
        avatarSeed: 'hannes',
        content:
          'Hallo Kameraden! Bei unserer Probefahrt mit dem TLF 16 (Baujahr 1964) tropft nach 20 km Fahrt warmes Motoröl zwischen Motorblock und Getriebeglocke heraus. Wir vermuten den hinteren Kurbelwellen-Dichtring (Burgmann-Packung oder Simmerring?). Hat jemand Erfahrung, ob das Getriebe zwingend raus muss oder ob man von unten über die Ölwanne drankommt?',
        createdAt: '2026-03-14 10:15',
        upvotes: 12,
        downvotes: 0,
        isHidden: false,
        isReported: false,
        isAuthorBanned: false,
      },
      {
        id: 'p-102',
        threadId: 'th-1',
        author: 'MagirusVeteran72',
        authorRole: 'Feuerwehrhistoriker',
        avatarSeed: 'veteran',
        content:
          'Grüß dich Hannes! Beim Deutz F6L 714 bis Motornummer 380000 war ab Werk noch ein geteilter Burgmann-Dichtring (Graphit-Asbestband) verbaut. Ab 1965 gab es eine Nachrüst-Laufbuchse für Radialwellendichtringe. Leider muss das Getriebe definitiv abgeflanscht und die Schwungscheibe demontiert werden. Wir haben das letztes Jahr beim LF 16 gemacht – nimm unbedingt den modernen Viton-Wellendichtring von Goetze, dann ist auf ewig Ruhe!',
        createdAt: '2026-03-14 11:42',
        upvotes: 24,
        downvotes: 1,
        isHidden: false,
        isReported: false,
        isAuthorBanned: false,
      },
      {
        id: 'p-103',
        threadId: 'th-1',
        author: 'SpamBot99',
        authorRole: 'Enthusiast',
        avatarSeed: 'spammer',
        content:
          'Billige Autoreifen und Kredite ohne Schufa jetzt auf superdeals-online.biz sichern!',
        createdAt: '2026-03-14 14:00',
        upvotes: 0,
        downvotes: 18,
        isHidden: true,
        isReported: true,
        reportReason: 'Unerwünschte Werbung / Spam-Verlinkung',
        isAuthorBanned: true,
      },
    ],
  },
  {
    id: 'th-2',
    category: 'H-Kennzeichen & Zulassung',
    title: 'TÜV verlangt Abbau der Heckhaspel für H-Kennzeichen? Wer hat Urteile/Richtlinien?',
    author: 'Klaus_LF16',
    createdAt: '2026-02-28',
    posts: [
      {
        id: 'p-201',
        threadId: 'th-2',
        author: 'Klaus_LF16',
        authorRole: 'Enthusiast',
        avatarSeed: 'klaus',
        content:
          'Unser Prüfingenieur behauptet, die angehängte Schlauchhaspel am Heck stelle eine gefährliche Fahrzeugverlängerung dar und dürfe im zivilen Oldtimer-Betrieb nicht mitgeführt werden. Im historischen Fahrzeugbrief von 1972 ist das Fahrzeug aber exakt mit "Löschgruppenfahrzeug mit fahrbarer Haspel" eingetragen. Wie handhabt ihr das?',
        createdAt: '2026-02-28 09:30',
        upvotes: 15,
        downvotes: 0,
        isHidden: false,
        isReported: false,
        isAuthorBanned: false,
      },
      {
        id: 'p-202',
        threadId: 'th-2',
        author: 'Dr_Vogt_Recht',
        authorRole: 'Moderator',
        avatarSeed: 'vogt',
        content:
          'Das ist eine bekannte Fehlinterpretation mancher Prüfer. Gemäß der Richtlinie für die Begutachtung von Oldtimern (VkBl. 2011 S. 257) gehört die verkehrsüblich arretierte Schlauchhaspel zum originalen Lieferumfang und zur Ausrüstung nach DIN 14530. Wichtig ist lediglich: Beleuchtung und Kennzeichen müssen an der Haspel wiederholt werden (Zusatzleuchtenträger) oder durch die Haspel nicht verdeckt werden. Ich schicke dir das BMVI-Rundschreiben per PN!',
        createdAt: '2026-02-28 10:45',
        upvotes: 38,
        downvotes: 0,
        isHidden: false,
        isReported: false,
        isAuthorBanned: false,
      },
    ],
  },
  {
    id: 'th-3',
    category: 'Ersatzteilbörse',
    title: 'Suche: Originales Martin-Kompressorhorn 2297 GM (24V) für Mercedes Kurzhauber',
    author: 'FlorianNord',
    createdAt: '2026-03-01',
    posts: [
      {
        id: 'p-301',
        threadId: 'th-3',
        author: 'FlorianNord',
        authorRole: 'Restaurator',
        avatarSeed: 'nord',
        content:
          'Moin moin, wir suchen für die Fertigstellung unseres 1971er Mercedes LF 16 eine funktionierende oder überholungsbedürftige Deutsche Signal-Instrumenten-Fabrik Max B. Martin Kompressoranlage in 24 Volt mit 4 Schallbechern. Freue mich über Angebote mit Preisvorstellung!',
        createdAt: '2026-03-01 16:20',
        upvotes: 8,
        downvotes: 0,
        isHidden: false,
        isReported: false,
        isAuthorBanned: false,
      },
    ],
  },
];

export const INITIAL_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    postId: 'p-103',
    threadId: 'th-1',
    threadTitle: 'Magirus Deutz F6L 714: Starker Ölaustritt am hinteren Kurbelwellensimmerring',
    reportedAuthor: 'SpamBot99',
    reportedBy: 'MagirusVeteran72',
    reason: 'Unerwünschte Werbung und Spam-Links zu unseriösen Webseiten.',
    timestamp: '2026-03-14 14:05',
    status: 'nutzer_gesperrt',
  },
];
