import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VoidCanvasProps {
  scrollProgress: number;
  scrollVelocity: number;
  manualFormationId: number | null; // null = follow scroll
  onActiveFormationChange?: (id: number) => void;
  isDark?: boolean;
}

const VERT = `
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PHI 1.618033988749

attribute float aIndex;
attribute float aSize;
attribute float aPhase;

uniform float uCount;
uniform float uFormA;
uniform float uFormB;
uniform float uMix;
uniform float uTime;
uniform vec3 uMouse;
uniform float uMouseRadius;
uniform float uPointSize;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uScrollVel;
uniform float uIsDark;

varying vec3 vColor;
varying float vAlpha;

float hash(float n) { return fract(sin(n + 0.1) * 43758.5453); }

vec3 formSphere(float i, float n) {
    float p = acos(1.0 - 2.0 * (i + 0.5) / n);
    float t = PI2 * PHI * i;
    float r = 2.8 + hash(i * 6.7) * 0.4;
    return r * vec3(sin(p)*cos(t), sin(p)*sin(t), cos(p));
}
vec3 formHelix(float i, float n) {
    float t = i / n * PI2 * 4.0;
    float s = floor(mod(i, 3.0));
    float r = 1.2 + hash(i * 3.1) * 0.3;
    return vec3(r * cos(t + s * PI2 / 3.0), (i/n - 0.5) * 7.0, r * sin(t + s * PI2 / 3.0));
}
vec3 formGrid(float i, float n) {
    float side = ceil(sqrt(n));
    float x = (mod(i, side) / side - 0.5) * 7.0;
    float z = (floor(i / side) / side - 0.5) * 7.0;
    return vec3(x, sin(x * 1.2 + z * 0.8) * cos(z) * 0.6, z);
}
vec3 formTorus(float i, float n) {
    float t = i / n * PI2;
    float R = 2.2, r = 0.8 + hash(i * 2.9) * 0.2;
    return vec3((R + r * cos(3.0*t)) * cos(2.0*t), (R + r * cos(3.0*t)) * sin(2.0*t), r * sin(3.0*t));
}
vec3 formGalaxy(float i, float n) {
    float arm = floor(mod(i, 4.0));
    float t = i / n;
    float r = pow(t, 0.5) * 3.5;
    float a = t * 12.0 + arm * PI2 / 4.0;
    float sc = hash(i * 5.1) * 0.4;
    return vec3(r*cos(a)+(hash(i*2.3)-0.5)*sc, (hash(i*8.7)-0.5)*0.3, r*sin(a)+(hash(i*4.1)-0.5)*sc);
}
vec3 formVortex(float i, float n) {
    float t = i / n;
    float a = t * PI2 * 8.0;
    float r = (1.0 - t) * 3.5;
    return vec3(r * cos(a), (t - 0.5) * 5.0, r * sin(a));
}
vec3 getForm(float id, float i, float n) {
    if (id < 0.5) return formSphere(i, n);
    if (id < 1.5) return formHelix(i, n);
    if (id < 2.5) return formGrid(i, n);
    if (id < 3.5) return formTorus(i, n);
    if (id < 4.5) return formGalaxy(i, n);
    return formVortex(i, n);
}

void main() {
    vec3 posA = getForm(uFormA, aIndex, uCount);
    vec3 posB = getForm(uFormB, aIndex, uCount);
    float t = uMix * uMix * (3.0 - 2.0 * uMix);
    vec3 pos = mix(posA, posB, t);

    pos += vec3(sin(uTime*0.5+aPhase*PI2)*0.1, cos(uTime*0.4+aPhase*4.17)*0.1, sin(uTime*0.3+aPhase*5.03)*0.1);

    float vel = min(uScrollVel, 3.0);
    pos += vec3(sin(aPhase*20.0+uTime*2.0), cos(aPhase*15.0+uTime*1.5), sin(aPhase*25.0+uTime*1.8)) * vel * 0.06;

    vec3 diff = pos - uMouse;
    float dist = length(diff);
    if (dist < uMouseRadius && dist > 0.001) {
        float f = 1.0 - dist / uMouseRadius;
        pos += normalize(diff) * f * f * f * 1.0;
    }

    vColor = mix(uColorA, uColorB, t) * (0.75 + hash(aIndex * 7.3) * 0.25);
    if (dist < uMouseRadius) {
        if (uIsDark > 0.5) {
            vColor += (1.0 - dist/uMouseRadius) * 0.25;
        } else {
            vColor = mix(vColor, vec3(0.05, 0.05, 0.08), (1.0 - dist/uMouseRadius) * 0.35);
        }
    }

    if (uIsDark > 0.5) {
        vAlpha = 0.28 + aSize * 0.14 + min(vel, 2.0) * 0.04;
    } else {
        vAlpha = 0.55 + aSize * 0.25 + min(vel, 2.0) * 0.06;
    }

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float baseSize = uIsDark > 0.5 ? uPointSize : (uPointSize * 1.3);
    gl_PointSize = clamp(aSize * baseSize * (80.0 / -mv.z), 0.8, 24.0);
    gl_Position = projectionMatrix * mv;
}
`;

