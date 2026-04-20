/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, Decal } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import cardGLB from '../assets/lanyard/card.glb';
import azurTextureMap from '../assets/lanyard/azur.png';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

type Vector3Tuple = [number, number, number];

type LanyardProps = {
  position?: Vector3Tuple;
  gravity?: Vector3Tuple;
  fov?: number;
  transparent?: boolean;
  className?: string;
};

export default function Lanyard({
  position = [0, 0, 24],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  className = '',
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`lanyard-wrapper ${className}`.trim()}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
        }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
}) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const hookWorld = new THREE.Vector3();
  const hookLocal = new THREE.Vector3(0, 1.5, 0);
  const cardQuat = new THREE.Quaternion();

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };
  const segmentLength = 1.15;

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const cardTexture = useTexture(azurTextureMap);
  const decalConfig = useMemo(() => {
    const geometry = nodes?.card?.geometry as THREE.BufferGeometry | undefined;
    if (!geometry) {
      return {
        position: [0, 0, 0.03] as [number, number, number],
        scale: [1.0, 1.0, 1] as [number, number, number],
      };
    }

    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    if (!bounds) {
      return {
        position: [0, 0, 0.03] as [number, number, number],
        scale: [1.0, 1.0, 1] as [number, number, number],
      };
    }

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(center);

    // Keep decal square so the whole texture is visible inside the vertical card.
    const squareSize = Math.min(size.x, size.y) * 0.82;
    return {
      position: [center.x, center.y, center.z + 0.03] as [number, number, number],
      scale: [squareSize, squareSize, 1] as [number, number, number],
    };
  }, [nodes]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], segmentLength]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, dragged]);

  useEffect(() => {
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.wrapS = THREE.ClampToEdgeWrapping;
    cardTexture.wrapT = THREE.ClampToEdgeWrapping;
    cardTexture.anisotropy = isMobile ? 4 : 16;
    cardTexture.flipY = true;
    cardTexture.repeat.set(1, 1);
    cardTexture.offset.set(0, 0);
    cardTexture.needsUpdate = true;
  }, [cardTexture, isMobile]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (!fixed.current || !band.current) return;

    [j1, j2].forEach((ref) => {
      const segment = ref.current as any;
      if (!segment?.lerped) segment.lerped = new THREE.Vector3().copy(segment.translation());
      const clampedDistance = Math.max(
        0.1,
        Math.min(1, segment.lerped.distanceTo(segment.translation()))
      );
      segment.lerped.lerp(
        segment.translation(),
        delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
      );
    });

    const cardPos = card.current.translation();
    const cardRot = card.current.rotation();
    cardQuat.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
    hookWorld.copy(hookLocal).applyQuaternion(cardQuat).add(cardPos);

    curve.points[0].copy(hookWorld);
    curve.points[1].copy(j3.current.translation());
    curve.points[2].copy((j2.current as any).lerped);
    curve.points[3].copy((j1.current as any).lerped);
    curve.points[4].copy(fixed.current.translation());
    (band.current.geometry as any).setPoints(curve.getPoints(isMobile ? 16 : 32));

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
  });

  curve.curveType = 'chordal';
  return (
    <>
      <group position={[0, 6.2, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -segmentLength, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -segmentLength * 2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -segmentLength * 3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -segmentLength * 4, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(event) => {
              event.target.releasePointerCapture(event.pointerId);
              setDragged(false);
            }}
            onPointerDown={(event) => {
              event.target.setPointerCapture(event.pointerId);
              const offset = new THREE.Vector3()
                .copy(event.point)
                .sub(vec.copy(card.current.translation()));
              setDragged(offset);
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                color="#d9d9d9"
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.15}
              />
              <Decal
                position={decalConfig.position}
                rotation={[0, 0, 0]}
                scale={decalConfig.scale}
                map={cardTexture}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#0b0b0b"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          lineWidth={1.8}
          opacity={0.98}
          transparent
        />
      </mesh>
    </>
  );
}

useGLTF.preload(cardGLB);
