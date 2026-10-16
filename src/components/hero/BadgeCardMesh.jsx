// ─── BadgeCardMesh — Lanyard, silver clip, sleeve & card + pendulum physics ──
// Hierarchy (inside a responsive, uniformly-scaled root group):
//   • Two fabric straps (dynamic ribbon geometry) forming a V from off-screen
//     anchors down to the split ring.
//   • Card group, pivoting at the split ring:
//       split ring → carabiner → swivel → bulldog clamp → plastic sleeve → card.
// Physics: the ring is a damped rope-pendulum (max length = lanyard length);
// the card is a secondary pendulum hanging from the ring, driven by the ring's
// acceleration, plus spring-damped twist (Y) and tilt (X) for 3D depth.

import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { createBadgeTextures, loadBadgeFonts, repaintBadgeTextures } from './BadgeContent';

// ── Dimensions (world units) ─────────────────────────────────────────────────
const SLEEVE_W = 2.7;
const SLEEVE_H = 3.95;
const SLEEVE_R = 0.28;
const SLEEVE_D = 0.024;
const CARD_W = 2.4;
const CARD_H = 3.4;
const CARD_T = 0.012;
const CLIP_DROP = 0.78; // ring centre → sleeve top edge
const CARD_TOP_INSET = 0.42; // sleeve top edge → card top edge
const HOLE_R = 0.07;
const HOLE_X = SLEEVE_W / 2 - 0.32;
const HOLE_Y = SLEEVE_H / 2 - 0.24;
const SLEEVE_CENTER_Y = -(CLIP_DROP + SLEEVE_H / 2);
const CARD_CENTER_Y = SLEEVE_H / 2 - CARD_TOP_INSET - CARD_H / 2;
const PIVOT_TO_CENTER = CLIP_DROP + SLEEVE_H / 2;

const STRAP_W = 0.2;
const STRAP_SPREAD = 0.55;
const STRAP_SEGMENTS = 40;
const STRAP_TOP_EXTRA = 0.6;
const STRAP_BOTTOM = { x: 0.022, y: 0.07 };

// ── Physics constants ────────────────────────────────────────────────────────
const GRAVITY = 24;
const AIR_DRAG = 0.42;
const DRAG_K = 150;
const DRAG_C = 22;
const CARD_LEN = 2.3; // effective pendulum length of the card
const SWING_DAMP = 0.85;
const TWIST_K = 7;
const TWIST_C = 1.5;
const TILT_K = 9;
const TILT_C = 2.2;

// ── Geometry helpers ─────────────────────────────────────────────────────────
function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function createSleeveGeometry() {
  const shape = roundedRectShape(SLEEVE_W, SLEEVE_H, SLEEVE_R);
  [-HOLE_X, HOLE_X].forEach((hx) => {
    const hole = new THREE.Path();
    hole.absarc(hx, HOLE_Y, HOLE_R, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  });
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: SLEEVE_D,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 28,
  });
  geo.translate(0, 0, -SLEEVE_D / 2);
  return geo;
}

function createRibbonGeometry(segments) {
  const geo = new THREE.BufferGeometry();
  const count = (segments + 1) * 2;
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
  const index = [];
  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  geo.setIndex(index);
  return geo;
}

const _p = new THREE.Vector3();
const _c = new THREE.Vector3();
const _t = new THREE.Vector3();
const _s = new THREE.Vector3();
const Z = new THREE.Vector3(0, 0, 1);

