import { Sketch, SketchName } from "@/components/sketch";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Sketch sketchName={id as SketchName} />
  );
}
