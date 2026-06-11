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

  // Origination hub (US) + LATAM destinations
  const HUB = { name: "Miami (US Origination)", lat: 25.76, lng: -80.19 };
  const DEST = [
    { name: "Mexico City", lat: 19.43, lng: -99.13, rail: "orange" },
    { name: "Bogotá",      lat: 4.71,  lng: -74.07, rail: "cyan" },
    { name: "São Paulo",   lat: -23.55, lng: -46.63, rail: "orange" },
    { name: "Lima",        lat: -12.05, lng: -77.04, rail: "orange" },
    { name: "Guatemala City", lat: 14.63, lng: -90.51, rail: "orange" },
    { name: "Buenos Aires", lat: -34.60, lng: -58.38, rail: "cyan" },
    { name: "Santiago",    lat: -33.45, lng: -70.66, rail: "orange" },
    { name: "Houston (US)", lat: 29.76, lng: -95.37, rail: "cyan" },
    { name: "New York (US)", lat: 40.71, lng: -74.01, rail: "orange" },
  ];

  const ORANGE = "#FF7F39", ORANGE_L = "#FF9A5E", CYAN = "#2DD4BF";

  const arcs = DEST.map((d, i) => ({
    startLat: HUB.lat, startLng: HUB.lng,
    endLat: d.lat, endLng: d.lng,
    color: d.rail === "cyan" ? [CYAN, "#7af0e0"] : [ORANGE, ORANGE_L],
    order: i,
  }));

  const points = [HUB, ...DEST].map((p, i) => ({
    lat: p.lat, lng: p.lng,
    size: i === 0 ? 0.9 : 0.45,
    color: i === 0 ? "#fff" : (p.rail === "cyan" ? CYAN : ORANGE_L),
    hub: i === 0,
  }));

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
      .arcAltitude(0.28)
      .arcStroke(0.55)
      .arcDashLength(0.45)
      .arcDashGap(1.6)
      .arcDashAnimateTime(2200)
      .arcsTransitionDuration(0);

    // dark base material with subtle orange wash (mutate existing colors — no global THREE needed)
    const globeMat = world.globeMaterial();
    if (globeMat.color) globeMat.color.set("#0d0d14");
    if (globeMat.emissive) globeMat.emissive.set("#1a0d05");
    globeMat.emissiveIntensity = 0.4;
    globeMat.shininess = 0.2;

    // rings ripple on the origination hub
    world.ringsData([{ lat: HUB.lat, lng: HUB.lng }])
      .ringColor(() => (t) => `rgba(255,127,57,${1 - t})`)
      .ringMaxRadius(5)
      .ringPropagationSpeed(2.2)
      .ringRepeatPeriod(1100);

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

    // Fixed framing on the whole of the Americas (North + Central + South)
    const AMERICAS = { lat: 4, lng: -77, altitude: 2.4 };

    // controls: drag to explore, but no continuous spin — it stays on the Americas
    const controls = world.controls();
    controls.autoRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI - Math.PI / 4;

    if (reduce) {
      // no intro motion — just frame the Americas
      world.pointOfView(AMERICAS, 0);
    } else {
      // gentle "focus" intro: start slightly wide, then settle onto the Americas
      world.pointOfView({ lat: 4, lng: -77, altitude: 3.4 }, 0);
      setTimeout(() => world.pointOfView(AMERICAS, 2600), 300);
    }

    // after the user drags away, ease back to the Americas framing
    let reframe;
    controls.addEventListener("start", () => clearTimeout(reframe));
    controls.addEventListener("end", () => {
      reframe = setTimeout(() => world.pointOfView(AMERICAS, 1600), 2800);
    });

    // expose for debugging / framing
    window.__movantisGlobe = world;
  } catch (err) {
    console.warn("Globe init failed, using fallback:", err);
    showFallback();
  }
})();
