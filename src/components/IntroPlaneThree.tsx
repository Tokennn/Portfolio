import { useEffect, useRef } from "react";
import * as THREE from "three";

type BezierSegment = {
  kind: "bezier";
  p0: THREE.Vector2;
  p1: THREE.Vector2;
  p2: THREE.Vector2;
  p3: THREE.Vector2;
  duration: number;
  elapsed: number;
};

type LoopSegment = {
  kind: "loop";
  center: THREE.Vector2;
  radius: number;
  direction: 1 | -1;
  turns: number;
  startAngle: number;
  duration: number;
  elapsed: number;
};

type FlightSegment = BezierSegment | LoopSegment;

const randomBetween = (min: number, max: number) => THREE.MathUtils.randFloat(min, max);
const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);

const shortestAngleDelta = (next: number, prev: number) => {
  let delta = next - prev;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
};

const bezierPoint = (
  t: number,
  p0: THREE.Vector2,
  p1: THREE.Vector2,
  p2: THREE.Vector2,
  p3: THREE.Vector2
) => {
  const inv = 1 - t;
  return new THREE.Vector2(
    inv * inv * inv * p0.x + 3 * inv * inv * t * p1.x + 3 * inv * t * t * p2.x + t * t * t * p3.x,
    inv * inv * inv * p0.y + 3 * inv * inv * t * p1.y + 3 * inv * t * t * p2.y + t * t * t * p3.y
  );
};

const bezierTangent = (
  t: number,
  p0: THREE.Vector2,
  p1: THREE.Vector2,
  p2: THREE.Vector2,
  p3: THREE.Vector2
) => {
  const inv = 1 - t;
  return new THREE.Vector2(
    3 * inv * inv * (p1.x - p0.x) + 6 * inv * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
    3 * inv * inv * (p1.y - p0.y) + 6 * inv * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y)
  );
};

const toVector2 = (points: Array<[number, number]>) => points.map(([x, y]) => new THREE.Vector2(x, y));

function buildOutlinedShape(
  parent: THREE.Group,
  points: Array<[number, number]>,
  z: number,
  fillMaterial: THREE.Material,
  lineMaterial: THREE.Material
) {
  const shapePoints = toVector2(points);
  const shape = new THREE.Shape(shapePoints);
  const fill = new THREE.Mesh(new THREE.ShapeGeometry(shape), fillMaterial);
  fill.position.z = z;
  parent.add(fill);

  const strokePoints = [...shapePoints, shapePoints[0]];
  const stroke = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(strokePoints.map((p) => new THREE.Vector3(p.x, p.y, z + 0.05))),
    lineMaterial
  );
  parent.add(stroke);
}

function buildOpenStroke(
  parent: THREE.Group,
  points: Array<[number, number]>,
  z: number,
  lineMaterial: THREE.Material
) {
  const linePoints = toVector2(points).map((p) => new THREE.Vector3(p.x, p.y, z));
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePoints), lineMaterial);
  parent.add(line);
}

