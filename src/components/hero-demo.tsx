"use client";

import { useEffect, useState } from "react";
import {
  CameraScreen,
  LabelsScreen,
  PhoneFrame,
} from "@/components/phone-screens";

export function HeroDemo() {
  const [reading, setReading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(
      () => setReading((current) => !current),
      reading ? 2800 : 6500,
    );
    return () => clearTimeout(timer);
  }, [reading]);

  return (
    <div className="relative">
      <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.15_80/0.35),transparent_65%)] blur-2xl" />
      <PhoneFrame className="floating">
        {reading ? <CameraScreen /> : <LabelsScreen />}
      </PhoneFrame>
    </div>
  );
}
