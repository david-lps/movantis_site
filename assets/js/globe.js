/* ============================================================
   MOVANTIS — interactive 3D globe (three.js via globe.gl)
   Americas-facing, animated US <-> LATAM corridor arcs.
   Degrades gracefully: reduced-motion / WebGL failure -> SVG.
   ============================================================ */
(function () {
  "use strict";
  const mount = document.getElementById("globe");
  const fallback = document.getElementById("globeFallback");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showFallback = () => {
    if (mount) mount.style.display = "none";
    if (fallback) fallback.style.display = "grid";
  };

  // WebGL support probe
  function webglOK() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }

  if (reduce || !webglOK() || typeof window.Globe !== "function") {
    showFallback();
    return;
  }

  const ORANGE = "#FF7F39", ORANGE_L = "#FF9A5E", CYAN = "#2DD4BF", CYAN_L = "#7af0e0";

  // Network nodes — multiple US gateways, deep LATAM distribution, worldwide reach
  const US = [
    { name: "New York", lat: 40.71, lng: -74.01 }, { name: "Miami", lat: 25.76, lng: -80.19 },
    { name: "Houston", lat: 29.76, lng: -95.37 }, { name: "Los Angeles", lat: 34.05, lng: -118.24 },
    { name: "Chicago", lat: 41.88, lng: -87.63 },
  ];
  const LATAM = [
    { name: "Mexico City", lat: 19.43, lng: -99.13 }, { name: "Guadalajara", lat: 20.67, lng: -103.35 },
    { name: "Bogotá", lat: 4.71, lng: -74.07 }, { name: "São Paulo", lat: -23.55, lng: -46.63 },
    { name: "Rio de Janeiro", lat: -22.91, lng: -43.17 }, { name: "Lima", lat: -12.05, lng: -77.04 },
    { name: "Buenos Aires", lat: -34.60, lng: -58.38 }, { name: "Santiago", lat: -33.45, lng: -70.66 },
    { name: "Guatemala City", lat: 14.63, lng: -90.51 }, { name: "Panama City", lat: 8.98, lng: -79.52 },
    { name: "Quito", lat: -0.18, lng: -78.47 }, { name: "Santo Domingo", lat: 18.49, lng: -69.93 },
  ];
  const GLOBAL = [
    { name: "London", lat: 51.51, lng: -0.13 }, { name: "Madrid", lat: 40.42, lng: -3.70 },
    { name: "Lisbon", lat: 38.72, lng: -9.14 }, { name: "Lagos", lat: 6.52, lng: 3.38 },
    { name: "Dubai", lat: 25.20, lng: 55.27 }, { name: "Singapore", lat: 1.35, lng: 103.82 },
    { name: "Manila", lat: 14.60, lng: 120.98 }, { name: "Mumbai", lat: 19.08, lng: 72.88 },
  ];

  const arcs = [];
  const arc = (a, b, cyan, alt, speed) => arcs.push({
    startLat: a.lat, startLng: a.lng, endLat: b.lat, endLng: b.lng,
    color: cyan ? [CYAN, CYAN_L] : [ORANGE, ORANGE_L],
    alt, speed,
  });
  // US <-> LATAM mesh, alternating direction (to / from) for the "vice-versa" feel
  LATAM.forEach((c, i) => {
    const u1 = US[i % US.length], u2 = US[(i + 2) % US.length];
    const toLatam = i % 2 === 0;
    arc(toLatam ? u1 : c, toLatam ? c : u1, i % 4 === 0, 0.16 + (i % 5) * 0.045, 1700 + (i % 4) * 450);
    if (i % 3 !== 2) arc(i % 2 ? u2 : c, i % 2 ? c : u2, i % 5 === 0, 0.24 + (i % 3) * 0.05, 2200 + (i % 3) * 400);
  });
  // Worldwide reach from US & LATAM gateways
  GLOBAL.forEach((g, i) => {
    const src = i % 2 === 0 ? US[i % US.length] : LATAM[(i * 2) % LATAM.length];
    arc(src, g, i % 2 === 0, 0.32 + (i % 4) * 0.06, 2600 + (i % 3) * 500);
  });
  // a couple of intra-LATAM links
  arc(LATAM[0], LATAM[3], false, 0.18, 2100);
  arc(LATAM[2], LATAM[6], false, 0.2, 2300);

  const points = [
    ...US.map((p) => ({ lat: p.lat, lng: p.lng, size: 0.6, color: "#fff" })),
    ...LATAM.map((p) => ({ lat: p.lat, lng: p.lng, size: 0.45, color: ORANGE_L })),
    ...GLOBAL.map((p) => ({ lat: p.lat, lng: p.lng, size: 0.4, color: CYAN })),
  ];
  // gentle ripple rings on a few key gateways (not just one hub)
  const ringNodes = [US[0], US[1], US[3], LATAM[0], LATAM[3], LATAM[2]];

  let world;
  try {
    world = window.Globe()(mount)
      .backgroundColor("rgba(0,0,0,0)")
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor(ORANGE)
      .atmosphereAltitude(0.18)
      .globeImageUrl(null)
      // hex polygons for a clean "infrastructure" wireframe-dotted earth
      .hexPolygonsData([])
      .pointsData(points)
      .pointLat("lat").pointLng("lng").pointColor("color")
      .pointAltitude(0.01)
      .pointRadius("size")
      .arcsData(arcs)
      .arcColor("color")
      .arcAltitude("alt")
      .arcStroke(0.4)
      .arcDashLength(0.4)
      .arcDashGap(2)
      .arcDashAnimateTime("speed")
      .arcsTransitionDuration(0);

    // dark base material with subtle orange wash (mutate existing colors — no global THREE needed)
    const globeMat = world.globeMaterial();
    if (globeMat.color) globeMat.color.set("#0d0d14");
    if (globeMat.emissive) globeMat.emissive.set("#1a0d05");
    globeMat.emissiveIntensity = 0.4;
    globeMat.shininess = 0.2;

    // subtle ripple rings on several key gateways
    world.ringsData(ringNodes.map((n) => ({ lat: n.lat, lng: n.lng })))
      .ringColor(() => (t) => `rgba(255,127,57,${0.7 * (1 - t)})`)
      .ringMaxRadius(4)
      .ringPropagationSpeed(2)
      .ringRepeatPeriod(1700);

    // load country borders as hex polygons (infrastructure look) — bundled locally (same-origin)
    fetch("assets/data/countries.geojson")
      .then((r) => r.json())
      .then((geo) => {
        world.hexPolygonsData(geo.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.28)
          .hexPolygonUseDots(true)
          .hexPolygonColor(() => "rgba(255,150,90,0.42)");
      })
      .catch(() => { /* keep plain globe */ });

    // sizing
    const sizeGlobe = () => {
      const w = mount.clientWidth || 480;
      world.width(w).height(w);
    };
    sizeGlobe();
    window.addEventListener("resize", sizeGlobe, { passive: true });

    // Static framing centered on the Americas (shows US + all of LATAM, arcs reaching worldwide)
    const VIEW = { lat: 6, lng: -72, altitude: 2.55 };

    // fully static — no drag, no zoom, no spin (only the arcs/rings animate)
    const controls = world.controls();
    controls.enabled = false;
    controls.autoRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    if (reduce) {
      world.pointOfView(VIEW, 0);
    } else {
      // one-time gentle focus-in, then it rests — no interaction afterward
      world.pointOfView({ lat: 6, lng: -72, altitude: 3.3 }, 0);
      setTimeout(() => world.pointOfView(VIEW, 2400), 300);
    }

    // expose for debugging
    window.__movantisGlobe = world;
  } catch (err) {
    console.warn("Globe init failed, using fallback:", err);
    showFallback();
  }
})();