function createPlaneGroup() {
  const planeRoot = new THREE.Group();
  const flightGroup = new THREE.Group();
  const artGroup = new THREE.Group();
  const propellerGroup = new THREE.Group();

  planeRoot.add(flightGroup);
  flightGroup.add(artGroup);

  const fillMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.98,
    side: THREE.DoubleSide
  });
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x121212,
    transparent: true,
    opacity: 0.96
  });

  buildOutlinedShape(
    artGroup,
    [
      [-34, 7],
      [-24, 15],
      [-8, 17],
      [11, 14],
      [28, 8],
      [40, 3],
      [44, 0],
      [40, -3],
      [27, -8],
      [10, -13],
      [-12, -15],
      [-29, -9]
    ],
    0,
    fillMaterial,
    lineMaterial
  );

  buildOutlinedShape(
    artGroup,
    [
      [-2, -2],
      [8, -6],
      [34, -31],
      [29, -35],
      [0, -12]
    ],
    -0.18,
    fillMaterial,
    lineMaterial
  );

  buildOutlinedShape(
    artGroup,
    [
      [-5, 9],
      [-18, 20],
      [-30, 18],
      [-11, 8]
    ],
    -0.16,
    fillMaterial,
    lineMaterial
  );

  buildOutlinedShape(
    artGroup,
    [
      [-26, 7],
      [-14, 12],
      [2, 10],
      [-12, 4]
    ],
    -0.14,
    fillMaterial,
    lineMaterial
  );

  buildOutlinedShape(
    artGroup,
    [
      [-20, 8],
      [-16, 24],
      [-12, 23],
      [-14, 8]
    ],
    0.12,
    fillMaterial,
    lineMaterial
  );

  buildOutlinedShape(
    artGroup,
    [
      [-4, 10],
      [2, 13],
      [8, 11],
      [2, 7]
    ],
    0.13,
    fillMaterial,
    lineMaterial
  );

  buildOutlinedShape(
    artGroup,
    [
      [4, 9],
      [10, 12],
      [16, 10],
      [10, 6]
    ],
    0.13,
    fillMaterial,
    lineMaterial
  );

  buildOpenStroke(
    artGroup,
    [
      [12, 14],
      [20, 10],
      [28, 7]
    ],
    0.2,
    lineMaterial
  );

  buildOpenStroke(
    artGroup,
    [
      [-2, -8],
      [-5, -15]
    ],
    0.2,
    lineMaterial
  );

  buildOutlinedShape(
    artGroup,
    [
      [-8.8, -17],
      [-6.6, -19.2],
      [-4.2, -17],
      [-6.6, -14.8]
    ],
    0.16,
    fillMaterial,
    lineMaterial
  );

  propellerGroup.position.set(45, 0, 0.14);
  artGroup.add(propellerGroup);

  buildOutlinedShape(
    propellerGroup,
    [
      [-1.2, -0.6],
      [1.2, -0.6],
      [1.2, 0.6],
      [-1.2, 0.6]
    ],
    0.1,
    fillMaterial,
    lineMaterial
  );

  buildOutlinedShape(
    propellerGroup,
    [
      [0.2, -0.6],
      [1.8, -2.1],
      [3.2, -12.5],
      [1.1, -13.8],
      [-1.3, -3.2]
    ],
    0.08,
    fillMaterial,
    lineMaterial
  );

  buildOutlinedShape(
    propellerGroup,
    [
      [0.2, 0.6],
      [1.8, 2.1],
      [3.2, 12.5],
      [1.1, 13.8],
      [-1.3, 3.2]
    ],
    0.08,
    fillMaterial,
    lineMaterial
  );

  artGroup.scale.set(0.72, 0.72, 0.72);
  flightGroup.rotation.set(THREE.MathUtils.degToRad(-10), THREE.MathUtils.degToRad(20), THREE.MathUtils.degToRad(4));

  return { planeRoot, flightGroup, propellerGroup };
}

