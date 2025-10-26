import { Sketch, SketchName } from "@/components/sketch";

export default function Page({ searchParams }: { searchParams: { sketch: string } }) {
  const sketch = searchParams.sketch as SketchName || "flare1";
  return (
    <Sketch sketchName={sketch} />
  );
}