const FRAG = `
varying vec3 vColor;
varying float vAlpha;
void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = (1.0 - smoothstep(0.25, 0.5, d)) * vAlpha;
    gl_FragColor = vec4(vColor, a);
}
`;

interface Keyframe {
  s: number;
  f: number;
  z: number;
  r: number;
  g: number;
  b: number;
}

// Keyframes for Dark Mode (All particles pure glowing WHITE on pitch black background)
const KEYFRAMES_DARK: Keyframe[] = [
  { s: 0.00, f: 0, z: 7,   r: 1.0, g: 1.0, b: 1.0 }, // Sphere pure white
  { s: 0.07, f: 0, z: 7,   r: 1.0, g: 1.0, b: 1.0 },
  { s: 0.19, f: 1, z: 9,   r: 1.0, g: 1.0, b: 1.0 }, // Helix pure white
  { s: 0.26, f: 1, z: 9,   r: 1.0, g: 1.0, b: 1.0 },
  { s: 0.38, f: 2, z: 8,   r: 1.0, g: 1.0, b: 1.0 }, // Grid pure white
  { s: 0.45, f: 2, z: 8,   r: 1.0, g: 1.0, b: 1.0 },
  { s: 0.57, f: 3, z: 7.5, r: 1.0, g: 1.0, b: 1.0 }, // Torus pure white
  { s: 0.64, f: 3, z: 7.5, r: 1.0, g: 1.0, b: 1.0 },
  { s: 0.76, f: 4, z: 10,  r: 1.0, g: 1.0, b: 1.0 }, // Galaxy pure white
  { s: 0.83, f: 4, z: 10,  r: 1.0, g: 1.0, b: 1.0 },
  { s: 0.95, f: 5, z: 6,   r: 1.0, g: 1.0, b: 1.0 }, // Vortex pure white
  { s: 1.00, f: 5, z: 6,   r: 1.0, g: 1.0, b: 1.0 },
];

const FORMATION_PRESETS_DARK: Record<number, { z: number; r: number; g: number; b: number }> = {
  0: { z: 7,   r: 1.0, g: 1.0, b: 1.0 },
  1: { z: 9,   r: 1.0, g: 1.0, b: 1.0 },
  2: { z: 8,   r: 1.0, g: 1.0, b: 1.0 },
  3: { z: 7.5, r: 1.0, g: 1.0, b: 1.0 },
  4: { z: 10,  r: 1.0, g: 1.0, b: 1.0 },
  5: { z: 6,   r: 1.0, g: 1.0, b: 1.0 },
};

