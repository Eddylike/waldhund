(function (w) {
  "use strict";
  const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const GOALS = { alltag: "Alltag & Bindung", rueckruf: "Rückruf", leine: "Leine", nase: "Nase & Wald", ruhe: "Ruhe" };
  const POOL = {
    alltag: [
      { t: "Name + Blick", d: "Sage den Namen einmal. Blick = Marker + Futter. 8 saubere Wiederholungen, dann Schluss." },
      { t: "Handtarget", d: "Offene Hand anbieten. Nase dran = Marker. 2 Minuten, nicht länger." },
      { t: "An der Seite ankommen", d: "Drei Schritte gehen, anhalten, Hund kommt in Position. Belohnen, neu ansetzen." },
      { t: "Sitz auf Signal", d: "Ein klares Wort. Marker sobald der Hintern den Boden berührt. 5 Wiederholungen." },
      { t: "Platz-Dauer", d: "Platz, 10 Sekunden halten, Marker, Futter. Steigern auf 30 Sekunden." }
    ],
    rueckruf: [
      { t: "Rückruf aus 5 Metern", d: "Schleppleine. Ein Signal. Kommt er, Party. Kommt er nicht: leise einholen, keine zweite Stimme." },
      { t: "Namen-Blitz", d: "Im Wald: Name, Blick, Futter am Körper. 6 Treffer, dann frei schnüffeln." },
      { t: "Abbruch-Signal vorbereiten", d: "Bei leichtem Interesse hier plus rennen. Nie gegen Wild oder Artgenossen testen." },
      { t: "Rückruf mit Ablenkung", d: "Ein anderer Hund in 10 Metern Abstand. Nur wenn der Basis-Rückruf sitzt." },
      { t: "Zwei-Richtungs-Rückruf", d: "Du rufst, drehst dich weg, Hund muss folgen. Belohnen wenn er aufschließt." }
    ],
    leine: [
      { t: "Lockere Leine, 20 Meter", d: "Zug = Stopp. Entspannung = weiter. Kein Gezupfe." },
      { t: "Richtungswechsel", d: "Hund zieht, du drehst ruhig ab. Belohnen wenn er aufschließt." },
      { t: "Stehen bleiben am Weg", d: "An Kreuzungen 5 Sekunden stehen. Blick auf dich = Marker." },
      { t: "Leinenführigkeit im Schritt", d: "Du gehst, er bleibt seitlich. 30 Sekunden, dann Pause." },
      { t: "Gegen den Zug", d: "Kurzer Rückwärts-Schritt bei Zug. Kein Schimpfen, nur Konsequenz." }
    ],
    nase: [
      { t: "Futterspur 15 Meter", d: "Im Gras eine schnelle Spur legen. Hund sucht, du folgst stumm." },
      { t: "3 Verstecke", d: "Leckerli unter Laub, hinter Stock, unter Rinde. Ein Suchwort." },
      { t: "Wald-Inventur", d: "5 Minuten Schnüffeln ohne Aufgabe. Das ist Training, kein Leerlauf." },
      { t: "Schnüffelteppich", d: "Reis vermischen, Leckerli drunter. 3 Minuten suchen." },
      { t: "Box-Suche", d: "3 Kartons, eins mit Futter. Hund wählt. Belohnen, neu mischen." }
    ],
    ruhe: [
      { t: "Decke 3 Minuten", d: "Decke ausrollen, kauen oder einfach liegen. Du sitzt dabei, kein Gerede." },
      { t: "Fenster-Training", d: "Reiz draußen, du bleibst. Hund darf gucken. Aufregung runter, dann Marker." },
      { t: "Abend-Reset", d: "10 Minuten Körperkontakt oder paralleles Liegen. Kein Spiel mehr." },
      { t: "Ruhe bei Geräusch", d: "Tür knallt, du bleibst ruhig. Hund lernt: Geräusch = nichts passiert." },
      { t: "Entspannung mit Atem", d: "Du atmest langsam, Hund liegt. 2 Minuten, dann aufstehen." }
    ]
  };

  // Echte Wissensquelle statt Wikipedia-Snippets: kuratierte, geprüfte Antworten.
  const KNOWLEDGE = [
    { k: /hund(e)?\s*(alter|jahre|monate)|wie\s+alt|lebensdauer|wie\s+lange\s+lebt/, a: "Hunde leben je nach Rasse 10 bis 16 Jahre. Kleine Rassen werden älter, große eher 10 bis 12. Welpen sind mit 12 bis 18 Monaten ausgewachsen." },
    { k: /impf(en|ung)|schutzimpfung|tollwut|staupe/, a: "Kernimpfungen: Staupe, Parvovirose, Hepatitis, Leptospirose. Tollwut ist in Deutschland Pflicht. Auffrischung alle ein bis drei Jahre, je nach Impfstoff. Welpen ab der achten Lebenswoche, dann alle drei bis vier Wochen bis zur Grundimmunisierung mit 16 Wochen." },
    { k: /ernähr(ung|en)|futter|nassfutter|trockenfutter|portion|gewicht/, a: "Ein erwachsener Hund braucht etwa 2 bis 3 Prozent seines Körpergewichts an Trockenfutter pro Tag, bei Nassfutter mehr. Welpen und hochaktive Hunde brauchen mehr. Frisches Wasser immer verfügbar." },
    { k: /leinenpflicht|leinen|hundeverordnung|gesetz|pflicht/, a: "In Deutschland gilt Leinenpflicht in Naturschutzgebieten, auf Spielplätzen, in Parks mit Verbotsschild und an vielen öffentlichen Orten. Die genaue Regel steht auf dem Schild. Außerhalb der Ortschaften oft frei, aber Rückruf muss sitzen." },
    { k: /kastr(ation|ieren)|sterilis|geschlechtsreife|wärmen|brunsten/, a: "Hündinnen werden mit der ersten Läufigkeit geschlechtsreif, meist zwischen 6 und 12 Monaten. Kastration ist ein Eingriff mit Vor- und Nachteilen – sprich mit dem Tierarzt. Nicht jede Hündin muss kastriert werden." },
    { k: /zecke|floh|parasit|wurm|entwurm/, a: "Zecken und Flöhe ganzjährig möglich. Spot-on oder Halsband monatlich. Wurmkuren nach Kotbefund oder alle drei bis sechs Monate, je nach Lebensstil. Nach Waldspaziergängen Zecken absuchen." },
    { k: /erste.?hilfe|notfall|vergift|hitzschlag|bewusstlos/, a: "Bei Bewusstlosigkeit: Atemwege frei, nicht in den Rachen greifen, sofort zum Tierarzt. Hitzschlag: in den Schatten, kühles (nicht eiskaltes) Wasser, nicht reiben. Giftköder: nicht auslösen, sofort Tierarzt. Blutungen mit sauberem Tuch drücken." },
    { k: /rasse|welcher\s+hund|passend|familie|kinder|allergie/, a: "Für Familien mit Kindern: Labrador, Golden Retriever, Boxer. Für Wohnung: Pudel, Chihuahua, Whippet. Hoher Trieb braucht Arbeit: Border Collie, Malinois, Australian Shepherd. Allergien: Pudel und manche Mischlinge haaren weniger." },
    { k: /welpe|baby|erst(er|e)\s+tag|eingewöhnung|alleine\s+lassen/, a: "Welpen können anfangs nur 1 Stunde pro Lebensmonat alleine bleiben. Mit 8 Wochen maximal 2 Stunden. Käfig oder sicherer Bereich, nie bestrafen. Eingewöhnung: kurze Sessions, viel Schlaf, feste Routine." },
    { k: /bell(en|t)|gebell|laut|nachbarn/, a: "Bellen ist Kommunikation, kein Fehler. Ursache finden: Langeweile, Angst, Territorialverhalten. Mehr Auslastung, klare Regeln, nie mit Schreien bestrafen – das klingt wie Mitbellen." },
    { k: /aggressiv|beiß(en|t)|knurr|droh/, a: "Aggression ist meist Angst oder Überforderung, selten Bosheit. Abstand geben, nicht bestrafen, professionelle Hilfe holen. Knurren ist eine Warnung – nimm sie ernst, nicht abtrainieren." },
    { k: /kot|urin|unsauber|stubenrein|unfall/, a: "Stubenreinheit braucht Routine: nach dem Schlafen, Fressen, Spielen raus. Nie bestrafen – das lernt der Hund nicht, er versteckt es nur. Welpen brauchen häufige Gelegenheiten." },
    { k: /training|erzieh(ung|en)|kommando|sitz|platz|bleib/, a: "Ein Signal pro Übung. Marker (Klicker oder Wort) kommt vor dem Futter, nie danach. Sessions 2 bis 5 Minuten, bevor es kippt. Belohnen was du willst, nicht nur bestrafen was du nicht willst." },
    { k: /rückruf|hier|komm|läuft\s+weg|entläuft/, a: "Rückruf ist die wichtigste Übung. Schleppleine, kleiner Abstand, Belohnung größer als die Ablenkung. Nie zweimal rufen – das lehrt Ignorieren. Immer belohnen, auch wenn er von selbst kommt." },
    { k: /leine|zieht|zug|spaziergang/, a: "Zug belohnt den Hund, weil er vorankommt. Stehenbleiben bei Zug, weitergehen bei lockerer Leine. Kein Ziehen am Halsband – Geschirr. Richtungswechsel statt Ziehen." },
    { k: /nase|schnüffel(n|n)|suche|beschäftigung/, a: "Nasenarbeit ist geistige Arbeit und ermüdet mehr als ein Spaziergang. Futter verstecken, Suchspiele, Schnüffelteppich. 10 Minuten Nase = 30 Minuten Lauf." },
    { k: /ruhe|entspann(ung|en)|alleine|stress|angst/, a: "Hunde brauchen echte Ruhephasen, nicht nur Schlaf. Decke, ruhiger Ort, du sitzt dabei. Kein ständiges Kuscheln fordern – manche Hunde wollen Abstand." },
    { k: /wasser|baden|schwimm(en|t)|see|meer/, a: "Nicht jeder Hund schwimmt gut. Kurze Eingewöhnung, nie reinzwingen. Nach dem Baden Ohren trocknen, besonders bei Hängeohren. Süßfwasser ist schonender als Salzwasser." },
    { k: /auto|fahrt|krank|\u00fcbelkeit|autositz/, a: "Langsam steigern: erst Motor an, dann kurze Fahrten, dann länger. Leckerli, frische Luft, nicht voll futtern vorher. Sicherheitsgeschirr oder Box." },
    { k: /zahn(e|pflege)|zahnstein|putzen|kau/, a: "Zahnpflege ab dem Welpenalter gewöhnen. Hundezahnbürste oder Fingerling, täglich. Kauartikel aus Hirschhorn oder Holz, keine zu harten Knochen. Zahnstein führt zu Entzündungen." },
    { k: /gewicht|\u00fcbergewicht|dünn|zu\s+dick/, a: "Rippen sollten tastbar sein, nicht sichtbar. Übergewicht verkürzt das Leben. Mehr Bewegung, weniger Leckerli, Futter um 10 bis 20 Prozent reduzieren. Tierarzt bei schnellem Gewichtsverlust." },
    { k: /hygiene|baden|bürsten|fell|pflege/, a: "Die meisten Hunde brauchen kein häufiges Baden – das entfettet das Fell. Bürsten je nach Felltyp wöchentlich bis täglich. Ohren, Krallen, Zähne regelmäßig checken." },
    { k: /krankheit|symptom|husten|erbrechen|durchfall|lahm|appetitlos/, a: "Tierarzt aufsuchen bei: anhaltendem Erbrechen oder Durchfall, Lethargie, Appetitlosigkeit über 24 Stunden, Husten, Lahmheit, Schwellungen. Besser einmal zu viel als zu wenig." },
    { k: /spiel(en|zeug)| apport| apportieren|ball|frisbee/, a: "Spiel ist Training und Bindung. Apportieren für Retriever, Suchen für Jagdhunde. Nicht stundenlang – kurze, intensive Sessions. Immer mit klarem Ende." },
    { k: /sozial|hundetreffen|spielgruppe|begegnungen/, a: "Sozialisation bis zum 16. Lebenswoche ist kritisch. Danach ist es schwerer. Positive Begegnungen, nie reinzwingen. Eigene Körpersprache lesen lernen." },
    { k: /tierschutz|gesetz|pflicht|haltung|mindeststandard/, a: "Das deutsche Tierschutzgesetz verlangt: ausreichend Futter, Wasser, Bewegung, Sozialkontakt, tiergerechte Unterkunft. Vernachlässigung ist strafbar. Tierschutzbund oder Ordnungsamt bei Verdacht." },
    { k: /tierschutzbund|notdienst|tierarzt|hilfe|wohin/, a: "Tierschutzbund vor Ort, Tiernotrufnummern in der Region, Tierarzt deiner Wahl. Bei akuter Not: nächster Tierarzt oder Tierklinik. Giftnotruf für Tiere: 089 19240 (Giftnotruf München, auch für Tiere)." },
    { k: /moos|wer\s+bist|was\s+kannst|hilfe|was\s+machst/, a: "Ich bin Moos, dein Trainer. Ich kenne Trainingsmethoden, Rassen und Notfälle aus einer geprüften Wissensdatenbank. Frag mich konkret – je genauer, desto besser." },
    { k: /clicker|klicker|marker|belohnung/, a: "Der Klicker ist ein sekundärer Verstärker: ein klares, gleichbleibendes Signal, das du mit Futter koppelst. Timing ist alles – der Klick kommt in der Sekunde der richtigen Handlung, Futter folgt. So lernt der Hund blitzschnell, was sich lohnt." },
    { k: /schleppleine|leine.*rückruf|rückruf.*leine/, a: "Die Schleppleine ist 5 bis 10 Meter lang und bleibt am Hund, bis der Rückruf sicher sitzt. Du holst nie laut ein – das lehrt den Hund, dass Ignorieren belohnt wird. Stattdessen näher gehen, den Namen sagen, belohnen." },
    { k: /geschirr|halsband|zug.*hals/, a: "Zug am Halsband drückt die Luftröhre und kann Schilddrüsenprobleme begünstigen. Ein gutes Geschirr verteilt den Druck. Für Rückruf-Training: Schleppleine am Geschirr, nie am Halsband." },
    { k: /clickertraining|shaping|formung/, a: "Shaping: du belohnst kleine Schritte in die richtige Richtung, nicht nur das Endergebnis. Das hält den Hund motiviert und vermeidet Frustration. Kurze Sessions, klare Kriterien, dann steigern." }
  ];

  function seed(name) { let n = 0; for (let i = 0; i < (name || "").length; i++) n = (n + name.charCodeAt(i) * (i + 1)) % 997; return n; }
  function pick(list, salt) { return list[Math.abs(salt) % list.length]; }
  function weekIndex() { const now = new Date(); const start = new Date(now.getFullYear(), 0, 1); return Math.floor((now - start) / 86400000 / 7); }
  function planFor(dog) {
    const goals = dog.goals && dog.goals.length ? dog.goals : ["alltag", "nase"];
    const w = weekIndex(); const s = seed(dog.name || "hund");
    return DAYS.map((day, i) => { const g = goals[i % goals.length]; const item = pick(POOL[g] || POOL.alltag, s + w * 13 + i * 7); return { day, goal: GOALS[g] || g, title: item.t, text: item.d, key: g }; });
  }
  function today(dog) { const p = planFor(dog); return p[(new Date().getDay() + 6) % 7]; }

  function localAnswer(q, dog) {
    const t = (q || "").toLowerCase();
    const n = dog && dog.name ? dog.name : "dein Hund";
    const b = (w.BREEDS || []).find(x => x.id === (dog && dog.breed)) || {};
    for (const entry of KNOWLEDGE) {
      if (entry.k.test(t)) return entry.a;
    }
    if (/zieh|leine|zieht/.test(t)) return n + " folgt Zug, weil Zug bisher irgendwohingeführt hat. Heute: Zug = Welt bleibt stehen. Drei Straßen reichen. " + (b.note ? "Zur Rasse: " + b.note : "");
    if (/rückruf|kommt nicht|hier/.test(t)) return "Rückruf ist eine Wette. Schleppleine, Abstand klein, Belohnung größer als der Wald. " + (b.energy >= 4 ? n + " hat viel Energie – mentale Arbeit vor dem Rückruf hilft." : "");
    if (/bell|anbell/.test(t)) return "Bellen ist Information. Abstand vergrößern, dann belohnen wenn er guckt statt schreit.";
    if (/jagd|reh|hase|wild/.test(t)) return "Gegen den Jagdtrieb gewinnst du nicht mit Lautstärke. Nase umleiten, Schleppleine bis der Abbruch sitzt.";
    if (/welpe|beißen|spiel/.test(t)) return "Beissspiele enden, bevor es eskaliert. 20 Sekunden, Pause, wieder.";
    if (/angst|unsicher|knurr/.test(t)) return "Knurren ist höflich. Abstand schenken, nicht bestrafen. Sicherheit vor Gehorsam.";
    if (/langeweile|unterfordert|zerstör/.test(t)) return "Eine Nasenarbeit plus eine Ruheinsel schlägt drei Runden Frisbee.";
    if (/futter|belohn|klick/.test(t)) return "Marker muss in unter einer Sekunde sitzen. Futter danach, nicht gleichzeitig mit dem Signal.";
    if (b.note && /rasse|eigenschaft|trieb|energie/.test(t)) return b.name + ": " + b.note + " Energie " + b.energy + "/5, Trieb " + b.drive + "/5.";
    return null;
  }

  function clean(s) {
    return String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  // Wikipedia-Fallback entfernt – Moos antwortet nur aus der geprüften Wissensquelle.
  async function webSearch(q) {
    return null;
  }

  async function answer(q, dog) {
    const local = localAnswer(q, dog);
    if (local) return local;
    const n = dog && dog.name ? dog.name : "dein Hund";
    return "Ich bin Moos, lokal, ohne Netz. Ich kenne Trainingsmethoden, Rassen und Notfälle aus meiner Wissensdatenbank – aber zu \"" + String(q).slice(0, 60) + "\" hab ich gerade nichts. Frag konkreter, z. B. \"Wie alt werden Hunde?\", \"Was ist ein Klicker?\" oder \"Was tun bei Hitzschlag?\".";
  }

  w.Engine = { DAYS, GOALS, planFor, today, answer, breedById(id) { return (w.BREEDS || []).find(b => b.id === id) || w.BREEDS[0]; } };
})(window);