/** Rebuilds a flat fabric ribbon along a quadratic curve (sag + twist). */
function updateRibbon(geo, start, end, sag, twist) {
  const pos = geo.attributes.position.array;
  const uv = geo.attributes.uv.array;
  _c.copy(start).add(end).multiplyScalar(0.5);
  _c.y -= sag;

  let length = 0;
  let prevX = start.x;
  let prevY = start.y;

  for (let i = 0; i <= STRAP_SEGMENTS; i++) {
    const t = i / STRAP_SEGMENTS;
    const mt = 1 - t;
    _p.set(
      mt * mt * start.x + 2 * mt * t * _c.x + t * t * end.x,
      mt * mt * start.y + 2 * mt * t * _c.y + t * t * end.y,
      mt * mt * start.z + 2 * mt * t * _c.z + t * t * end.z
    );
    _t.set(
      2 * mt * (_c.x - start.x) + 2 * t * (end.x - _c.x),
      2 * mt * (_c.y - start.y) + 2 * t * (end.y - _c.y),
      0
    ).normalize();
    const a = twist * t * t;
    _s.set(-_t.y, _t.x, 0).multiplyScalar(Math.cos(a)).addScaledVector(Z, Math.sin(a));

    length += Math.hypot(_p.x - prevX, _p.y - prevY);
    prevX = _p.x;
    prevY = _p.y;

    const half = STRAP_W / 2;
    const k = i * 6;
    pos[k] = _p.x - _s.x * half;
    pos[k + 1] = _p.y - _s.y * half;
    pos[k + 2] = _p.z - _s.z * half;
    pos[k + 3] = _p.x + _s.x * half;
    pos[k + 4] = _p.y + _s.y * half;
    pos[k + 5] = _p.z + _s.z * half;

    const v = length / (STRAP_W * 2);
    const u = i * 4;
    uv[u] = 0;
    uv[u + 1] = v;
    uv[u + 2] = 1;
    uv[u + 3] = v;
  }

  geo.attributes.position.needsUpdate = true;
  geo.attributes.uv.needsUpdate = true;
  geo.computeVertexNormals();
}