// Keyframes for Light Mode (All particles pure deep solid BLACK on clean white background)
const KEYFRAMES_LIGHT: Keyframe[] = [
  { s: 0.00, f: 0, z: 7,   r: 0.04, g: 0.04, b: 0.06 }, // Sphere pure black
  { s: 0.07, f: 0, z: 7,   r: 0.04, g: 0.04, b: 0.06 },
  { s: 0.19, f: 1, z: 9,   r: 0.04, g: 0.04, b: 0.06 }, // Helix pure black
  { s: 0.26, f: 1, z: 9,   r: 0.04, g: 0.04, b: 0.06 },
  { s: 0.38, f: 2, z: 8,   r: 0.04, g: 0.04, b: 0.06 }, // Grid pure black
  { s: 0.45, f: 2, z: 8,   r: 0.04, g: 0.04, b: 0.06 },
  { s: 0.57, f: 3, z: 7.5, r: 0.04, g: 0.04, b: 0.06 }, // Torus pure black
  { s: 0.64, f: 3, z: 7.5, r: 0.04, g: 0.04, b: 0.06 },
  { s: 0.76, f: 4, z: 10,  r: 0.04, g: 0.04, b: 0.06 }, // Galaxy pure black
  { s: 0.83, f: 4, z: 10,  r: 0.04, g: 0.04, b: 0.06 },
  { s: 0.95, f: 5, z: 6,   r: 0.04, g: 0.04, b: 0.06 }, // Vortex pure black
  { s: 1.00, f: 5, z: 6,   r: 0.04, g: 0.04, b: 0.06 },
];

const FORMATION_PRESETS_LIGHT: Record<number, { z: number; r: number; g: number; b: number }> = {
  0: { z: 7,   r: 0.04, g: 0.04, b: 0.06 },
  1: { z: 9,   r: 0.04, g: 0.04, b: 0.06 },
  2: { z: 8,   r: 0.04, g: 0.04, b: 0.06 },
  3: { z: 7.5, r: 0.04, g: 0.04, b: 0.06 },
  4: { z: 10,  r: 0.04, g: 0.04, b: 0.06 },
  5: { z: 6,   r: 0.04, g: 0.04, b: 0.06 },
};

