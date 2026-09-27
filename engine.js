(function (w) {
  const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const GOALS = { alltag: "Alltag & Bindung", rueckruf: "Rückruf", leine: "Leine", nase: "Nase & Wald", ruhe: "Ruhe" };
  const POOL = {
    alltag: [
      { t: "Name + Blick", d: "Sage den Namen einmal. Blick = Marker + Futter. 8 saubere Wiederholungen, dann Schluss." },
      { t: "Handtarget", d: "Offene Hand anbieten. Nase dran = Marker. 2 Minuten, nicht länger." },
      { t: "An der Seite ankommen", d: "Drei Schritte gehen, anhalten, Hund kommt in Position. Belohnen, neu ansetzen." }
    ],
    rueckruf: [
      { t: "Rückruf aus 5 Metern", d: "Schleppleine. Ein Signal. Kommt er, Party. Kommt er nicht: leise einholen, keine zweite Stimme." },
      { t: "Namen-Blitz", d: "Im Wald: Name, Blick, Futter am Körper. 6 Treffer, dann frei schnüffeln." },
      { t: "Abbruch-Signal vorbereiten", d: "Bei leichtem Interesse hier plus rennen. Nie gegen Wild oder Artgenossen testen." }
    ],
    leine: [
      { t: "Lockere Leine, 20 Meter", d: "Zug = Stopp. Entspannung = weiter. Kein Gezupfe." },
      { t: "Richtungswechsel", d: "Hund zieht, du drehst ruhig ab. Belohnen wenn er aufschließt." },
      { t: "Stehen bleiben am Weg", d: "An Kreuzungen 5 Sekunden stehen. Blick auf dich = Marker." }
    ],
    nase: [
      { t: "Futterspur 15 Meter", d: "Im Gras eine schnelle Spur legen. Hund sucht, du folgst stumm." },
      { t: "3 Verstecke", d: "Leckerli unter Laub, hinter Stock, unter Rinde. Ein Suchwort." },
      { t: "Wald-Inventur", d: "5 Minuten Schnüffeln ohne Aufgabe. Das ist Training, kein Leerlauf." }
    ],
    ruhe: [
      { t: "Decke 3 Minuten", d: "Decke ausrollen, kauen oder einfach liegen. Du sitzt dabei, kein Gerede." },
      { t: "Fenster-Training", d: "Reiz draußen, du bleibst. Hund darf gucken. Aufregung runter, dann Marker." },
      { t: "Abend-Reset", d: "10 Minuten Körperkontakt oder paralleles Liegen. Kein Spiel mehr." }
    ]
  };
  function seed(name) { let n = 0; for (let i = 0; i < (name || "").length; i++) n = (n + name.charCodeAt(i) * (i + 1)) % 997; return n; }
  function pick(list, salt) { return list[Math.abs(salt) % list.length]; }
  function weekIndex() { const now = new Date(); const start = new Date(now.getFullYear(), 0, 1); return Math.floor((now - start) / 86400000 / 7); }
  function planFor(dog) {
    const goals = dog.goals && dog.goals.length ? dog.goals : ["alltag", "nase"];
    const w = weekIndex(); const s = seed(dog.name || "hund");
    return DAYS.map((day, i) => { const g = goals[i % goals.length]; const item = pick(POOL[g] || POOL.alltag, s + w * 13 + i * 7); return { day, goal: GOALS[g] || g, title: item.t, text: item.d, key: g }; });
  }
  function today(dog) { const p = planFor(dog); return p[(new Date().getDay() + 6) % 7]; }
  function answer(q, dog) {
    const t = (q || "").toLowerCase(); const n = dog && dog.name ? dog.name : "dein Hund";
    if (/zieh|leine|zieht/.test(t)) return n + " folgt Zug, weil Zug bisher irgendwohingeführt hat. Heute: Zug = Welt bleibt stehen. Drei Straßen reichen.";
    if (/rückruf|kommt nicht|hier/.test(t)) return "Rückruf ist eine Wette. Schleppleine, Abstand klein, Belohnung größer als der Wald.";
    if (/bell|anbell/.test(t)) return "Bellen ist Information. Abstand vergrößern, dann belohnen wenn er guckt statt schreit.";
    if (/jagd|reh|hase|wild/.test(t)) return "Gegen den Jagdtrieb gewinnst du nicht mit Lautstärke. Nase umleiten, Schleppleine bis der Abbruch sitzt.";
    if (/welpe|beißen|spiel/.test(t)) return "Beissspiele enden, bevor es eskaliert. 20 Sekunden, Pause, wieder.";
    if (/angst|unsicher|knurr/.test(t)) return "Knurren ist höflich. Abstand schenken, nicht bestrafen. Sicherheit vor Gehorsam.";
    if (/langeweile|unterfordert|zerstör/.test(t)) return "Eine Nasenarbeit plus eine Ruheinsel schlägt drei Runden Frisbee.";
    if (/futter|belohn|klick/.test(t)) return "Marker muss in unter einer Sekunde sitzen. Futter danach, nicht gleichzeitig mit dem Signal.";
    return "Ich bin Moos, lokal, ohne Netz. Beschreib die Situation in einem Satz: was tut " + n + " genau?";
  }
  w.Engine = { DAYS, GOALS, planFor, today, answer, breedById(id) { return (w.BREEDS || []).find(b => b.id === id) || w.BREEDS[0]; } };
})(window);
