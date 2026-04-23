import React, { type CSSProperties, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type GradualBlurProps = PropsWithChildren<{
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
  responsive?: boolean;
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
  preset?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "subtle"
    | "intense"
    | "smooth"
    | "sharp"
    | "header"
    | "footer"
    | "sidebar"
    | "page-header"
    | "page-footer";
  gpuOptimized?: boolean;
  hoverIntensity?: number;
  target?: "parent" | "page";
  onAnimationComplete?: () => void;
  className?: string;
  style?: CSSProperties;
}>;

const DEFAULT_CONFIG: Partial<GradualBlurProps> = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  responsive: false,
  target: "parent",
  className: "",
  style: {}
};

const PRESETS: Record<string, Partial<GradualBlurProps>> = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
  sidebar: { position: "left", height: "6rem", strength: 2.5 },
  "page-header": {
    position: "top",
    height: "10rem",
    target: "page",
    strength: 3
  },
  "page-footer": {
    position: "bottom",
    height: "10rem",
    target: "page",
    strength: 3
  }
};

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
};

const mergeConfigs = (...configs: Partial<GradualBlurProps>[]): Partial<GradualBlurProps> =>
  configs.reduce((acc, config) => ({ ...acc, ...config }), {});

const getGradientDirection = (position: string): string => {
  const directions: Record<string, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right"
  };
  return directions[position] || "to bottom";
};

const debounce = <T extends (...args: never[]) => void>(fn: T, wait: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};

const useResponsiveDimension = (
  responsive: boolean | undefined,
  config: Partial<GradualBlurProps>,
  key: keyof GradualBlurProps
) => {
  const [value, setValue] = useState(config[key]);

  useEffect(() => {
    if (!responsive) return;

    const calculate = () => {
      const viewportWidth = window.innerWidth;
      let nextValue = config[key];
      const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
      const keySuffix = capitalize(String(key));

      if (viewportWidth <= 480 && (config as Record<string, unknown>)[`mobile${keySuffix}`]) {
        nextValue = (config as Record<string, unknown>)[`mobile${keySuffix}`] as typeof nextValue;
      } else if (viewportWidth <= 768 && (config as Record<string, unknown>)[`tablet${keySuffix}`]) {
        nextValue = (config as Record<string, unknown>)[`tablet${keySuffix}`] as typeof nextValue;
      } else if (viewportWidth <= 1024 && (config as Record<string, unknown>)[`desktop${keySuffix}`]) {
        nextValue = (config as Record<string, unknown>)[`desktop${keySuffix}`] as typeof nextValue;
      }

      setValue(nextValue);
    };

    const debouncedCalculate = debounce(calculate, 100);
    calculate();
    window.addEventListener("resize", debouncedCalculate);

    return () => window.removeEventListener("resize", debouncedCalculate);
  }, [responsive, config, key]);

  return responsive ? value : config[key];
};

const useIntersectionObserver = (ref: React.RefObject<HTMLDivElement>, shouldObserve = false) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
};

const GradualBlur: React.FC<GradualBlurProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props) as Required<GradualBlurProps>;
  }, [props]);

  const responsiveHeight = useResponsiveDimension(config.responsive, config, "height");
  const responsiveWidth = useResponsiveDimension(config.responsive, config, "width");
  const isVisible = useIntersectionObserver(
    containerRef,
    config.animated === "scroll" && config.target !== "page"
  );

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / config.divCount;
    const currentStrength =
      isHovered && config.hoverIntensity ? config.strength * config.hoverIntensity : config.strength;
    const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= config.divCount; i += 1) {
      let progress = i / config.divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Number(Math.pow(2, progress * 4)) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * config.divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);
      const divStyle: CSSProperties = {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined
      };

      divs.push(<div key={i} className="absolute inset-0" style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  const containerStyle: CSSProperties = useMemo(() => {
    const isVertical = ["top", "bottom"].includes(config.position);
    const isHorizontal = ["left", "right"].includes(config.position);
    const isPageTarget = config.target === "page";

    const style: CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style
    };

    if (isVertical) {
      style.height = responsiveHeight as CSSProperties["height"];
      style.width = (responsiveWidth || "100%") as CSSProperties["width"];
      style[config.position] = 0;
      style.left = 0;
      style.right = 0;
    } else if (isHorizontal) {
      style.width = (responsiveWidth || responsiveHeight) as CSSProperties["width"];
      style.height = "100%";
      style[config.position] = 0;
      style.top = 0;
      style.bottom = 0;
    }

    return style;
  }, [config, responsiveHeight, responsiveWidth, isVisible]);

  useEffect(() => {
    if (isVisible && config.animated === "scroll" && config.onAnimationComplete) {
      const timeout = setTimeout(() => config.onAnimationComplete?.(), parseFloat(config.duration) * 1000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isVisible, config]);

  useEffect(() => {
    if (config.target !== "page" || typeof document === "undefined") {
      setPortalRoot(null);
      return;
    }
    setPortalRoot(document.body);
  }, [config.target]);

  const blurNode = (
    <div
      ref={containerRef}
      className={`gradual-blur relative isolate ${
        config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent"
      } ${config.className}`}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="relative h-full w-full">{blurDivs}</div>
      {props.children && <div className="relative">{props.children}</div>}
    </div>
  );

  if (config.target === "page" && portalRoot) {
    return createPortal(blurNode, portalRoot);
  }

  return blurNode;
};

const GradualBlurMemo = React.memo(GradualBlur);
GradualBlurMemo.displayName = "GradualBlur";
export default GradualBlurMemo;

const injectStyles = () => {
  if (typeof document === "undefined") return;
  const id = "gradual-blur-styles";
  if (document.getElementById(id)) return;

  const styleElement = document.createElement("style");
  styleElement.id = id;
  styleElement.textContent =
    ".gradual-blur{pointer-events:none;transition:opacity .3s ease-out}.gradual-blur-inner{pointer-events:none}";
  document.head.appendChild(styleElement);
};

if (typeof document !== "undefined") {
  injectStyles();
}
