import { Canvas } from "@react-three/fiber";

import { AdaptiveDpr, Preload, StatsGl } from "@react-three/drei";
import { OrthographicCamera } from "@react-three/drei";

import { useRef } from "react";

import { WebGPURenderer } from "three/webgpu";
import { ColorSpaceCorrection } from "./color-space-correction";
import { useInView } from "motion/react";

type SceneProps = {
  debug?: boolean;
  frameloop?: "always" | "demand" | "never";
} & any;

/**
 * WebGPUScene
 *
 * Renders a three.js scene using the WebGPURenderer inside a @react-three/fiber Canvas.
 *
 * @param {SceneProps} props - Scene configuration props
 * @param {boolean} [props.debug=false] - Show WebGL stats overlay
 * @param {'always'|'demand'|'never'} [props.frameloop='always'] - Canvas render loop mode
 * @param {boolean} [props.orthographic=false] - Use orthographic camera (not currently used)
 * @param {React.ReactNode} props.children - Scene children
 * @returns {JSX.Element}
 *
 * Notes:
 * - Uses WebGPURenderer (three.js) for next-gen rendering
 * - Handles color space and tone mapping for WebGPU
 * - Preloads assets and adapts DPR
 */
const WebGPUScene = ({
  id = "__webgpucanvas",
  debug = false,
  frameloop = "always",
  orthographic = false,
  children,
  ...props
}: SceneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(canvasRef, { margin: "50px" });

  // More aggressive frameloop control
  const canvasFrameloop = isInView ? frameloop : "never";

  return (
    <Canvas
      id={id}
      {...props}
      frameloop={canvasFrameloop}
      // Reduce DPR when not in view
      dpr={isInView ? undefined : 1}
      gl={async (props) => {
        const renderer = new WebGPURenderer(props as any);
        await renderer.init();
        return renderer;
      }}
      ref={canvasRef}
    >
      <Preload all />

      <AdaptiveDpr pixelated />

      {children}

      <ColorSpaceCorrection />

      {debug ? <StatsGl className="fragments-supply__statsgl" /> : null}

      <OrthographicCamera makeDefault position={[0, 0, 10]} />
    </Canvas>
  );
};

export default WebGPUScene;
