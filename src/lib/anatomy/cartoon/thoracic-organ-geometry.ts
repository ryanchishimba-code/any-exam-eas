/**
 * Thoracic & upper-abdominal organ geometry — catalog unit space (~1–2 units).
 * Anatomical landmarks: heart in mediastinum, lungs in pleural cavities,
 * liver dome under right hemidiaphragm, mediastinal tubes posterior.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

function tube(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  segments = 12
) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const geo = new THREE.CapsuleGeometry(radius, Math.max(0.02, len - radius * 2), 6, segments);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  geo.applyMatrix4(new THREE.Matrix4().compose(mid, quat, new THREE.Vector3(1, 1, 1)));
  return geo;
}

function mergeParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

/** Four-chamber heart — apex inferior-left, RV anterior, great vessels superior. */
export function buildHeartGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];

  const lvProfile = [
    new THREE.Vector2(0.08, -0.42),
    new THREE.Vector2(0.22, -0.28),
    new THREE.Vector2(0.28, 0.02),
    new THREE.Vector2(0.24, 0.22),
    new THREE.Vector2(0.14, 0.32),
    new THREE.Vector2(0.06, 0.18),
  ];
  const lv = new THREE.LatheGeometry(lvProfile, 20);
  lv.rotateZ(-0.22);
  lv.translate(0.12, -0.06, -0.02);
  parts.push(lv);

  const rv = new THREE.SphereGeometry(0.28, 20, 18);
  rv.scale(0.72, 0.88, 0.58);
  rv.translate(-0.06, 0.02, 0.14);
  parts.push(rv);

  const la = new THREE.SphereGeometry(0.2, 16, 16);
  la.scale(0.88, 0.72, 0.68);
  la.translate(0.14, 0.2, -0.06);
  parts.push(la);

  const ra = new THREE.SphereGeometry(0.18, 16, 16);
  ra.scale(0.82, 0.68, 0.62);
  ra.translate(-0.1, 0.16, 0.02);
  parts.push(ra);

  parts.push(tube(new THREE.Vector3(0.04, 0.28, 0.02), new THREE.Vector3(0.04, 0.48, 0.02), 0.065));
  parts.push(
    tube(new THREE.Vector3(-0.04, 0.22, 0.08), new THREE.Vector3(-0.02, 0.42, 0.1), 0.055)
  );

  const groove = new THREE.BoxGeometry(0.04, 0.52, 0.025);
  groove.translate(0.04, -0.02, 0.06);
  parts.push(groove);

  const apex = new THREE.SphereGeometry(0.1, 12, 12);
  apex.scale(0.85, 1.2, 0.75);
  apex.translate(0.18, -0.38, 0.04);
  parts.push(apex);

  return parts;
}

export function buildCatalogHeartGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildHeartGeometryParts());
}

/** Right lung (3 lobes) + left lung (2 lobes + cardiac notch). */
export function buildLungsGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];

  function lungLobes(sx: -1 | 1, wide: boolean) {
    const ox = sx * (wide ? 0.36 : 0.32);
    const upper = new THREE.CapsuleGeometry(wide ? 0.2 : 0.17, 0.22, 8, 16);
    upper.translate(ox, 0.38, -0.04);
    parts.push(upper);

    const middle = new THREE.CapsuleGeometry(wide ? 0.24 : 0.19, 0.28, 8, 16);
    middle.translate(ox + sx * -0.02, 0.08, -0.02);
    parts.push(middle);

    const lower = new THREE.CapsuleGeometry(wide ? 0.26 : 0.2, 0.32, 8, 16);
    lower.translate(ox, -0.22, 0.02);
    parts.push(lower);

    if (wide) {
      const middleLobe = new THREE.SphereGeometry(0.16, 14, 14);
      middleLobe.scale(1.1, 0.65, 0.85);
      middleLobe.translate(ox + sx * 0.08, 0.02, 0.06);
      parts.push(middleLobe);
    } else {
      const lingula = new THREE.SphereGeometry(0.12, 12, 12);
      lingula.scale(0.75, 0.55, 0.65);
      lingula.translate(ox + sx * 0.14, -0.02, 0.08);
      parts.push(lingula);
    }

    const hilum = new THREE.SphereGeometry(0.11, 12, 12);
    hilum.scale(0.65, 0.85, 0.55);
    hilum.translate(ox + sx * -0.2, 0.06, 0.08);
    parts.push(hilum);

    const pleura = new THREE.SphereGeometry(0.42, 20, 20);
    pleura.scale(wide ? 0.95 : 0.82, 1.05, 0.48);
    pleura.translate(ox, 0.02, -0.08);
    parts.push(pleura);
  }

  lungLobes(-1, true);
  lungLobes(1, false);
  return parts;
}

