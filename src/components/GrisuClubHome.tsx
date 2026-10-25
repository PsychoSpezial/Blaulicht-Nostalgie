import React from 'react';
import {
  Flame,
  Shield,
  Heart,
  Calendar,
  MapPin,
  Award,
  Users,
  Wrench,
  Radio,
  BookOpen,
  ChevronRight,
  Anchor,
  Compass,
  Sparkles,
} from 'lucide-react';
import grisuVorstandImg from '../assets/images/grisu_vorstand_schlicktown_1792889995535.jpg';

interface GrisuClubHomeProps {
  onNavigateTab: (tab: 'map' | 'google_map' | 'garage' | 'models' | 'restoration' | 'forum' | 'gemini_chat') => void;
}

export const GrisuClubHome: React.FC<GrisuClubHomeProps> = ({ onNavigateTab }) => {
  const boardMembers = [
    {
      name: 'Hinnerk Jansen',
      role: '1. Vorsitzender & Wehrführer a.D.',
      nickname: '„Der Funkenmeister“',
      description: 'Seit 45 Jahren im Feuerwehrdienst. Kennt jede Schraube am Magirus-Rundhauber auswendig.',
    },
    {
      name: 'Frauke Behrens',
      role: '2. Vorsitzende & Veranstaltungsleitung',
      nickname: '„Die Nordsee-Lotsin“',
      description: 'Koordiniert die jährliche Schlicktowner Oldtimer-Sternfahrt und die europäischen Treffen.',
    },
    {
      name: 'Uwe Petersen',
      role: 'Technischer Wart & Zeugwart',
      nickname: '„Der Kolbenflüsterer“',
      description: 'Meister der luftgekühlten Deutz-V8-Diesel und Experte für historische Vorbaupumpen.',
    },
    {
      name: 'Grisu (Das Maskottchen)',
      role: 'Ehrenpräsident & Schirmherr',
      nickname: '„Ich will Feuerwehrmann werden!“',
      description: 'Der wohl berühmteste kleine Drache der Welt. Bringt Kinderaugen zum Leuchten und löscht jedes Feuer.',
    },
    {
      name: 'Neele Dirks',
      role: 'Schriftführerin & Archivarin',
      nickname: '„Hüterin der Chronik“',
      description: 'Pflegt historische Feuerwehr-Dienstbücher, Originalplakate und Baunachweise seit 1928.',
    },
    {
      name: 'Malte Eilers',
      role: 'Jugendwart & Öffentlichkeitsarbeit',
      nickname: '„Drachenbändiger“',
      description: 'Verbindet Technik-Nostalgie mit Nachwuchsförderung für die Jugendfeuerwehren an der Küste.',
    },
  ];

  const fleet = [
    {
      name: 'Magirus-Deutz Rundhauber 150 D 10 A',
      code: 'LF 16-TS · Baujahr 1964',
      badge: 'Vereinsflaggschiff',
      desc: 'Luftgekühlter Deutz V6-Dieselmotor F6L 714, Allradantrieb, Vorbaupumpe FP 16/8. 1982 vor der Verschrottung im Schlicktowner Hafen gerettet.',
    },
    {
      name: 'Mercedes-Benz Kurzhauber 1113',
      code: 'TLF 16/25 · Baujahr 1971',
      badge: '„Der Deichgraf“',
      desc: '2.500 Liter Wassertank, Schnellangriffshaspel und das unverkennbare sonore Brummen des OM 352 Motors.',
    },
    {
      name: 'Opel Blitz 1,75t',
      code: 'LF 8 · Baujahr 1958',
      badge: '„Schlickblitz“',
      desc: 'Klassischer Holz-Stahl-Aufbau von Ziegler, liebevoll restauriert bis auf die originalen Holzleitern.',
    },
  ];

  return (
    <div className="bg-[#090d16] text-slate-100 min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#131b2e] via-[#0b101d] to-[#090d16] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute top-0 right-10 opacity-10 pointer-events-none">
          <Anchor className="w-96 h-96 text-red-500" />
        </div>

        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-red-600/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>Verein Grisu e.V. Schlicktown</span>
            </span>
            <span className="bg-slate-800/80 border border-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Nordseeküste · Jadebusen</span>
            </span>
            <span className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gegr. 1982</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              „Ich will Feuerwehrmann werden!“
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
              Herzlich willkommen beim <strong className="text-white font-semibold">Feuerwehr-Oldtimer Verein Grisu e.V.</strong> aus
              Schlicktown an der Nordsee. Inspiriert vom mutigen kleinen Drachen, der lieber Feuer löschte als speite,
              bewahren wir mit Herzblut und ölverschmierten Händen das rollende Feuerwehr-Kulturgut Europas.
            </p>
          </div>

          {/* Quick CTA Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('gemini_chat')}
              className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-red-950/80 border border-red-400/40 flex items-center gap-2.5 transition-transform hover:scale-105"
            >
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Live-Sprechfunk mit Brandmeister Franz</span>
            </button>

            <button
              onClick={() => onNavigateTab('map')}
              className="px-5 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-4 h-4 text-red-400" />
              <span>Treffen &amp; Ausfahrten 2026</span>
            </button>

            <button
              onClick={() => onNavigateTab('models')}
              className="px-5 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Modell-Lexikon &amp; Vergleich</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Board Photo & Lifesized Mascot Showcase */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Der Vereinsvorstand &amp; Unser Ehrenmaskottchen</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Kameradschaft vor historischer Kulisse in Schlicktown
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Fototermin vor dem denkmalgeschützten Spritzenhaus von 1928 an der Hafenkante mit unserem lebensgroßen Grisu-Maskottchen.
            </p>
          </div>

          {/* High Resolution Image Container */}
          <div className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl group">
            <img
              src={grisuVorstandImg}
              alt="Vorstand des Verein Grisu e.V. Schlicktown mit lebensgroßem Grisu Maskottchen und Magirus-Deutz Oldtimer"
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="bg-red-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded shadow">
                  Offizielles Vorstandsportrait 2026
                </span>
                <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium drop-shadow">
                  Vorstand des Verein Grisu e.V. Schlicktown vereint mit Grisu und dem Vereins-Rundhauber Magirus-Deutz LF 16-TS.
                </p>
              </div>
              <div className="text-[11px] text-slate-300 font-mono bg-black/60 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm shrink-0">
                Altes Spritzenhaus Schlicktown · Jade
              </div>
            </div>
          </div>

          {/* Board Member Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {boardMembers.map((member, i) => (
              <div
                key={i}
                className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-400 font-bold">{member.role}</span>
                    <span className="text-[11px] font-mono text-slate-400">{member.nickname}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{member.name}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Die Geschichte des Vereins Grisu e.V. */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Narrative */}
          <div className="lg:col-span-8 bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Chronik &amp; Vereinsgeschichte</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Vom Traum eines kleinen Drachen zur Schlicktowner Legende
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Es war im Herbst <strong className="text-white">1982</strong>, als eine Handvoll pensionierter und aktiver Feuerwehrleute
                am Schlicktowner Hafenbecken zusammenkam. Dort stand er: ein ausgemusterter, vom Nordseewind gezeichneter{' '}
                <strong className="text-white">Magirus-Deutz Rundhauber aus dem Jahr 1964</strong>. Er sollte auf den Schrottplatz wandern.
                Doch die Kameraden brachten es nicht übers Herz, diese luftgekühlte Legende mit ihrem unverwechselbaren Deutz-Klang
                in die Presse wandern zu sehen.
              </p>

              <blockquote className="border-l-4 border-red-500 pl-4 py-2 italic text-slate-200 bg-slate-900/60 rounded-r-lg">
                „Wenn ein kleiner Zeichentrick-Drache namens Grisu der Welt beweisen kann, dass in seiner Brust kein Feuer, sondern
                das Herz eines echten Feuerwehrmanns schlägt – dann können wir auch dieses alte Schätzchen wieder zum Spritzen bringen!“
                <span className="block not-italic text-[11px] text-red-400 font-semibold mt-1">
                  – Ehrenvorsitzender Hinnerk Jansen bei der Gründungsversammlung 1982
                </span>
              </blockquote>

              <p>
                Gesagt, getan. Die Kameraden legten ihr Erspartes zusammen, kauften den Rundhauber für den symbolischen Schrottpreis
                und tauften den neu gegründeten Verein auf den Namen <strong className="text-white">Verein Grisu e.V.</strong>.
                Schlicktown – wie Wilhelmshaven und die umliegende Friesische Küste liebevoll im Volksmund genannt wird –
                hatte fortan ein neues Wahrzeichen.
              </p>

              <p>
                In unzähligen Wochenend- und Nachtschichten zerlegten sie die Kreiselpumpe FP 16/8, erneuerten Dichtungen, schliffen
                Roststellen ab und lackierten den Aufbau im feinsten RAL 3000 Feuerrot. Als der Motor zum ersten Mal wieder lautstark
                durch die Schlicktowner Straßen röhrte und das Martinshorn über den Deich schallte, war klar: Dieser Verein ist mehr als
                ein Hobby. Er ist ein Lebensgefühl.
              </p>

              <p>
                Heute zählt der Verein über 120 Mitglieder aus ganz Norddeutschland und Europa. Unser lebensgroßes Grisu-Maskottchen
                ist bei Festumzügen, Oldtimerrallyes und Kinderfeuerwehrtagen der absolute Star – denn Grisu erinnert uns jeden Tag daran,
                dass Hilfsbereitschaft, Mut und Begeisterung für die Technik keine Altersgrenzen kennen.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Shield className="w-4 h-4 text-red-400" />
                <span>Eingetragener Verein (e.V.) seit 1982</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Gemeinnützige Traditionspflege</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-red-400" />
                <span>Partner der Deutschen Feuerwehr-Historik</span>
              </div>
            </div>
          </div>

          {/* Sidebar Highlights & Quick Facts */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-red-400" />
                <span>Schlicktowner Vereinsfakten</span>
              </h3>

              <div className="divide-y divide-slate-800/80 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Heimathafen</span>
                  <span className="font-semibold text-slate-200">Schlicktown (Jadebusen)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Spritzenhaus</span>
                  <span className="font-semibold text-slate-200">Ehem. Wache 2 (Erbaut 1928)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Fahrzeuge im Fuhrpark</span>
                  <span className="font-semibold text-slate-200 font-mono">6 fahrbereite Klassiker</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Ältestes Baumuster</span>
                  <span className="font-semibold text-slate-200 font-mono">Opel Blitz (1958)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Schirmherr</span>
                  <span className="font-semibold text-emerald-400 font-bold">Grisu der Drache</span>
                </div>
              </div>
            </div>

            {/* Grisu Motto Callout */}
            <div className="bg-gradient-to-br from-red-950/60 to-slate-900 border border-red-800/50 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-base font-bold text-white">Werde Teil der Grisu-Familie!</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ob du selbst einen historischen Magirus besitzt, als Mechaniker mit anpacken willst oder unsere Ausfahrten unterstützen
                möchtest – bei uns ist jeder Schrauber und Fan herzlich willkommen!
              </p>
              <button
                onClick={() => onNavigateTab('forum')}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow transition-colors"
              >
                Im Vereinsforum mitdiskutieren
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Der Schlicktowner Fuhrpark */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-bold text-red-500 uppercase tracking-wider">Rollendes Kulturgut</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Die Schlicktowner Oldtimer-Flotte</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Jedes dieser Fahrzeuge wurde von den Vereinsmitgliedern in hunderten Stunden restauriert und besitzt ein H-Kennzeichen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fleet.map((veh, i) => (
            <div
              key={i}
              className="bg-[#0f172a] rounded-xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
            >
              <div>
                <span className="text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-800/40 px-2.5 py-0.5 rounded">
                  {veh.badge}
                </span>
                <h3 className="text-lg font-bold text-white mt-3">{veh.name}</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{veh.code}</div>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">{veh.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => onNavigateTab('models')}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center justify-between w-full group"
                >
                  <span>Technische Daten vergleichen</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
