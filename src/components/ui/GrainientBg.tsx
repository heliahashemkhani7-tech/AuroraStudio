import Grainient from "../animiations/Grainient";

export default function GrainientBg() {
  return (
    <div className="fixed w-full h-full">
      <Grainient
        color1="var(--color1)"
        color2="var(--color2)"
        color3="var(--color3)"
        timeSpeed={0.25}
        colorBalance={0}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.5}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
    </div>
  );
}