export function buildCatalogLungsGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildLungsGeometryParts());
}

/** Right + left lobes, caudate, quadrate — diaphragmatic dome. */
export function buildLiverGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];

  const domeProfile = [
    new THREE.Vector2(0.05, 0),
    new THREE.Vector2(0.38, 0.08),
    new THREE.Vector2(0.52, 0.22),
    new THREE.Vector2(0.48, 0.38),
    new THREE.Vector2(0.32, 0.42),
    new THREE.Vector2(0.12, 0.28),
  ];
  const rightDome = new THREE.LatheGeometry(domeProfile, 28, 0, Math.PI * 0.55);
  rightDome.rotateY(-0.35);
  rightDome.translate(-0.18, 0.08, -0.04);
  parts.push(rightDome);

  const rightBody = new THREE.SphereGeometry(0.42, 22, 22, 0, Math.PI * 2, 0, Math.PI * 0.58);
  rightBody.scale(1.15, 0.72, 0.62);
  rightBody.translate(-0.14, -0.08, 0.02);
  parts.push(rightBody);

  const leftLobe = new THREE.SphereGeometry(0.28, 18, 18);
  leftLobe.scale(0.95, 0.55, 0.48);
  leftLobe.translate(0.22, 0.06, 0.04);
  parts.push(leftLobe);

  const caudate = new THREE.SphereGeometry(0.14, 12, 12);
  caudate.scale(0.75, 0.85, 0.65);
  caudate.translate(0.04, 0.1, -0.14);
  parts.push(caudate);

  const quadrate = new THREE.SphereGeometry(0.12, 10, 10);
  quadrate.scale(0.82, 0.72, 0.68);
  quadrate.translate(-0.04, -0.06, 0.08);
  parts.push(quadrate);

  const falciform = new THREE.BoxGeometry(0.025, 0.38, 0.08);
  falciform.translate(0.02, 0.02, 0.1);
  parts.push(falciform);

  return parts;
}

export function buildCatalogLiverGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildLiverGeometryParts());
}

/** Trachea with C-ring cartilage hints. */
export function buildTracheaGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(tube(new THREE.Vector3(0, 0.42, 0), new THREE.Vector3(0, -0.42, 0), 0.075));
  for (let i = 0; i < 8; i++) {
    const y = 0.36 - i * 0.1;
    const ring = new THREE.TorusGeometry(0.082, 0.012, 6, 18);
    ring.rotateX(Math.PI / 2);
    ring.translate(0, y, 0);
    parts.push(ring);
  }
  const carina = new THREE.ConeGeometry(0.06, 0.08, 8);
  carina.rotateX(Math.PI);
  carina.translate(0, -0.46, 0);
  parts.push(carina);
  return parts;
}

export function buildCatalogTracheaGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildTracheaGeometryParts());
}

/** Posterior mediastinum — flattened muscular tube. */
export function buildEsophagusGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const path = [
    new THREE.Vector3(0, 0.48, -0.06),
    new THREE.Vector3(0, 0.1, -0.08),
    new THREE.Vector3(0, -0.32, -0.06),
  ];
  const curve = new THREE.CatmullRomCurve3(path);
  parts.push(new THREE.TubeGeometry(curve, 20, 0.038, 8, false));
  return parts;
}

export function buildCatalogEsophagusGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildEsophagusGeometryParts());
}

