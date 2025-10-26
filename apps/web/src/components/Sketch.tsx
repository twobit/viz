"use client";

import { WebGPUSketch } from "./canvas/webgpu-sketch";
import { WebGPUApp } from "./canvas/webgpu-app";
import { useEffect, useState } from "react";

const sketches = {
  flare1: async () => (await import("@/sketches/flare1")).default,
  dawn1: async () => (await import("@/sketches/nested/dawn1")).default,
  mesh1: async () => (await import("@/sketches/mesh1")).default,
  genuary1: async () => (await import("@/sketches/genuary/genuary1")).default,
  genuary30: async () => (await import("@/sketches/genuary/genuary30")).default,
};

export type SketchName = keyof typeof sketches;

export const Sketch = ({
  sketchName = "flare1",
}: {
  sketchName?: SketchName;
}) => {
  const [sketch, setSketch] = useState<any>(null);

  useEffect(() => {
    const loadSketch = async () => {
      const _sketch = await sketches[sketchName]();
      setSketch(_sketch);
    };
    loadSketch();
  }, [sketchName]);

  return (
    <WebGPUApp>{sketch && <WebGPUSketch colorNode={sketch} />}</WebGPUApp>
  );
};
