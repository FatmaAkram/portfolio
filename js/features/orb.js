import { $, $$, reduce, hasST, cssv } from "../utils.js";
import { onThemeChange } from "./theme.js";

export const orbIntro = { v: reduce || !hasST ? 1 : 0 };

/* 3D graph: highlighted nodes are projects and carry clickable labels */
export default function initOrb() {
  var box = $("#orb"),
    cv = $("#gl"),
    labs = $$(".lab", box);
  if (typeof THREE === "undefined") {
    labs.forEach(function (l, i) {
      l.style.position = "static";
      l.style.margin = "4px";
    });
    throw new Error("three missing");
  }
  var renderer = new THREE.WebGLRenderer({
    canvas: cv,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var scene = new THREE.Scene(),
    cam = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  cam.position.z = 8.7;
  var group = new THREE.Group();
  scene.add(group);
  var c = document.createElement("canvas");
  c.width = c.height = 64;
  var x = c.getContext("2d");
  x.beginPath();
  x.arc(32, 32, 29, 0, Math.PI * 2);
  x.fillStyle = "#fff";
  x.fill();
  var tex = new THREE.CanvasTexture(c);
  function onSphere(r, u, t) {
    if (u == null) u = Math.random() * 2 - 1;
    if (t == null) t = Math.random() * Math.PI * 2;
    var s = Math.sqrt(1 - u * u);
    return [r * s * Math.cos(t), r * u, r * s * Math.sin(t)];
  }
  var P = 5,
    NN = 66,
    nodes = [],
    i,
    j;
  /* project nodes spread evenly so their labels do not pile up */
  var spots = [
    [0.7, 0.3],
    [0.1, 1.7],
    [-0.55, 3.0],
    [0.35, 4.3],
    [-0.75, 5.5],
  ];
  for (i = 0; i < P; i++)
    nodes.push(
      onSphere(2.25, spots[i % spots.length][0], spots[i % spots.length][1]),
    );
  for (i = P; i < NN; i++)
    nodes.push(
      onSphere(i < P + 9 ? 1 + Math.random() * 0.6 : 2 + Math.random() * 0.55),
    );
  function pts(list, size, vc) {
    var g = new THREE.BufferGeometry(),
      p = new Float32Array(list.length * 3);
    list.forEach(function (n, k) {
      p.set(n, k * 3);
    });
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    var m = new THREE.PointsMaterial({
      size: size,
      map: tex,
      transparent: true,
      alphaTest: 0.4,
      sizeAttenuation: true,
    });
    group.add(new THREE.Points(g, m));
    return m;
  }
  var pm = pts(nodes.slice(0, P), 0.46),
    nm = pts(nodes.slice(P), 0.2);
  var seg = [];
  for (i = 0; i < NN; i++) {
    var d = [];
    for (j = 0; j < NN; j++) {
      if (j !== i) {
        var a = nodes[i],
          b = nodes[j];
        d.push([
          Math.pow(a[0] - b[0], 2) +
            Math.pow(a[1] - b[1], 2) +
            Math.pow(a[2] - b[2], 2),
          j,
        ]);
      }
    }
    d.sort(function (p, q) {
      return p[0] - q[0];
    });
    for (j = 0; j < (i < P ? 4 : 2); j++) {
      seg.push.apply(seg, nodes[i]);
      seg.push.apply(seg, nodes[d[j][1]]);
    }
    if (i >= P + 9 && i % 4 === 0) {
      seg.push.apply(seg, nodes[i]);
      seg.push.apply(seg, nodes[P + (i % 9)]);
    }
  }
  var lg = new THREE.BufferGeometry();
  lg.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(seg), 3),
  );
  var lm = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: 0.28,
  });
  group.add(new THREE.LineSegments(lg, lm));
  var dust = [];
  for (i = 0; i < 520; i++) dust.push(onSphere(2.95 + Math.random() * 0.25));
  var dm = pts(dust, 0.05);
  /* signals travelling along the edges */
  var EC = seg.length / 6,
    PK = 18,
    pulses = [],
    pp = new Float32Array(PK * 3),
    pgeo = new THREE.BufferGeometry();
  pgeo.setAttribute("position", new THREE.BufferAttribute(pp, 3));
  var pulm = new THREE.PointsMaterial({
    size: 0.15,
    map: tex,
    transparent: true,
    alphaTest: 0.4,
    sizeAttenuation: true,
  });
  group.add(new THREE.Points(pgeo, pulm));
  for (i = 0; i < PK; i++)
    pulses.push({
      e: Math.floor(Math.random() * EC),
      t: Math.random(),
      s: 0.006 + Math.random() * 0.01,
    });
  function colors() {
    var ink = new THREE.Color(cssv("--ink") || "#151515");
    nm.color.copy(ink);
    lm.color.copy(ink);
    dm.color.copy(ink);
    pm.color.set(cssv("--mark") || "#FFE45C");
    pulm.color.set(cssv("--mark") || "#FFE45C");
  }
  colors();
  onThemeChange(function () {
    setTimeout(colors, 30);
  });
  var CW = 1,
    CH = 1;
  function size() {
    CW = cv.clientWidth || 400;
    CH = cv.clientHeight || 400;
    renderer.setSize(CW, CH, false);
    cam.aspect = CW / CH;
    cam.updateProjectionMatrix();
  }
  size();
  window.addEventListener("resize", size);
  var vx = 0,
    vy = 0.003,
    rx = 0.2,
    ry = 0,
    drag = false,
    lx = 0,
    ly = 0,
    mx = 0,
    my = 0,
    hold = false;
  box.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".lab")) return;
    drag = true;
    lx = e.clientX;
    ly = e.clientY;
    try {
      box.setPointerCapture(e.pointerId);
    } catch (_) {}
  });
  box.addEventListener("pointermove", function (e) {
    if (!drag) return;
    vy = (e.clientX - lx) * 0.006;
    vx = (e.clientY - ly) * 0.006;
    lx = e.clientX;
    ly = e.clientY;
  });
  var up = function () {
    drag = false;
  };
  box.addEventListener("pointerup", up);
  box.addEventListener("pointercancel", up);
  labs.forEach(function (l) {
    l.addEventListener("pointerenter", function () {
      hold = true;
    });
    l.addEventListener("pointerleave", function () {
      hold = false;
    });
    l.addEventListener("focus", function () {
      hold = true;
    });
    l.addEventListener("blur", function () {
      hold = false;
    });
  });
  window.addEventListener("pointermove", function (e) {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  });
  $$(".hidx a").forEach(function (a) {
    var l = labs[+a.dataset.l];
    var on = function () {
        l.classList.add("hot");
      },
      off = function () {
        l.classList.remove("hot");
      };
    a.addEventListener("pointerenter", on);
    a.addEventListener("pointerleave", off);
    a.addEventListener("focus", on);
    a.addEventListener("blur", off);
  });
  var visible = true;
  new IntersectionObserver(function (en) {
    visible = en[0].isIntersecting;
  }).observe(box);
  var v = new THREE.Vector3();
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    if (!hold) {
      ry += vy;
      rx += vx;
    }
    vx *= 0.94;
    vy = vy * 0.96 + (reduce ? 0 : 0.003) * 0.04;
    rx = Math.max(-0.9, Math.min(0.9, rx));
    group.rotation.y = ry + mx * 0.4;
    group.rotation.x = rx + my * 0.3;
    var s = 0.5 + 0.5 * orbIntro.v;
    group.scale.set(s, s, s);
    pm.opacity = nm.opacity = orbIntro.v;
    lm.opacity = 0.28 * orbIntro.v;
    dm.opacity = 0.7 * orbIntro.v;
    for (var q = 0; q < PK; q++) {
      var pu = pulses[q];
      if (!reduce) pu.t += pu.s;
      if (pu.t > 1) {
        pu.t = 0;
        pu.e = Math.floor(Math.random() * EC);
      }
      var o = pu.e * 6;
      pp[q * 3] = seg[o] + (seg[o + 3] - seg[o]) * pu.t;
      pp[q * 3 + 1] = seg[o + 1] + (seg[o + 4] - seg[o + 1]) * pu.t;
      pp[q * 3 + 2] = seg[o + 2] + (seg[o + 5] - seg[o + 2]) * pu.t;
    }
    pgeo.attributes.position.needsUpdate = true;
    pulm.opacity = orbIntro.v;
    group.updateMatrixWorld();
    for (var k = 0; k < P; k++) {
      v.set(nodes[k][0], nodes[k][1], nodes[k][2]).applyMatrix4(
        group.matrixWorld,
      );
      var depth = (v.z + 2.4) / 4.8;
      v.project(cam);
      (frame.L = frame.L || [])[k] = {
        x: (v.x * 0.5 + 0.5) * CW + 12,
        y: (-v.y * 0.5 + 0.5) * CH - 14,
        d: depth,
      };
    }
    if (!labs.length) {
      renderer.render(scene, cam);
      return;
    }
    /* keep labels from sitting on top of each other */
    var ord = frame.L.slice().sort(function (a, b) {
      return a.y - b.y;
    });
    for (var a2 = 1; a2 < ord.length; a2++)
      for (var b2 = 0; b2 < a2; b2++) {
        if (Math.abs(ord[a2].x - ord[b2].x) < 175 && ord[a2].y - ord[b2].y < 32)
          ord[a2].y = ord[b2].y + 32;
      }
    for (k = 0; k < P; k++) {
      var l = labs[k],
        it = frame.L[k];
      frame.W =
        frame.W ||
        labs.map(function (e) {
          return e.offsetWidth;
        });
      it.x = Math.max(4, Math.min(it.x, CW - frame.W[k] - 4));
      l.style.transform =
        "translate(" + it.x.toFixed(1) + "px," + it.y.toFixed(1) + "px)";
      l.style.opacity = (
        orbIntro.v *
        (0.5 + 0.5 * Math.max(0, Math.min(1, it.d)))
      ).toFixed(2);
      l.style.zIndex = it.d > 0.5 ? 2 : 1;
    }
    renderer.render(scene, cam);
  }
  frame();
}