// ── Component ────────────────────────────────────────────────────────────────
export default function BadgeCardMesh() {
  const { camera, gl } = useThree();
  const rootRef = useRef();
  const cardRef = useRef();
  const strapLRef = useRef();
  const strapRRef = useRef();
  const scaleRef = useRef(1);
  const cleanupRef = useRef(null);

  // Simulation state (kept outside React state — mutated every frame)
  const sim = useRef(null);
  if (!sim.current) {
    sim.current = {
      ready: false,
      p: new THREE.Vector2(),
      v: new THREE.Vector2(),
      vPrev: new THREE.Vector2(),
      acc: new THREE.Vector2(),
      theta: -0.4,
      omega: 0,
      phi: 0.5,
      phiV: 0,
      psi: 0,
      psiV: 0,
      dragging: false,
      hovered: false,
      target: new THREE.Vector2(),
      grab: new THREE.Vector2(),
      time: 0,
    };
  }

  // ── Textures & materials ──
  const textures = useMemo(
    () => createBadgeTextures(Math.min(8, gl.capabilities.getMaxAnisotropy())),
    [gl]
  );

  useEffect(() => {
    let alive = true;
    loadBadgeFonts().then(() => alive && repaintBadgeTextures(textures));
    return () => {
      alive = false;
    };
  }, [textures]);

  const mats = useMemo(() => {
    const metal = new THREE.MeshStandardMaterial({
      color: '#f1f1f4',
      metalness: 1,
      roughness: 0.13,
      envMapIntensity: 1.5,
    });
    const metalSatin = new THREE.MeshStandardMaterial({
      color: '#c9c9cf',
      metalness: 1,
      roughness: 0.32,
      envMapIntensity: 1.2,
    });
    const paperEdge = new THREE.MeshStandardMaterial({ color: '#efefec', roughness: 0.95 });
    const face = new THREE.MeshStandardMaterial({
      map: textures.face,
      roughness: 0.94,
      metalness: 0,
      envMapIntensity: 0.25,
    });
    const back = new THREE.MeshStandardMaterial({
      map: textures.back,
      roughness: 0.94,
      metalness: 0,
      envMapIntensity: 0.25,
    });
    const sleeve = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.07,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 0.14,
      envMapIntensity: 2.4,
      depthWrite: false,
    });
    const seam = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    const holeRim = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const strap = new THREE.MeshStandardMaterial({
      map: textures.strap,
      roughness: 0.78,
      metalness: 0,
      side: THREE.DoubleSide,
      envMapIntensity: 0.6,
    });
    return { metal, metalSatin, paperEdge, face, back, sleeve, seam, holeRim, strap };
  }, [textures]);

  // ── Geometries ──
  const geos = useMemo(() => {
    const sleeve = createSleeveGeometry();

    const seamPts = roundedRectShape(SLEEVE_W - 0.14, SLEEVE_H - 0.14, SLEEVE_R - 0.06).getPoints(16);
    const seam = new THREE.BufferGeometry().setFromPoints(seamPts);

    const carabinerCurve = new THREE.CatmullRomCurve3(
      [
        [0, -0.06],
        [0.07, -0.085],
        [0.105, -0.16],
        [0.11, -0.3],
        [0.09, -0.42],
        [0.04, -0.5],
        [-0.04, -0.5],
        [-0.085, -0.43],
        [-0.095, -0.3],
        [-0.09, -0.16],
        [-0.065, -0.085],
      ].map(([x, y]) => new THREE.Vector3(x, y, 0)),
      true,
      'centripetal'
    );
    const carabiner = new THREE.TubeGeometry(carabinerCurve, 120, 0.017, 14, true);

    return {
      sleeve,
      seam,
      carabiner,
      strapL: createRibbonGeometry(STRAP_SEGMENTS),
      strapR: createRibbonGeometry(STRAP_SEGMENTS),
    };
  }, []);

  const seamLine = useMemo(() => new THREE.LineLoop(geos.seam, mats.seam), [geos, mats]);

  useEffect(
    () => () => {
      Object.values(geos).forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
      Object.values(textures).forEach((t) => t.dispose());
      cleanupRef.current?.();
      document.body.style.cursor = '';
    },
    [geos, mats, textures]
  );

  // ── Pointer → local (root-space) coordinates on the z = 0 plane ──
  const ray = useMemo(() => ({ v: new THREE.Vector3(), dir: new THREE.Vector3() }), []);
  const pointerToLocal = (clientX, clientY, out) => {
    const rect = gl.domElement.getBoundingClientRect();
    ray.v.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
      0.5
    );
    ray.v.unproject(camera);
    ray.dir.copy(ray.v).sub(camera.position).normalize();
    const dist = -camera.position.z / ray.dir.z;
    const s = scaleRef.current;
    out.set(
      (camera.position.x + ray.dir.x * dist) / s,
      (camera.position.y + ray.dir.y * dist) / s
    );
    return out;
  };

  const ptr = useMemo(() => new THREE.Vector2(), []);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.nativeEvent?.preventDefault?.();
    const st = sim.current;
    pointerToLocal(e.clientX, e.clientY, ptr);
    st.grab.set(st.p.x - ptr.x, st.p.y - ptr.y);
    st.target.copy(st.p);
    st.dragging = true;
    document.body.style.cursor = 'grabbing';

    const move = (ev) => {
      pointerToLocal(ev.clientX, ev.clientY, ptr);
      st.target.set(ptr.x + st.grab.x, ptr.y + st.grab.y);
    };
    const up = () => {
      st.dragging = false;
      document.body.style.cursor = st.hovered ? 'grab' : '';
      cleanupRef.current?.();
    };
    cleanupRef.current = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      cleanupRef.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  // Brushing the cursor across the badge nudges it organically
  const handlePointerMove = (e) => {
    const st = sim.current;
    if (st.dragging) return;
    const mx = THREE.MathUtils.clamp(e.nativeEvent.movementX || 0, -40, 40);
    const my = THREE.MathUtils.clamp(e.nativeEvent.movementY || 0, -40, 40);
    st.v.x += mx * 0.012;
    st.phiV += mx * 0.01;
    st.psiV += my * 0.008;
  };

  const handleOver = (e) => {
    e.stopPropagation();
    sim.current.hovered = true;
    if (!sim.current.dragging) document.body.style.cursor = 'grab';
  };
  const handleOut = () => {
    sim.current.hovered = false;
    if (!sim.current.dragging) document.body.style.cursor = '';
  };

  // ── Reusable vectors for the frame loop ──
  const tmp = useMemo(
    () => ({
      topL: new THREE.Vector3(),
      topR: new THREE.Vector3(),
      botL: new THREE.Vector3(),
      botR: new THREE.Vector3(),
      d: new THREE.Vector2(),
    }),
    []
  );

  useFrame((state, delta) => {
    const st = sim.current;
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card) return;

    // Responsive scale — fit the badge inside the free left gutter next to the centered
    // hero content (terminal max-w: 768px <1536px, 896px above), measured in real pixels.
    const { width: vw, height: vh } = state.viewport;
    const pxW = state.size.width;
    const pxPerUnit = state.size.height / vh;
    const contentHalf = pxW >= 1536 ? 448 : 384;
    const gutter = Math.max(0, pxW / 2 - contentHalf);
    const baseS = Math.min(1, (vw * 0.8) / SLEEVE_W, (vh * 0.62) / (SLEEVE_H + CLIP_DROP));
    const maxS = baseS * 0.7;
    const fitS = (Math.max(gutter * 0.85, 120) / pxPerUnit) / SLEEVE_W;
    const s = Math.min(maxS, fitS);
    scaleRef.current = s;
    root.scale.setScalar(s);

    const halfH = vh / 2 / s;
    // Anchor the lanyard at the centre of the left gutter (pushed inward a bit on very wide screens).
    const anchorFromLeftPx = gutter * 0.5 + Math.max(0, pxW - 1536) * 0.23;
    const ax = ((anchorFromLeftPx - pxW / 2) / pxPerUnit) / s;
    const ay = halfH + 1.0;
    const restPy = Math.min(-0.1 * halfH + PIVOT_TO_CENTER, halfH - 0.8);
    const L = ay - restPy;

    if (!st.ready) {
      // Entrance: dropped in from above with a little sideways swing
      st.p.set(ax + 0.9, ay - L * 0.5);
      st.v.set(0, 0);
      st.vPrev.set(0, 0);
      st.ready = true;
    }

    const dt = Math.min(delta, 1 / 30);
    const steps = 4;
    const h = dt / steps;

    for (let i = 0; i < steps; i++) {
      st.time += h;

      if (st.dragging) {
        st.v.x += ((st.target.x - st.p.x) * DRAG_K - st.v.x * DRAG_C) * h;
        st.v.y += ((st.target.y - st.p.y) * DRAG_K - st.v.y * DRAG_C) * h;
      } else {
        st.v.y -= GRAVITY * h;
        st.v.x += Math.sin(st.time * 0.7) * 0.18 * h; // faint ambient breeze
        const damp = Math.exp(-AIR_DRAG * h);
        st.v.multiplyScalar(damp);
      }

      st.p.addScaledVector(st.v, h);

      // Lanyard length constraint (slightly elastic while dragging)
      tmp.d.set(st.p.x - ax, st.p.y - ay);
      const len = tmp.d.length();
      const maxLen = st.dragging ? L * 1.1 : L;
      if (len > maxLen) {
        tmp.d.divideScalar(len);
        st.p.set(ax + tmp.d.x * maxLen, ay + tmp.d.y * maxLen);
        const radial = st.v.dot(tmp.d);
        if (radial > 0) st.v.addScaledVector(tmp.d, -radial * (st.dragging ? 1 : 1.12));
      }

      // Ring acceleration drives the card's secondary swing
      st.acc.set((st.v.x - st.vPrev.x) / h, (st.v.y - st.vPrev.y) / h);
      if (st.acc.length() > 90) st.acc.setLength(90);
      st.vPrev.copy(st.v);

      const gEff = GRAVITY + st.acc.y;
      const alpha =
        (-gEff * Math.sin(st.theta) - st.acc.x * Math.cos(st.theta)) / CARD_LEN -
        SWING_DAMP * st.omega;
      st.omega += alpha * h;
      st.theta = THREE.MathUtils.clamp(st.theta + st.omega * h, -1.35, 1.35);

      // Twist (Y) & tilt (X) springs, excited by motion
      st.phiV += (-TWIST_K * st.phi - TWIST_C * st.phiV - st.v.x * 0.55) * h;
      st.phi = THREE.MathUtils.clamp(st.phi + st.phiV * h, -0.95, 0.95);
      st.psiV += (-TILT_K * st.psi - TILT_C * st.psiV + st.v.y * 0.12) * h;
      st.psi = THREE.MathUtils.clamp(st.psi + st.psiV * h, -0.35, 0.35);
    }

    // Apply transform to the card assembly (swing → twist → tilt)
    card.position.set(st.p.x, st.p.y, 0);
    card.rotation.set(st.psi, st.phi, st.theta, 'ZYX');

    // Straps: off-screen anchors → split ring
    const c = Math.cos(st.theta);
    const sn = Math.sin(st.theta);
    const bx = STRAP_BOTTOM.x;
    const by = STRAP_BOTTOM.y;
    tmp.topL.set(ax - STRAP_SPREAD, ay + STRAP_TOP_EXTRA, -0.012);
    tmp.topR.set(ax + STRAP_SPREAD, ay + STRAP_TOP_EXTRA, 0.012);
    tmp.botL.set(st.p.x + (-bx * c - by * sn), st.p.y + (-bx * sn + by * c), -0.012);
    tmp.botR.set(st.p.x + (bx * c - by * sn), st.p.y + (bx * sn + by * c), 0.012);

    const restLen = Math.hypot(STRAP_SPREAD - bx, ay + STRAP_TOP_EXTRA - (restPy + by));
    const sagFor = (top, bot) => {
      const d = Math.hypot(top.x - bot.x, top.y - bot.y);
      return 0.5 * Math.sqrt(Math.max(restLen * restLen - d * d, 0));
    };

    updateRibbon(strapLRef.current.geometry, tmp.topL, tmp.botL, sagFor(tmp.topL, tmp.botL), st.phi);
    updateRibbon(strapRRef.current.geometry, tmp.topR, tmp.botR, sagFor(tmp.topR, tmp.botR), st.phi);
  });

  return (
    <group ref={rootRef}>
      {/* ═══ Dual-strap V lanyard ═══ */}
      <mesh ref={strapLRef} geometry={geos.strapL} material={mats.strap} frustumCulled={false} />
      <mesh ref={strapRRef} geometry={geos.strapR} material={mats.strap} frustumCulled={false} />

      {/* ═══ Card assembly — pivots at the split ring ═══ */}
      <group
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        {/* Split ring where both straps meet */}
        <mesh rotation={[0, 1.15, 0]} material={mats.metal}>
          <torusGeometry args={[0.085, 0.017, 16, 56]} />
        </mesh>

        {/* Polished carabiner + gate */}
        <mesh geometry={geos.carabiner} material={mats.metal} />
        <mesh position={[-0.058, -0.29, 0.004]} rotation={[0, 0, 0.04]} material={mats.metalSatin}>
          <cylinderGeometry args={[0.008, 0.008, 0.24, 10]} />
        </mesh>

        {/* Swivel */}
        <mesh position={[0, -0.5, 0]} material={mats.metal}>
          <sphereGeometry args={[0.028, 20, 20]} />
        </mesh>
        <mesh position={[0, -0.557, 0]} material={mats.metal}>
          <cylinderGeometry args={[0.03, 0.034, 0.1, 24]} />
        </mesh>

        {/* Bulldog clamp gripping the sleeve */}
        <RoundedBox args={[0.34, 0.05, 0.075]} radius={0.012} smoothness={3} position={[0, -0.635, 0]} material={mats.metal} />
        <RoundedBox
          args={[0.34, 0.3, 0.022]}
          radius={0.009}
          smoothness={3}
          position={[0, -0.8, SLEEVE_D / 2 + 0.02]}
          material={mats.metal}
        />
        <RoundedBox
          args={[0.34, 0.3, 0.022]}
          radius={0.009}
          smoothness={3}
          position={[0, -0.8, -(SLEEVE_D / 2 + 0.02)]}
          material={mats.metal}
        />
        <mesh position={[0, -0.715, SLEEVE_D / 2 + 0.032]} material={mats.metalSatin}>
          <boxGeometry args={[0.26, 0.006, 0.004]} />
        </mesh>
        <mesh position={[0, -0.835, SLEEVE_D / 2 + 0.036]} rotation={[Math.PI / 2, 0, 0]} material={mats.metalSatin}>
          <cylinderGeometry args={[0.032, 0.032, 0.012, 28]} />
        </mesh>

        {/* Plastic sleeve + card stock */}
        <group position={[0, SLEEVE_CENTER_Y, 0]}>
          <mesh position={[0, CARD_CENTER_Y, 0]} material={[mats.paperEdge, mats.paperEdge, mats.paperEdge, mats.paperEdge, mats.face, mats.back]}>
            <boxGeometry args={[CARD_W, CARD_H, CARD_T]} />
          </mesh>

          <mesh geometry={geos.sleeve} material={mats.sleeve} renderOrder={2} />

          {/* Heat-sealed seam + punched-hole rims */}
          <primitive object={seamLine} position={[0, 0, SLEEVE_D / 2 + 0.0065]} renderOrder={3} />
          {[-HOLE_X, HOLE_X].map((hx) => (
            <mesh key={hx} position={[hx, HOLE_Y, SLEEVE_D / 2 + 0.0066]} material={mats.holeRim} renderOrder={3}>
              <ringGeometry args={[HOLE_R, HOLE_R + 0.013, 40]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
