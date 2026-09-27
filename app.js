(function () {
  "use strict";
  const KEY = "waldhund-v1";
  const $ = (s, r) => (r || document).querySelector(s);
  const state = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn("Speichern fehlgeschlagen", e); } }
  function show(id) {
    document.querySelectorAll(".panel").forEach(p => p.classList.toggle("on", p.id === "p-" + id));
    document.querySelectorAll("nav.dock button").forEach(b => b.classList.toggle("on", b.dataset.p === id));
  }
  function escape(s) {
    return String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function dog() { return state.dog || {}; }
  function renderOnboard() {
    const breeds = (window.BREEDS || []).map(b => `<option value="${b.id}">${b.name}</option>`).join("");
    document.querySelector("#onboard").innerHTML = `<div class="on-head"><img src="assets/hero.svg" alt="" /><div class="veil"></div><div class="txt"><div class="mark">Waldhund</div><h1>Wen nimmst du mit?</h1></div></div><div class="on-body"><div class="card"><label class="lab">Name</label><input id="o-name" maxlength="24" placeholder="z. B. Moos" /><label class="lab">Rasse</label><select id="o-breed">${breeds}</select><label class="lab">Alter</label><select id="o-age"><option value="welpe">Welpe (unter 1)</option><option value="jung">Junghund</option><option value="erwachsen" selected>Erwachsen</option><option value="senior">Senior</option></select><label class="lab">Woran wollt ihr arbeiten?</label><div class="chips" id="o-goals">${Object.entries(Engine.GOALS).map(([k, v]) => `<button type="button" class="chip" data-g="${k}">${v}</button>`).join("")}</div><p class="muted" style="margin:12px 0">Lokal im Browser. Kein Konto.</p><button class="btn full" id="o-go">Los</button></div></div>`;
    const chosen = new Set(["alltag"]);
    document.querySelector("#o-goals").addEventListener("click", e => {
      const b = e.target.closest("[data-g]"); if (!b) return;
      if (chosen.has(b.dataset.g)) chosen.delete(b.dataset.g); else chosen.add(b.dataset.g);
      document.querySelectorAll("#o-goals .chip").forEach(c => c.classList.toggle("on", chosen.has(c.dataset.g)));
    });
    document.querySelectorAll("#o-goals .chip").forEach(c => c.classList.toggle("on", chosen.has(c.dataset.g)));
    document.querySelector("#o-go").onclick = () => {
      const name = document.querySelector("#o-name").value.trim();
      if (!name) { document.querySelector("#o-name").focus(); return; }
      state.dog = { name, breed: document.querySelector("#o-breed").value, age: document.querySelector("#o-age").value, goals: [...chosen] };
      state.done = state.done || {}; state.log = state.log || []; state.chat = state.chat || [];
      save(); boot();
    };
  }
  function header() {
    const d = dog(); const b = Engine.breedById(d.breed);
    document.querySelector("#hero-name").textContent = d.name || "Dein Hund";
    document.querySelector("#hero-sub").textContent = [b.name, d.age].filter(Boolean).join(" · ");
  }
  function renderHeute() {
    const d = dog(); const t = Engine.today(d);
    const dayKey = t.day + "-" + (t.title || "");
    const done = !!(state.done && state.done[dayKey]);
    const b = Engine.breedById(d.breed);
    document.querySelector("#p-heute").innerHTML = `<div class="card"><span class="tag">${t.day} · ${t.goal}</span><h2>${escape(t.title)}</h2><p>${escape(t.text)}</p><label class="check-row"><input type="checkbox" id="done" ${done ? "checked" : ""}/> Heute erledigt</label></div><div class="card"><h3>Zu ${escape(b.name)}</h3><p>${escape(b.note)}</p><div class="bars"><div class="bar">Energie <i><b style="width:${b.energy * 20}%"></b></i> ${b.energy}</div><div class="bar">Trieb <i><b style="width:${b.drive * 20}%"></b></i> ${b.drive}</div></div></div>`;
    document.querySelector("#done").onchange = e => {
      state.done = state.done || {}; state.done[dayKey] = e.target.checked;
      if (e.target.checked) { state.log = state.log || []; state.log.unshift({ at: Date.now(), text: t.title }); }
      save();
    };
  }
  function renderPlan() {
    const plan = Engine.planFor(dog());
    document.querySelector("#p-plan").innerHTML = `<div class="card"><h2>Woche</h2><p class="muted">Ein Thema pro Tag. Nicht alles auf einmal.</p>${plan.map(p => `<div class="logitem"><strong>${p.day} · ${escape(p.goal)}</strong><p>${escape(p.title)} — ${escape(p.text)}</p></div>`).join("")}</div>`;
  }
  function renderGuide() {
    document.querySelector("#p-guide").innerHTML = `<div class="card"><h2>Methoden</h2><p><strong>Ein Signal.</strong> Wiederholen ist betteln.</p><p><strong>Marker zuerst.</strong> Dann Futter. Nicht umgekehrt.</p><p><strong>Ende bevor es kippt.</strong> Gute Sessions sind kurz.</p></div><div class="card"><h3>Wald</h3><p>Schleppleine bis der Rückruf eine sichere Wette ist. Wild ist kein Trainingshelfer.</p></div><div class="card"><h3>Leine</h3><p>Zug beantwortet die Umwelt nicht. Stehenbleiben ist die Antwort.</p></div>`;
  }
  function renderAgent() {
    const chat = state.chat || [];
    document.querySelector("#p-agent").innerHTML = `<div class="card"><div class="agent"><img src="assets/icon.svg" alt="Moos" /><div><h3>Moos</h3><p class="muted">Lokaler Trainer. Sucht bei Bedarf in Wikipedia.</p></div></div><div class="chatlog" id="clog">${chat.map(c => `<div class="bubble${c.me ? " me" : ""}">${escape(c.t)}</div>`).join("")}</div><label class="lab">Frage</label><textarea id="q" placeholder="Er zieht an der Leine, sobald es nach Wald riecht."></textarea><button class="btn full" id="ask" style="margin-top:10px">Fragen</button></div>`;
    const box = document.querySelector("#clog"); if (box) box.scrollTop = box.scrollHeight;
    const askBtn = document.querySelector("#ask");
    askBtn.onclick = async () => {
      const q = document.querySelector("#q").value.trim(); if (!q) return;
      state.chat = state.chat || [];
      state.chat.push({ me: true, t: q });
      state.chat.push({ me: false, t: "…" });
      if (state.chat.length > 40) state.chat = state.chat.slice(-40);
      save(); renderAgent();
      const typing = document.querySelector("#clog .bubble:last-child");
      try {
        const ans = await Engine.answer(q, dog());
        typing.textContent = ans;
      } catch (e) {
        typing.textContent = "Da hat was gehakt. Versuch's nochmal.";
      }
      save();
    };
    document.querySelector("#q").addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askBtn.click(); }
    });
  }
  function renderMehr() {
    const d = dog(); const log = state.log || [];
    document.querySelector("#p-mehr").innerHTML = `<div class="card"><div class="dogline"><img class="avatar" src="assets/icon.svg" alt="" /><div><h3>${escape(d.name)}</h3><p class="muted">${escape(Engine.breedById(d.breed).name)}</p></div></div><button class="btn ghost full" id="reset" style="margin-top:12px">Profil zurücksetzen</button></div><div class="card"><h3>Tagebuch</h3>${log.length ? log.slice(0, 12).map(x => `<div class="logitem">${new Date(x.at).toLocaleDateString("de-DE")} · ${escape(x.text)}</div>`).join("") : "<p class=\"muted\">Noch leer.</p>"}</div><div class="card"><p><a href="datenschutz.html">Datenschutz</a> · <a href="impressum.html">Impressum</a></p></div>`;
    document.querySelector("#reset").onclick = () => {
      if (!confirm("Lokal alles löschen?")) return;
      localStorage.removeItem(KEY); location.reload();
    };
  }
  function paint() { header(); renderHeute(); renderPlan(); renderGuide(); renderAgent(); renderMehr(); }
  function boot() {
    document.querySelector("#onboard").classList.add("hidden");
    document.querySelector("#app").classList.remove("hidden");
    paint(); show("heute");
  }
  document.querySelectorAll("nav.dock button").forEach(b => b.addEventListener("click", () => show(b.dataset.p)));
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!sessionStorage.getItem("wh-reloaded")) { sessionStorage.setItem("wh-reloaded", "1"); location.reload(); }
    });
  }
  setTimeout(() => {
    document.querySelector("#splash").classList.add("go");
    if (state.dog && state.dog.name) boot();
    else { document.querySelector("#onboard").classList.remove("hidden"); renderOnboard(); }
  }, 700);
})();
