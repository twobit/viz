"use client";

import { Suspense, useRef } from "react";
import WebGPUScene from "./webgpu-scene";

export const WebGPUApp = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);

  return (
    <main
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Suspense fallback={null}>
        <WebGPUScene
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
          }}
          eventSource={ref}
          eventPrefix="client"
        >
          {children}
        </WebGPUScene>
      </Suspense>
    </main>
  );
};