function IntroPlaneThree() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 500);
    camera.position.set(0, 0, 172);
    camera.lookAt(0, 0, 0);

    const { planeRoot, flightGroup, propellerGroup } = createPlaneGroup();
    scene.add(planeRoot);

    const trailPoints = 220;
    const trailData = new Float32Array(trailPoints * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailData, 3));
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0x3a3a40,
      transparent: true,
      opacity: 0.48
    });
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    scene.add(trail);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let halfWidth = 80;
    let halfHeight = 46;
    const margin = 15;

    const position = new THREE.Vector2(-38, 16);
    const previousPosition = position.clone();
    const forward = new THREE.Vector2(1, 0.25).normalize();
    const nextPosition = new THREE.Vector2();
    const nextForward = new THREE.Vector2();

    let segment: FlightSegment | null = null;
    let heading = Math.atan2(forward.y, forward.x);
    let previousHeading = heading;
    let roll = 0;
    let pitch = 0;
    let loopCooldownSec = randomBetween(3.4, 5.8);

    for (let i = 0; i < trailPoints; i += 1) {
      const off = i * 3;
      trailData[off] = position.x;
      trailData[off + 1] = position.y;
      trailData[off + 2] = -1.8;
    }
    trailGeometry.attributes.position.needsUpdate = true;

    const randomTargetPoint = () =>
      new THREE.Vector2(
        randomBetween(-halfWidth + margin, halfWidth - margin),
        randomBetween(-halfHeight + margin, halfHeight - margin)
      );

    const createBezierSegment = (start: THREE.Vector2, startDir: THREE.Vector2): BezierSegment => {
      let target = randomTargetPoint();
      let attempts = 0;
      while (attempts < 10 && start.distanceTo(target) < 30) {
        target = randomTargetPoint();
        attempts += 1;
      }

      const centerBias = target.clone().multiplyScalar(-1).normalize();
      const turn = randomBetween(-1.05, 1.05);
      const targetDir = startDir.clone().rotateAround(new THREE.Vector2(0, 0), turn).lerp(centerBias, 0.36).normalize();
      const distance = start.distanceTo(target);
      const handleA = THREE.MathUtils.clamp(distance * 0.42, 18, 62);
      const handleB = THREE.MathUtils.clamp(distance * 0.38, 16, 56);

      return {
        kind: "bezier",
        p0: start.clone(),
        p1: start.clone().add(startDir.clone().multiplyScalar(handleA)),
        p2: target.clone().sub(targetDir.clone().multiplyScalar(handleB)),
        p3: target.clone(),
        duration: Math.max(1.5, distance / randomBetween(23, 33)),
        elapsed: 0
      };
    };

    const createLoopSegment = (start: THREE.Vector2, startDir: THREE.Vector2): LoopSegment | null => {
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const radius = randomBetween(13, 22);
      const ortho = new THREE.Vector2(-startDir.y, startDir.x).multiplyScalar(direction);
      const center = start.clone().add(ortho.multiplyScalar(radius));

      if (
        center.x > halfWidth - margin - radius ||
        center.x < -halfWidth + margin + radius ||
        center.y > halfHeight - margin - radius ||
        center.y < -halfHeight + margin + radius
      ) {
        return null;
      }

      const turns = randomBetween(0.95, 1.24);
      const circumference = Math.PI * 2 * radius * turns;
      return {
        kind: "loop",
        center,
        radius,
        direction,
        turns,
        startAngle: Math.atan2(start.y - center.y, start.x - center.x),
        duration: Math.max(1.55, circumference / randomBetween(24, 31)),
        elapsed: 0
      };
    };

    const spawnNextSegment = () => {
      const inSafeZone = Math.abs(position.x) < halfWidth * 0.64 && Math.abs(position.y) < halfHeight * 0.64;
      if (!reducedMotion && inSafeZone && loopCooldownSec <= 0 && Math.random() > 0.56) {
        const loop = createLoopSegment(position, forward);
        if (loop) {
          segment = loop;
          loopCooldownSec = randomBetween(4.5, 7.2);
          return;
        }
      }
      segment = createBezierSegment(position, forward);
    };

    const updateViewport = () => {
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const distance = camera.position.z;
      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      halfHeight = Math.tan(fovRad * 0.5) * distance;
      halfWidth = halfHeight * camera.aspect;
    };

    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      const dt = Math.min(0.022, clock.getDelta());
      previousPosition.copy(position);
      loopCooldownSec -= dt;

      if (!segment) spawnNextSegment();

      if (reducedMotion) {
        const t = clock.elapsedTime;
        nextPosition.set(Math.cos(t * 0.52) * (halfWidth * 0.48), Math.sin(t * 0.71) * (halfHeight * 0.34));
        nextForward.set(
          -Math.sin(t * 0.52) * 0.52 * halfWidth * 0.48,
          Math.cos(t * 0.71) * 0.71 * halfHeight * 0.34
        );
      } else if (segment?.kind === "bezier") {
        segment.elapsed += dt;
        const t = Math.min(1, segment.elapsed / segment.duration);
        nextPosition.copy(bezierPoint(t, segment.p0, segment.p1, segment.p2, segment.p3));
        nextForward.copy(bezierTangent(t, segment.p0, segment.p1, segment.p2, segment.p3));
        if (t >= 1) segment = null;
      } else if (segment?.kind === "loop") {
        segment.elapsed += dt;
        const t = Math.min(1, segment.elapsed / segment.duration);
        const angle = segment.startAngle + segment.direction * t * segment.turns * Math.PI * 2;
        nextPosition.set(
          segment.center.x + Math.cos(angle) * segment.radius,
          segment.center.y + Math.sin(angle) * segment.radius
        );
        nextForward.set(-Math.sin(angle) * segment.direction, Math.cos(angle) * segment.direction);
        if (t >= 1) segment = null;
      }

      if (nextForward.lengthSq() < 0.00001) nextForward.copy(forward);
      nextForward.normalize();
      forward.lerp(nextForward, clamp01(dt * 7.2)).normalize();
      position.copy(nextPosition);

      heading = Math.atan2(forward.y, forward.x);
      const deltaHeading = shortestAngleDelta(heading, previousHeading);
      previousHeading = heading;
      const verticalSpeed = (position.y - previousPosition.y) / Math.max(0.0001, dt);

      roll = THREE.MathUtils.lerp(roll, THREE.MathUtils.clamp(deltaHeading * 4.3, -0.42, 0.42), clamp01(dt * 7.3));
      pitch = THREE.MathUtils.lerp(
        pitch,
        THREE.MathUtils.clamp(verticalSpeed * 0.0046, -0.18, 0.18),
        clamp01(dt * 6.8)
      );

      planeRoot.position.set(position.x, position.y, 1.6);
      planeRoot.rotation.z = heading;
      flightGroup.rotation.x = roll;
      flightGroup.rotation.y = -pitch;
      propellerGroup.rotation.x += dt * 22;

      const trailAnchorX = position.x - forward.x * 23;
      const trailAnchorY = position.y - forward.y * 23;
      for (let i = trailPoints - 1; i > 0; i -= 1) {
        const to = i * 3;
        const from = (i - 1) * 3;
        trailData[to] = trailData[from];
        trailData[to + 1] = trailData[from + 1];
        trailData[to + 2] = trailData[from + 2];
      }
      trailData[0] = trailAnchorX;
      trailData[1] = trailAnchorY;
      trailData[2] = -1.8;
      trailGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    updateViewport();
    animate();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.cancelAnimationFrame(rafId);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.LineSegments)) {
          return;
        }
        if (object.geometry) object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else if (object.material) {
          object.material.dispose();
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />;
}

export default IntroPlaneThree;
