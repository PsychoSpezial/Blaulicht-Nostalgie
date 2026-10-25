export interface EventPhoto {
  id: string;
  url: string;
  caption: string;
  uploaderName: string;
  year: number;
  uploadedAt: string;
}

export interface FireEvent {
  id: string;
  title: string;
  dateStart: string; // YYYY-MM-DD
  dateEnd: string;   // YYYY-MM-DD
  locationCity: string;
  locationState: string; // e.g. Bayern, Baden-Württemberg, NRW, Alsace, Tirol
  country: string;       // Deutschland, Österreich, Schweiz, Frankreich
  address: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  expectedModels: string[]; // e.g. ["Magirus-Deutz Rundhauber", "Mercedes Kurzhauber LF 16"]
  organizer: string;
  contactEmail?: string;
  websiteUrl?: string;
  attendeeVehiclesCount: number;
  photos: EventPhoto[];
}

export interface FireMuseum {
  id: string;
  name: string;
  locationCity: string;
  locationState: string;
  country: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  openingHours: string;
  admissionFee: string;
  highlightExhibits: string[];
  websiteUrl: string;
  imageUrl?: string;
}

export interface RestorationMilestone {
  id: string;
  date: string;
  title: string;
  notes: string;
  costEuro?: number;
}

export interface VehicleProfile {
  id: string;
  ownerName: string;
  ownerCity: string;
  brand: string;
  model: string;
  fireCode: string; // LF 16, TLF 16, DL 30, TSF, etc.
  buildYear: number;
  vin: string; // Fahrgestellnummer
  formerStation: string;
  restorationStory: string;
  milestones: RestorationMilestone[];
  photos: string[];
  specs: {
    engine: string;
    powerHp: number;
    pumpModel: string;
    waterTankLiters?: number;
    crewSeats: number;
    weightTons: number;
  };
}

export interface FireModelDatabaseEntry {
  id: string;
  name: string;
  manufacturer: string;
  era: string; // e.g. "1951 - 1967"
  typeBadge: string; // e.g. "LF 16 / TLF 16"
  pumpCapacity: string; // e.g. "FP 16/8 (1600 l/min bei 8 bar)"
  chassisType: string; // e.g. "Allrad-Rundhauber"
  crew: string; // e.g. "1:8 (Gruppe)"
  description: string;
  keySpecs: { label: string; value: string }[];
  historicalSignificance: string;
  imageUrl: string;
  commonDerivatives: string[];
}

export interface RestorationGuide {
  id: string;
  title: string;
  category: 'Motor & Antrieb' | 'Pumpe & Löschtechnik' | 'Karosserie & Lack' | 'H-Kennzeichen & Recht' | 'Elektrik & Sondersignal';
  difficulty: 'Einsteiger' | 'Fortgeschritten' | 'Meister / Spezialist';
  summary: string;
  durationEst: string;
  steps: { title: string; content: string; tip?: string; warning?: string }[];
  partsTips: string[];
  author: string;
  likes: number;
  userLiked?: boolean;
}

export interface ForumPost {
  id: string;
  threadId: string;
  author: string;
  authorRole: 'Enthusiast' | 'Restaurator' | 'Feuerwehrhistoriker' | 'Moderator';
  avatarSeed: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  isReported: boolean;
  reportReason?: string;
  isHidden: boolean;
  isAuthorBanned: boolean;
}

export interface ForumThread {
  id: string;
  category: 'Technik & Motoren' | 'Restauration & Karosserie' | 'H-Kennzeichen & Zulassung' | 'Treffen & Sternfahrten' | 'Ersatzteilbörse';
  title: string;
  author: string;
  createdAt: string;
  isPinned?: boolean;
  posts: ForumPost[];
}

export interface ModerationReport {
  id: string;
  postId: string;
  threadId: string;
  threadTitle: string;
  reportedAuthor: string;
  reportedBy: string;
  reason: string;
  timestamp: string;
  status: 'offen' | 'geprüft' | 'gelöscht' | 'nutzer_gesperrt';
}

export interface CalendarPreOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  street: string;
  zipCity: string;
  country: string;
  quantity: number;
  totalPrice: number;
  personalDedication?: string;
  orderedAt: string;
  status: 'bestätigt' | 'in_bearbeitung';
}