/** Aortic arch + thoracic/abdominal descent. */
export function buildAortaGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const arch = new THREE.TorusGeometry(0.28, 0.055, 12, 28, Math.PI * 0.92);
  arch.rotateY(Math.PI / 2);
  arch.translate(0.02, 0.18, -0.04);
  parts.push(arch);
  parts.push(tube(new THREE.Vector3(0.02, 0.42, -0.04), new THREE.Vector3(0.02, 0.22, -0.04), 0.048));
  parts.push(
    tube(new THREE.Vector3(-0.26, 0.12, -0.06), new THREE.Vector3(-0.26, -0.48, -0.04), 0.042)
  );
  return parts;
}

export function buildCatalogAortaGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildAortaGeometryParts());
}

/** Muscular dome — central tendon + peripheral insertions. */
export function buildDiaphragmGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const dome = new THREE.SphereGeometry(0.88, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.42);
  dome.scale(1, 0.35, 0.72);
  dome.translate(0, -0.08, -0.02);
  parts.push(dome);
  const tendon = new THREE.CylinderGeometry(0.12, 0.14, 0.025, 16);
  tendon.translate(0, 0.02, 0.04);
  parts.push(tendon);
  for (const sx of [-1, 1] as const) {
    const crus = new THREE.CapsuleGeometry(0.035, 0.18, 4, 8);
    crus.translate(sx * 0.08, -0.22, -0.1);
    parts.push(crus);
  }
  return parts;
}

export function buildCatalogDiaphragmGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildDiaphragmGeometryParts());
}

/** Butterfly thyroid + isthmus. */
export function buildThyroidGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  for (const sx of [-1, 1] as const) {
    const lobe = new THREE.SphereGeometry(0.18, 16, 16);
    lobe.scale(0.85, 1.05, 0.62);
    lobe.translate(sx * 0.2, 0.02, 0.02);
    parts.push(lobe);
  }
  const isthmus = new THREE.CapsuleGeometry(0.045, 0.14, 4, 10);
  isthmus.rotateZ(Math.PI / 2);
  isthmus.translate(0, -0.02, 0.04);
  parts.push(isthmus);
  return parts;
}

export function buildCatalogThyroidGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildThyroidGeometryParts());
}

/** J-shaped stomach — fundus, body, antrum. */
export function buildStomachGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const fundus = new THREE.SphereGeometry(0.22, 18, 18);
  fundus.scale(1.05, 0.88, 0.82);
  fundus.translate(-0.08, 0.14, 0.02);
  parts.push(fundus);
  const bodyPath = [
    new THREE.Vector3(-0.04, 0.08, 0.02),
    new THREE.Vector3(0.06, -0.02, 0.04),
    new THREE.Vector3(0.14, -0.18, 0.05),
  ];
  parts.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(bodyPath), 14, 0.09, 10, false));
  const antrum = new THREE.SphereGeometry(0.12, 14, 14);
  antrum.scale(0.88, 0.72, 0.75);
  antrum.translate(0.16, -0.22, 0.05);
  parts.push(antrum);
  return parts;
}

export function buildCatalogStomachGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildStomachGeometryParts());
}

/** Splenic ovoid in LUQ. */
export function buildSpleenGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.SphereGeometry(0.22, 18, 18);
  body.scale(0.72, 1.05, 0.48);
  body.rotateZ(0.25);
  parts.push(body);
  const notch = new THREE.BoxGeometry(0.06, 0.08, 0.04);
  notch.translate(-0.06, 0.08, 0);
  parts.push(notch);
  return parts;
}

export function buildCatalogSpleenGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildSpleenGeometryParts());
}

/** Transverse pancreatic head-body-tail. */
export function buildPancreasGeometryParts(): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(
    tube(new THREE.Vector3(0.22, 0, -0.02), new THREE.Vector3(-0.28, 0.02, -0.04), 0.045)
  );
  const head = new THREE.SphereGeometry(0.1, 12, 12);
  head.scale(1.1, 0.85, 0.9);
  head.translate(0.24, 0, -0.02);
  parts.push(head);
  return parts;
}

export function buildCatalogPancreasGeometry(): THREE.BufferGeometry | null {
  return mergeParts(buildPancreasGeometryParts());
}