export default function VoidCanvas({
  scrollProgress,
  scrollVelocity,
  manualFormationId,
  onActiveFormationChange,
  isDark = false,
}: VoidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    scrollProgress: 0,
    scrollVelocity: 0,
    manualFormationId: null as number | null,
    isDark: false,
    currentFormA: 0,
    currentFormB: 0,
    currentMix: 0,
    targetZ: 7,
  });

  // Keep ref updated with latest props without re-initializing WebGL
  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.scrollVelocity = scrollVelocity;
    stateRef.current.manualFormationId = manualFormationId;
    stateRef.current.isDark = isDark;
  }, [scrollProgress, scrollVelocity, manualFormationId, isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 3200 : 6500;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Initial background clear color based on theme
    const initialIsDark = document.documentElement.classList.contains('dark');
    renderer.setClearColor(initialIsDark ? 0x000000 : 0xffffff, 1);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const scene = new THREE.Scene();

    const geometry = new THREE.BufferGeometry();
    const idx = new Float32Array(count);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      idx[i] = i;
      sizes[i] = 0.4 + Math.random() * 1.1;
      phases[i] = Math.random();
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute('aIndex', new THREE.BufferAttribute(idx, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uCount: { value: count },
        uFormA: { value: 0 },
        uFormB: { value: 0 },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(100, 100, 100) },
        uMouseRadius: { value: 4.8 },
        uPointSize: { value: 1.25 },
        uColorA: {
          value: initialIsDark
            ? new THREE.Color(1.0, 1.0, 1.0)
            : new THREE.Color(0.04, 0.04, 0.06),
        },
        uColorB: {
          value: initialIsDark
            ? new THREE.Color(1.0, 1.0, 1.0)
            : new THREE.Color(0.04, 0.04, 0.06),
        },
        uScrollVel: { value: 0 },
        uIsDark: { value: initialIsDark ? 1.0 : 0.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: initialIsDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    const mouseNDC = { x: -100, y: -100 };
    const mouse3D = new THREE.Vector3(100, 100, 100);
    const vProj = new THREE.Vector3();
    const dProj = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseNDC.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseNDC.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handleTouchEnd = () => {
      mouseNDC.x = -100;
      mouseNDC.y = -100;
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    function computeScrollState(s: number, currentKeyframes: Keyframe[]) {
      let i = 0;
      while (i < currentKeyframes.length - 1 && currentKeyframes[i + 1].s <= s) {
        i++;
      }
      const a = currentKeyframes[i];
      const b = currentKeyframes[Math.min(i + 1, currentKeyframes.length - 1)];
      const range = b.s - a.s;
      const t = range > 0 ? Math.max(0, Math.min(1, (s - a.s) / range)) : 0;
      return {
        fA: a.f,
        fB: b.f,
        mix: a.f === b.f ? 0 : t,
        z: a.z + (b.z - a.z) * t,
        rA: a.r, gA: a.g, bA: a.b,
        rB: b.r, gB: b.g, bB: b.b,
        activeFormation: t > 0.5 ? b.f : a.f,
      };
    }

    let lastReportedFormation = -1;
    let animId: number;
    let currentClearR = initialIsDark ? 0.0 : 1.0;
    let currentClearG = initialIsDark ? 0.0 : 1.0;
    let currentClearB = initialIsDark ? 0.0 : 1.0;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const time = performance.now() * 0.001;
      const u = material.uniforms;

      // Real-time theme check
      const currentDark = document.documentElement.classList.contains('dark');
      u.uIsDark.value = currentDark ? 1.0 : 0.0;

      // Smooth background color interpolation
      const targetClear = currentDark ? 0.0 : 1.0;
      currentClearR += (targetClear - currentClearR) * 0.15;
      currentClearG += (targetClear - currentClearG) * 0.15;
      currentClearB += (targetClear - currentClearB) * 0.15;
      renderer.setClearColor(new THREE.Color(currentClearR, currentClearG, currentClearB), 1);

      // Blending switch
      const targetBlending = currentDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      if (material.blending !== targetBlending) {
        material.blending = targetBlending;
        material.needsUpdate = true;
      }

      const activeKeyframes = currentDark ? KEYFRAMES_DARK : KEYFRAMES_LIGHT;
      const activePresets = currentDark ? FORMATION_PRESETS_DARK : FORMATION_PRESETS_LIGHT;

      const manualId = stateRef.current.manualFormationId;
      let targetState;

      if (manualId !== null && manualId !== undefined) {
        const preset = activePresets[manualId] || activePresets[0];
        targetState = {
          fA: manualId,
          fB: manualId,
          mix: 0,
          z: preset.z,
          rA: preset.r, gA: preset.g, bA: preset.b,
          rB: preset.r, gB: preset.g, bB: preset.b,
          activeFormation: manualId,
        };
      } else {
        targetState = computeScrollState(stateRef.current.scrollProgress, activeKeyframes);
      }

      // Smooth transition for uniforms
      u.uFormA.value = targetState.fA;
      u.uFormB.value = targetState.fB;
      u.uMix.value = targetState.mix;
      u.uTime.value = time;

      const currentVel = Math.abs(stateRef.current.scrollVelocity);
      u.uScrollVel.value += (currentVel - u.uScrollVel.value) * 0.12;

      u.uColorA.value.setRGB(targetState.rA, targetState.gA, targetState.bA);
      u.uColorB.value.setRGB(targetState.rB, targetState.gB, targetState.bB);

      // Unproject mouse coords to Z=0 plane
      vProj.set(mouseNDC.x, mouseNDC.y, 0.5).unproject(camera);
      dProj.copy(vProj).sub(camera.position).normalize();
      const dist = -camera.position.z / dProj.z;
      mouse3D.copy(camera.position).addScaledVector(dProj, dist);
      u.uMouse.value.lerp(mouse3D, 0.06);

      // Camera parallax
      stateRef.current.targetZ += (targetState.z - stateRef.current.targetZ) * 0.04;
      const mx = Math.max(-1, Math.min(1, mouseNDC.x));
      const my = Math.max(-1, Math.min(1, mouseNDC.y));
      camera.position.x += (mx * 0.35 - camera.position.x) * 0.02;
      camera.position.y += (my * 0.22 - camera.position.y) * 0.02;
      camera.position.z += (stateRef.current.targetZ - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      if (targetState.activeFormation !== lastReportedFormation) {
        lastReportedFormation = targetState.activeFormation;
        if (onActiveFormationChange) {
          onActiveFormationChange(targetState.activeFormation);
        }
      }
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [onActiveFormationChange]);

  return (
    <div className="canvas-wrap pointer-events-none fixed inset-0 z-0 transition-colors duration-300">
      <canvas ref={canvasRef} id="voidCanvas" className="block h-full w-full" />
    </div>
  );
}
