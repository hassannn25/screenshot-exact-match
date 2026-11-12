import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { Sneaker3DProps } from "./Sneaker3D";

const Sneaker3D = lazy(() => import("./Sneaker3D"));

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Renders the WebGL sneaker after hydration. Shows `fallback` (a still image)
 * during SSR, while the model loads, and permanently when WebGL is unavailable.
 */
export function Sneaker3DStage({ fallback, ...props }: Sneaker3DProps & { fallback: ReactNode }) {
  return (
    <ClientOnly fallback={fallback}>
      <Stage fallback={fallback} {...props} />
    </ClientOnly>
  );
}

function Stage({ fallback, ...props }: Sneaker3DProps & { fallback: ReactNode }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setSupported(hasWebGL()), []);

  if (supported === false) return <>{fallback}</>;
  return (
    <div className="relative h-full w-full">
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        aria-hidden={ready}
      >
        {fallback}
      </div>
      {supported && (
        <Suspense fallback={null}>
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
            <Sneaker3D {...props} onReady={() => setReady(true)} />
          </div>
        </Suspense>
      )}
    </div>
  );
}
