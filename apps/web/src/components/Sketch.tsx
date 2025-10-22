"use client";

import { WebGPUSketch } from "./canvas/webgpu-sketch";
import { WebGPUApp } from "./canvas/webgpu-app";
import { useEffect, useState } from "react";

const sketches = {
  flare1: async () => (await import("@/sketches/flare-1")).default,
  dawn1: async () => (await import("@/sketches/nested/dawn-1")).default,
  genuary1: async () => (await import("@/sketches/genuary/genuary-1")).default,
};

export const Sketch = ({
  sketchName = "flare1",
}: {
  sketchName?: keyof typeof sketches;
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
