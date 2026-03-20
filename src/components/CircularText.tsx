import { useEffect, useRef, type CSSProperties } from "react";
import { motion, useAnimation } from "framer-motion";
import "./CircularText.css";

type CircularTextHoverMode = "slowDown" | "speedUp" | "pause" | "goBonkers";

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: CircularTextHoverMode | null;
  className?: string;
  size?: number;
  fontSize?: number;
}

const getRotationTransition = (duration: number, from: number, loop = true) => ({
  from,
  to: from + 360,
  ease: "linear",
  duration,
  type: "tween" as const,
  repeat: loop ? Infinity : 0
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring" as const,
    damping: 20,
    stiffness: 300
  }
});

function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
  size,
  fontSize
}: CircularTextProps) {
  const letters = Array.from(text);
  const effectiveSize = size ?? 120;
  const radius = Math.max(16, effectiveSize * 0.42);
  const controls = useAnimation();
  const rotationRef = useRef(0);
  const styleVars: CSSProperties = {};

  if (typeof size === "number") {
    (styleVars as Record<string, string>)["--circular-size"] = `${size}px`;
  }

  if (typeof fontSize === "number") {
    (styleVars as Record<string, string>)["--circular-font-size"] = `${fontSize}px`;
  }

  useEffect(() => {
    const start = rotationRef.current;
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, text, onHover, controls]);

  const handleHoverStart = () => {
    if (!onHover) return;
    const start = rotationRef.current;

    let transitionConfig = getTransition(spinDuration, start);
    let scaleVal = 1;

    switch (onHover) {
      case "slowDown":
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case "pause":
        transitionConfig = {
          rotate: { type: "spring", damping: 20, stiffness: 300 },
          scale: { type: "spring", damping: 20, stiffness: 300 }
        };
        break;
      case "goBonkers":
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.82;
        break;
      default:
        break;
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig
    });
  };

  const handleHoverEnd = () => {
    const start = rotationRef.current;
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`.trim()}
      style={styleVars}
      initial={{ rotate: 0 }}
      animate={controls}
      onUpdate={(latest) => {
        if (typeof latest.rotate === "number") {
          rotationRef.current = latest.rotate;
        }
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, index) => {
        const rotationDeg = (360 / Math.max(1, letters.length)) * index;
        const transform = `translate(-50%, -50%) rotate(${rotationDeg}deg) translateY(-${radius}px)`;

        return (
          <span key={`${letter}-${index}`} style={{ transform, WebkitTransform: transform }}>
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
}

export default CircularText;
