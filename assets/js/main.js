/* ============================================================
   MOVANTIS — interactions, reveals, injected content
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- tiny inline icons ---------- */
  const ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    bolt:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
    up:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 7-7M14 8h6v6"/></svg>',
  };
  // replace placeholders left in the HTML
  $$(".list li").forEach((li) => { li.innerHTML = li.innerHTML.replace("{{c}}", ICON.check); });
  $$(".dev-feat").forEach((d) => { d.innerHTML = d.innerHTML.replace("{{b}}", ICON.bolt); });
  $$(".ic-up").forEach((u) => { u.innerHTML = ICON.up; });

  /* ---------- NAV: condense on scroll + progress bar ---------- */
  const nav = $("#nav"), progress = $("#progress");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile drawer ---------- */
  const drawer = $("#drawer");
  $("#burger").addEventListener("click", () => drawer.classList.add("open"));
  $("#drawerClose").addEventListener("click", () => drawer.classList.remove("open"));
  $$("#drawer a").forEach((a) => a.addEventListener("click", () => drawer.classList.remove("open")));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => { if (reduce) el.classList.add("in"); else io.observe(el); });

  /* ---------- count-up metrics ---------- */
  const counters = $$("[data-count]");
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      cio.unobserve(el);
      if (reduce) { el.textContent = target; return; }
      const dur = 1400, t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => cio.observe(c));

  /* ---------- product pillar tabs ---------- */
  function activateProduct(key) {
    $$(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === key)));
    $$(".panel").forEach((p) => p.classList.remove("active"));
    const panel = $("#panel-" + key);
    if (panel) panel.classList.add("active");
  }
  $$(".tab").forEach((tab) => tab.addEventListener("click", () => activateProduct(tab.dataset.tab)));

  /* ---------- code language tabs + copy ---------- */
  $$("[data-code]").forEach((b) => {
    b.addEventListener("click", () => {
      $$("[data-code]").forEach((x) => x.setAttribute("aria-selected", "false"));
      b.setAttribute("aria-selected", "true");
      $$(".cb").forEach((c) => c.classList.remove("active"));
      $('.cb[data-cb="' + b.dataset.code + '"]').classList.add("active");
    });
  });
  $("#codeCopy").addEventListener("click", async (e) => {
    const active = $(".cb.active");
    try { await navigator.clipboard.writeText(active.innerText); e.target.textContent = "Copied!"; }
    catch { e.target.textContent = "Copy failed"; }
    setTimeout(() => (e.target.textContent = "Copy"), 1600);
  });

  /* ---------- magnetic buttons ---------- */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    $$("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (ev) => {
        const r = btn.getBoundingClientRect();
        const mx = ev.clientX - r.left - r.width / 2;
        const my = ev.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${mx * 0.18}px, ${my * 0.28}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
    });
  }

  /* ---------- use-case hover glow tracking ---------- */
  const trackGlow = (el) => el.addEventListener("mousemove", (ev) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
    el.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
  });

  /* ============================================================
     INJECTED CONTENT
     ============================================================ */

  /* ---- Verticals ---- */
  const VERTICALS = {
    banks: {
      name: "Banks & Financial Institutions",
      challenge: "Modernize legacy infrastructure and compete with fintech-native players — digitizing cross-border flows and expanding corridors without regulatory friction, while improving capital efficiency.",
      enables: ["Expand remittance corridors", "Launch digital remittance channels", "Offer real-time payouts", "Monetize FX", "Embed financial services"],
      advantage: "Digital transformation without rebuilding core systems — competitive parity with fintechs, infrastructure depth without the operational burden.",
    },
    mtos: {
      name: "Remittance Providers & MTOs",
      challenge: "Rising competition, margin compression and regulatory pressure, with liquidity fragmentation and operational inefficiencies across corridors.",
      enables: ["Expand new corridors", "Launch digital wallet integration", "Improve payout speed", "Deliver real-time remittance experiences"],
      advantage: "Evolve from traditional operators into digital financial ecosystems.",
    },
    fintechs: {
      name: "Fintechs & Neobanks",
      challenge: "Scale quickly across markets, navigate regulation, reduce time-to-market and compete with global players.",
      enables: ["Launch multi-country operations", "Embed cross-border payments", "Monetize FX", "Offer wallets & issuing", "Increase volume per user"],
      advantage: "Scale regionally without building banking infrastructure from scratch.",
    },
    marketplaces: {
      name: "Marketplaces & Digital Platforms",
      challenge: "Multi-party and split payments, real-time payouts, cross-border seller funding and compliance across countries.",
      enables: ["Monetize payment flows", "Increase seller onboarding & retention", "Expand geographies", "Launch embedded wallet experiences"],
      advantage: "Transform payments from a cost center into a revenue driver.",
    },
    enterprise: {
      name: "Enterprise & Cross-Border Commerce",
      challenge: "FX volatility, cross-border supplier payments, liquidity fragmentation, settlement delays and operational complexity.",
      enables: ["Expand trade flows", "Improve supplier relationships", "Optimize FX margins", "Accelerate settlement"],
      advantage: "Institutional-grade cross-border infrastructure without banking buildout.",
    },
    global: {
      name: "Global Platforms Expanding into LATAM",
      challenge: "Fragmented regulation, integrating local rails, FX & liquidity, compliance and time-to-market.",
      enables: ["Enter multiple countries through one integration", "Offer localized payouts", "Monetize regional flows", "Accelerate customer acquisition"],
      advantage: "Scale across LATAM with institutional confidence.",
    },
  };
  const vertCard = $("#vertCard");
  function renderVertical(key) {
    const v = VERTICALS[key];
    vertCard.innerHTML = `
      <div class="vert-card">
        <div>
          <h3 style="font-size:26px; margin:0 0 14px;">${v.name}</h3>
          <div class="blocklabel" style="margin-top:0;">Industry Challenge</div>
          <p style="color:var(--slate-300); font-size:14.5px; margin:0;">${v.challenge}</p>
          <div class="advantage">
            <span class="l">Strategic Advantage</span>
            <p>${v.advantage}</p>
          </div>
        </div>
        <div>
          <div class="blocklabel" style="margin-top:0;">How Movantis enables growth</div>
          <ul class="list">${v.enables.map((e) => `<li>${ICON.check}${e}</li>`).join("")}</ul>
        </div>
      </div>`;
  }
  const segButtons = $$(".seg [data-v]");
  function activateVertical(key) {
    segButtons.forEach((x) => x.setAttribute("aria-selected", String(x.dataset.v === key)));
    if (VERTICALS[key]) renderVertical(key);
  }
  segButtons.forEach((b) => b.addEventListener("click", () => activateVertical(b.dataset.v)));
  renderVertical("banks");

  /* ---------- nav dropdown links → jump + activate the right tab/vertical ---------- */
  $$(".dropdown a[data-tab]").forEach((a) => a.addEventListener("click", () => activateProduct(a.dataset.tab)));
  $$(".dropdown a[data-v]").forEach((a) => a.addEventListener("click", () => activateVertical(a.dataset.v)));

  /* ---- Use cases ---- */
  const USE_CASES = [
    { i: "globe", t: "Scale Cross-Border Remittances", l: "Reduce cost, expand corridors, improve settlement speed.", b: ["Lower cost per transaction", "New corridor coverage", "Faster settlement cycles"] },
    { i: "layers", t: "Launch Cross-Border Money Services at Scale", l: "Full-stack remittance infra, origination to distribution.", b: ["US origination", "Multi-country distribution", "End-to-end orchestration"] },
    { i: "wallet", t: "Embed Financial Services Into Your Platform", l: "Wallets, accounts and cards with one integration.", b: ["Embedded wallets", "Virtual accounts", "Card issuing"] },
    { i: "bank", t: "Launch or Modernize a Digital Bank", l: "Upgrade infrastructure, accelerate acquisition.", b: ["Neobank enablement", "Faster time-to-market", "Modular stack"] },
    { i: "trend", t: "Optimize Cross-Border B2B & Treasury Flows", l: "Improve FX efficiency and liquidity management.", b: ["FX optimization", "Liquidity efficiency", "Faster supplier payments"] },
    { i: "split", t: "Power Marketplace & Gig Payout Infrastructure", l: "Automate split payments and real-time disbursements.", b: ["Split payments", "Real-time payouts", "Seller funding"] },
    { i: "map", t: "Expand Payments Across Latin America", l: "Multiple markets through unified APIs and compliance.", b: ["One integration", "Local rails", "Built-in compliance"] },
  ];
  const UC_ICONS = {
    globe: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"/><path d="M2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12h2M3 9h18"/>',
    bank: '<path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M12 3 3 8h18L12 3Z"/>',
    trend: '<path d="M3 17l6-6 4 4 7-7M14 8h6v6"/>',
    split: '<path d="M6 3v6a3 3 0 0 0 3 3h9M18 8l4 4-4 4M6 9v12"/>',
    map: '<path d="m9 3 6 2 6-2v16l-6 2-6-2-6 2V5l6-2Z"/><path d="M9 3v16M15 5v16"/>',
  };
  const ucGrid = $(".uc-grid");
  ucGrid.innerHTML = USE_CASES.map((u, idx) => `
    <div class="card uc reveal" data-d="${idx % 3}">
      <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${UC_ICONS[u.i]}</svg></div>
      <h4>${u.t}</h4>
      <div class="line">${u.l}</div>
      <ul class="list">${u.b.map((x) => `<li>${ICON.check}${x}</li>`).join("")}</ul>
    </div>`).join("");
  $$(".uc").forEach((el) => { trackGlow(el); if (reduce) el.classList.add("in"); else io.observe(el); });

  /* ---- Coverage ---- */
  const FLAGS = {
    us: '<svg viewBox="0 0 30 21" preserveAspectRatio="none"><rect width="30" height="21" fill="#B22234"/><g fill="#fff"><rect y="1.6" width="30" height="1.6"/><rect y="4.8" width="30" height="1.6"/><rect y="8" width="30" height="1.6"/><rect y="11.2" width="30" height="1.6"/><rect y="14.4" width="30" height="1.6"/><rect y="17.6" width="30" height="1.6"/></g><rect width="13" height="11.3" fill="#3C3B6E"/><g fill="#fff"><circle cx="2.6" cy="2.4" r=".7"/><circle cx="6.5" cy="2.4" r=".7"/><circle cx="10.4" cy="2.4" r=".7"/><circle cx="4.5" cy="5" r=".7"/><circle cx="8.4" cy="5" r=".7"/><circle cx="2.6" cy="7.6" r=".7"/><circle cx="6.5" cy="7.6" r=".7"/><circle cx="10.4" cy="7.6" r=".7"/></g></svg>',
    mx: '<svg viewBox="0 0 30 21" preserveAspectRatio="none"><rect width="10" height="21" fill="#006847"/><rect x="10" width="10" height="21" fill="#fff"/><rect x="20" width="10" height="21" fill="#CE1126"/><circle cx="15" cy="10.5" r="2.4" fill="none" stroke="#9a6b3a" stroke-width=".9"/></svg>',
    br: '<svg viewBox="0 0 30 21" preserveAspectRatio="none"><rect width="30" height="21" fill="#009C3B"/><path d="M15 2.6 27.5 10.5 15 18.4 2.5 10.5Z" fill="#FFDF00"/><circle cx="15" cy="10.5" r="3.7" fill="#002776"/></svg>',
    co: '<svg viewBox="0 0 30 21" preserveAspectRatio="none"><rect width="30" height="21" fill="#FCD116"/><rect y="10.5" width="30" height="5.25" fill="#003893"/><rect y="15.75" width="30" height="5.25" fill="#CE1126"/></svg>',
    ca: '<svg viewBox="0 0 30 21" preserveAspectRatio="none"><rect width="30" height="21" fill="#16161F"/><g fill="#FF8534"><circle cx="9" cy="8" r="1.6"/><circle cx="14.5" cy="6.8" r="1.6"/><circle cx="20" cy="9" r="1.6"/><circle cx="12" cy="13.2" r="1.6"/><circle cx="18" cy="14" r="1.6"/></g></svg>',
    andean: '<svg viewBox="0 0 30 21" preserveAspectRatio="none"><rect width="30" height="21" fill="#16161F"/><path d="M3.5 16 11 6.5 15 11.5 19 5.5 26.5 16Z" fill="none" stroke="#FF8534" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    ww: '<svg viewBox="0 0 30 21" preserveAspectRatio="none"><rect width="30" height="21" fill="#16161F"/><g fill="none" stroke="#2DD4BF" stroke-width="1.2"><circle cx="15" cy="10.5" r="6.6"/><ellipse cx="15" cy="10.5" rx="2.7" ry="6.6"/><line x1="8.4" y1="10.5" x2="21.6" y2="10.5"/></g></svg>',
  };
  const COVERAGE = [
    { p: "United States", flag: "us", tags: ["Local Rails", "RTP", "Cross-Border", "Licensing", { s: "Stablecoin" }] },
    { p: "Mexico", flag: "mx", tags: ["SPEI / Local Rails", "Cross-Border", "Multi-Currency", { s: "Fiat & Stablecoin" }] },
    { p: "Brazil", flag: "br", tags: ["PIX / Local Rails", "Cross-Border", "Multi-Currency", "Licensing"] },
    { p: "Central America", flag: "ca", tags: ["Local Rails", "Cross-Border Corridors", "Multi-Currency"] },
    { p: "Colombia", flag: "co", tags: ["Local Rails", "Cross-Border", "Multi-Currency", { s: "Stablecoin" }] },
    { p: "Andean Region", flag: "andean", tags: ["Local Rails", "Cross-Border Corridors", "Multi-Currency"] },
    { p: "Worldwide (WW)", flag: "ww", tags: ["Cross-Border Corridors", "Multi-Currency", { s: "Stablecoin Settlement" }] },
  ];
  $(".cov-list").innerHTML = COVERAGE.map((c) => `
    <div class="cov-row">
      <div class="place"><span class="cov-flag">${FLAGS[c.flag]}</span>${c.p}</div>
      <div class="cov-tags">${c.tags.map((t) => typeof t === "string" ? `<span>${t}</span>` : `<span class="s">${t.s}</span>`).join("")}</div>
    </div>`).join("");

  /* ---- How it works flow ---- */
  const HOW = [
    { t: "Originate", d: "Initiate from the US or in-region.", ic: '<path d="M12 2v14M6 10l6 6 6-6"/><path d="M4 20h16"/>' },
    { t: "Route", d: "Switch picks the optimal rail.", ic: '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/>' },
    { t: "Comply", d: "AML / KYC / sanctions screening.", ic: '<path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/>' },
    { t: "Optimize", d: "FX & liquidity efficiency.", ic: '<path d="M3 17l6-6 4 4 7-7M14 8h6v6"/>' },
    { t: "Settle", d: "Hybrid: traditional + stablecoin.", ic: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>' },
    { t: "Reconcile", d: "Reconcile & report, unified.", ic: '<path d="M4 4h16v16H4z"/><path d="M9 9h6M9 13h6M9 17h3"/>' },
  ];
  const howFlow = $("#howFlow");
  howFlow.innerHTML = HOW.map((h, i) => `
    <div class="how-node" data-i="${i}">
      <span class="step-n">0${i + 1}</span>
      <div class="hn-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${h.ic}</svg></div>
      <h5>${h.t}</h5>
      <p>${h.d}</p>
    </div>`).join("");
  // animate active node cycling when in view
  const nodes = $$(".how-node");
  if (!reduce) {
    let cycle = null;
    const howIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !cycle) {
          let k = 0;
          const step = () => {
            nodes.forEach((n) => n.classList.remove("lit"));
            nodes[k % nodes.length].classList.add("lit");
            k++;
          };
          step();
          cycle = setInterval(step, 1100);
        } else if (!e.isIntersecting && cycle) {
          clearInterval(cycle); cycle = null;
          nodes.forEach((n) => n.classList.remove("lit"));
        }
      });
    }, { threshold: 0.4 });
    howIo.observe(howFlow);
  } else { nodes[0].classList.add("lit"); }

  /* ---- Problem before/after animated SVG diagrams ---- */
  const NS = "http://www.w3.org/2000/svg";
  function mk(tag, attrs) { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; }
  const rowY = (i) => 28 + i * 43.5; // 5 rows: 28 … 202 within a 230 viewBox

  // BEFORE — tangled many-to-many: chaotic curved links that flicker & flow both ways
  const tangle = $("#tangle");
  if (tangle) {
    const pairs = [[0,0],[0,2],[0,4],[1,1],[1,3],[2,0],[2,2],[2,4],[3,1],[3,3],[3,4],[4,0],[4,2],[4,4]];
    pairs.forEach((p, idx) => {
      const y1 = rowY(p[0]), y2 = rowY(p[1]);
      const cx1 = 105 + (idx % 4) * 18, cx2 = 195 - (idx % 3) * 18;
      const d = `M44 ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, 256 ${y2}`;
      const ln = mk("path", { d, fill: "none", "stroke-width": "1.5", "stroke-linecap": "round",
        stroke: idx % 3 === 0 ? "#FF6A00" : (idx % 3 === 1 ? "#E85D00" : "#FF8534"),
        "stroke-dasharray": "2 9", class: "tangle-line" + (idx % 2 ? " rev" : "") });
      ln.style.animationDelay = `${(idx % 5) * -0.4}s`;
      tangle.appendChild(ln);
    });
    for (let i = 0; i < 5; i++) {
      const a = mk("circle", { cx: 44, cy: rowY(i), r: 5, fill: "#FF8534", class: "tg-node" }); a.style.animationDelay = `${i * -0.3}s`; tangle.appendChild(a);
      const b = mk("circle", { cx: 256, cy: rowY(i), r: 5, fill: "#5C5F6B", class: "tg-node" }); b.style.animationDelay = `${i * -0.45}s`; tangle.appendChild(b);
    }
  }

  // AFTER — one integration: clean lines node → SWITCH → node with light pulses flowing through
  const resolved = $("#resolved");
  if (resolved) {
    const HX = 150, HY = 115;
    for (let i = 0; i < 5; i++) {
      const y = rowY(i);
      resolved.appendChild(mk("line", { x1: 44, y1: y, x2: HX, y2: HY, stroke: "rgba(255,106,0,.20)", "stroke-width": "1.4" }));
      const fi = mk("line", { x1: 44, y1: y, x2: HX, y2: HY, stroke: "#FF8534", "stroke-width": "2", "stroke-linecap": "round", "stroke-dasharray": "1.5 12", class: "flow-in" });
      fi.style.animationDelay = `${i * -0.5}s`; resolved.appendChild(fi);
    }
    for (let i = 0; i < 5; i++) {
      const y = rowY(i);
      resolved.appendChild(mk("line", { x1: HX, y1: HY, x2: 256, y2: y, stroke: "rgba(45,212,191,.20)", "stroke-width": "1.4" }));
      const fo = mk("line", { x1: HX, y1: HY, x2: 256, y2: y, stroke: "#2DD4BF", "stroke-width": "2", "stroke-linecap": "round", "stroke-dasharray": "1.5 12", class: "flow-out" });
      fo.style.animationDelay = `${i * -0.5 - 0.7}s`; resolved.appendChild(fo);
    }
    for (let i = 0; i < 5; i++) {
      resolved.appendChild(mk("circle", { cx: 44, cy: rowY(i), r: 5, fill: "#FF8534" }));
      resolved.appendChild(mk("circle", { cx: 256, cy: rowY(i), r: 5, fill: "#2DD4BF" }));
    }
    // pulsing SWITCH hub
    resolved.appendChild(mk("circle", { cx: HX, cy: HY, r: 24, fill: "none", stroke: "rgba(255,106,0,.5)", "stroke-width": "1.2", class: "hub-ring" }));
    resolved.appendChild(mk("circle", { cx: HX, cy: HY, r: 27, fill: "rgba(255,106,0,.12)", class: "hub-glow" }));
    resolved.appendChild(mk("circle", { cx: HX, cy: HY, r: 21, fill: "rgba(255,106,0,.16)", stroke: "#FF6A00", "stroke-width": "1.5" }));
    const t = mk("text", { x: HX, y: HY + 3.4, "text-anchor": "middle", fill: "#fff", "font-size": "9", "font-family": "Space Grotesk, sans-serif", "font-weight": "700", "letter-spacing": ".4" });
    t.textContent = "SWITCH";
    resolved.appendChild(t);
  }
})();
