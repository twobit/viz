"use client";

import { WebGPUSketch } from "./canvas/webgpu-sketch";
import { WebGPUApp } from "./canvas/webgpu-app";

import flare1 from "@/sketches/flare-1";
import dawn1  from "@/sketches/nested/dawn-1";

export const Sketch = () => {
  return (
    <WebGPUApp>
      <WebGPUSketch colorNode={dawn1()} />
    </WebGPUApp>
  );
};
