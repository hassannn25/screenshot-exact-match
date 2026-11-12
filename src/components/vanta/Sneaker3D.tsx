/**
 * Browser-only 3D sneaker scene. Never import this statically from a route:
 * load it through <Sneaker3DStage> which lazy-imports it after hydration.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  PresentationControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import sneakerAsset from "@/assets/vanta-sneaker.glb.asset.json";

export type SneakerVariant = "midnight" | "beach" | "street";

export interface Hotspot {
  id: string;
  title: string;
  copy: string;
  position: [number, number, number];
}

interface ModelProps {
  variant: SneakerVariant;
  autoRotate: boolean;
  pointerTilt: boolean;
  hotspots?: Hotspot[] | undefined;
  activeHotspot?: string | null | undefined;
  onHotspot?: ((id: string | null) => void) | undefined;
}

const MODEL_URL = sneakerAsset.url;
const VARIANT_INDEX: Record<SneakerVariant, number> = { midnight: 0, beach: 1, street: 2 };

function SneakerModel({ variant, autoRotate, pointerTilt, hotspots, activeHotspot, onHotspot }: ModelProps) {
  const gltf = useGLTF(MODEL_URL);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const [materials, setMaterials] = useState<THREE.Material[] | null>(null);

  // Resolve the KHR_materials_variants materials once.
  useEffect(() => {
    let alive = true;
    const mesh = scene.getObjectByProperty("type", "Mesh") as THREE.Mesh | undefined;
    const mappings = (mesh?.userData?.["gltfExtensions"]?.KHR_materials_variants?.mappings ?? []) as {
      material: number;
      variants: number[];
    }[];
    if (!mappings.length) return;
    Promise.all(
      [0, 1, 2].map((vi) => {
        const m = mappings.find((x) => x.variants.includes(vi));
        return m ? (gltf.parser.getDependency("material", m.material) as Promise<THREE.Material>) : null;
      }),
    ).then((mats) => {
      if (alive) setMaterials(mats.filter(Boolean) as THREE.Material[]);
    });
    return () => {
      alive = false;
    };
  }, [scene, gltf.parser]);

  useEffect(() => {
    if (!materials) return;
    const mat = materials[VARIANT_INDEX[variant]];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && mat) {
        m.material = mat;
        m.castShadow = true;
      }
    });
  }, [materials, variant, scene]);

  useFrame((state, delta) => {
    if (spin.current && autoRotate) spin.current.rotation.y += delta * 0.25;
    if (group.current && pointerTilt) {
      const { x, y } = state.pointer;
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -y * 0.18, 3, delta);
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, x * 0.08, 3, delta);
      group.current.position.x = THREE.MathUtils.damp(group.current.position.x, x * 0.15, 3, delta);
    }
  });

  return (
    <group ref={group}>
      <group ref={spin} rotation={[0, -0.6, 0]}>
        <group scale={13} position={[0, -1, 0]}>
          <primitive object={scene} />
          {hotspots?.map((h) => (
            <Html key={h.id} position={h.position} center zIndexRange={[20, 0]}>
              <button
                type="button"
                aria-label={h.title}
                onClick={() => onHotspot?.(activeHotspot === h.id ? null : h.id)}
                className="group relative grid size-7 place-items-center rounded-full"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-foreground/30" />
                <span
                  className={`relative grid size-5 place-items-center rounded-full border border-foreground/60 transition-all duration-300 ${
                    activeHotspot === h.id ? "bg-signal" : "bg-background/70 backdrop-blur"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-foreground" />
                </span>
              </button>
            </Html>
          ))}
        </group>
      </group>
    </group>
  );
}

function ResponsiveCamera({ mobileZ, desktopZ }: { mobileZ: number; desktopZ: number }) {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.position.z = size.width < 768 ? mobileZ : desktopZ;
    camera.updateProjectionMatrix();
  }, [size.width, camera, mobileZ, desktopZ]);
  return null;
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 2, 1]} form="rect" />
      <Lightformer intensity={1.2} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer intensity={1.6} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[6, 1, 1]} />
      <Lightformer intensity={0.6} color="#d9b38c" position={[0, -2, -4]} scale={[10, 2, 1]} />
    </Environment>
  );
}

export interface Sneaker3DProps {
  mode: "hero" | "showcase";
  variant?: SneakerVariant | undefined;
  hotspots?: Hotspot[] | undefined;
  activeHotspot?: string | null | undefined;
  onHotspot?: ((id: string | null) => void) | undefined;
  onReady?: (() => void) | undefined;
}

function ReadySignal({ onReady }: { onReady?: (() => void) | undefined }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export default function Sneaker3D({
  mode,
  variant = "midnight",
  hotspots,
  activeHotspot,
  onHotspot,
  onReady,
}: Sneaker3DProps) {
  const isHero = mode === "hero";
  const [mobile] = useState(() => window.innerWidth < 768);

  return (
    <Canvas
      shadows={!mobile}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0.6, isHero ? 6 : 5.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: isHero ? "auto" : "pan-y" }}
    >
      <ResponsiveCamera mobileZ={isHero ? 8.5 : 7} desktopZ={isHero ? 6.8 : 5.4} />
      <ambientLight intensity={0.25} />
      <spotLight
        position={[4, 6, 4]}
        angle={0.35}
        penumbra={1}
        intensity={60}
        castShadow={!mobile}
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight position={[-5, 3, -3]} angle={0.4} penumbra={1} intensity={25} color="#cfd8e6" />
      <Suspense fallback={null}>
        {isHero ? (
          <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.6} floatingRange={[-0.05, 0.12]}>
            <SneakerModel variant={variant} autoRotate pointerTilt={!mobile} />
          </Float>
        ) : (
          <PresentationControls
            global={false}
            cursor
            snap={false}
            speed={1.4}
            zoom={1}
            rotation={[0.08, 0, 0]}
            polar={[-0.2, 0.3]}
            azimuth={[-Infinity, Infinity]}
          >
            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.35}>
              <SneakerModel
                variant={variant}
                autoRotate={!activeHotspot}
                pointerTilt={false}
                hotspots={hotspots}
                activeHotspot={activeHotspot}
                onHotspot={onHotspot}
              />
            </Float>
          </PresentationControls>
        )}
        <ContactShadows position={[0, -1.15, 0]} opacity={0.75} scale={8} blur={2.6} far={2.5} resolution={mobile ? 256 : 512} />
        <Studio />
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
