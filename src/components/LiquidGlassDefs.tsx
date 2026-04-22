function LiquidGlassDefs() {
  return (
    <svg className="pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id="liquid-glass-distortion"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves="2"
            seed="2"
            stitchTiles="stitch"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="14s"
              values="0.008 0.012;0.014 0.02;0.008 0.012"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feGaussianBlur in="noise" stdDeviation="0.55" result="smoothedNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothedNoise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter
          id="work-fluid-distortion"
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.03"
            numOctaves="3"
            seed="7"
            stitchTiles="stitch"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="6s"
              values="0.02 0.03;0.03 0.045;0.018 0.028;0.02 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feGaussianBlur in="noise" stdDeviation="0.85" result="smoothedNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="smoothedNoise"
            scale="42"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default LiquidGlassDefs;
