import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const vertexSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_progress;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv - 0.5;
    float aspect = u_resolution.x / u_resolution.y;
    p.x *= aspect;

    float dist = length(p);
    float n = noise(uv * 3.2 + u_time * 0.25);
    float wave = sin((uv.x + uv.y) * 12.0 + u_time * 1.4) * 0.02;
    float radius = mix(0.0, 1.35, u_progress);
    float edge = radius + n * 0.08 + wave;

    float mask = smoothstep(edge - 0.12, edge + 0.12, dist);
    float alpha = mask * 0.9;

    vec3 color = vec3(0.02, 0.02, 0.03);
    gl_FragColor = vec4(color, alpha);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function WebGLTransition() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef({ value: 1 });
  const location = useLocation();
  const isFirstLoad = useRef(true);
  const prefersReducedMotion = useRef(false);
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const uniformRef = useRef<{
    resolutionLocation: WebGLUniformLocation | null;
    timeLocation: WebGLUniformLocation | null;
    progressLocation: WebGLUniformLocation | null;
  }>({
    resolutionLocation: null,
    timeLocation: null,
    progressLocation: null
  });
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const drawFrame = useCallback((now: number) => {
    const gl = glRef.current;
    if (!gl) return;
    const { timeLocation, progressLocation } = uniformRef.current;
    const elapsed = (now - startTimeRef.current) / 1000;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (timeLocation !== null) gl.uniform1f(timeLocation, elapsed);
    if (progressLocation !== null) gl.uniform1f(progressLocation, progressRef.current.value);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, []);

  const render = useCallback(
    (now: number) => {
      drawFrame(now);
      if (isAnimatingRef.current) {
        rafRef.current = requestAnimationFrame(render);
      } else {
        rafRef.current = null;
      }
    },
    [drawFrame]
  );

  const startLoop = useCallback(() => {
    if (rafRef.current !== null || !glRef.current) return;
    isAnimatingRef.current = true;
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(render);
  }, [render]);

  const stopLoop = useCallback(() => {
    isAnimatingRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      prefersReducedMotion.current = reduceMotionQuery.matches;
      setIsEnabled(!reduceMotionQuery.matches);
      if (reduceMotionQuery.matches) {
        stopLoop();
      }
    };

    update();
    reduceMotionQuery.addEventListener('change', update);

    return () => {
      reduceMotionQuery.removeEventListener('change', update);
    };
  }, [stopLoop]);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsEnabled(false);
      return;
    }
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) {
      setIsEnabled(false);
      return;
    }

    const program = createProgram(gl, vertexSource, fragmentSource);
    if (!program) {
      setIsEnabled(false);
      return;
    }

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const progressLocation = gl.getUniformLocation(program, 'u_progress');
    if (positionLocation === -1) {
      setIsEnabled(false);
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    glRef.current = gl;
    uniformRef.current = {
      resolutionLocation,
      timeLocation,
      progressLocation
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (resolutionLocation !== null) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
      startTimeRef.current = performance.now();
      drawFrame(startTimeRef.current);
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      stopLoop();
      glRef.current = null;
      uniformRef.current = {
        resolutionLocation: null,
        timeLocation: null,
        progressLocation: null
      };
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [drawFrame, isEnabled, stopLoop]);

  useEffect(() => {
    if (!isEnabled || prefersReducedMotion.current) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    progressRef.current.value = 0;
    gsap.killTweensOf(progressRef.current);
    startLoop();
    gsap.to(progressRef.current, {
      value: 1,
      duration: 1.05,
      ease: 'power3.out',
      onComplete: () => {
        drawFrame(performance.now());
        stopLoop();
      }
    });
  }, [drawFrame, isEnabled, location.pathname, startLoop, stopLoop]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="webgl-transition-canvas"
      aria-hidden="true"
    />
  );
}

export default WebGLTransition;
