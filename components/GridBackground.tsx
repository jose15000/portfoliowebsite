'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Shaders                                                           */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Bypassa a câmera, criando um quad que cobre a tela inteira perfeitamente
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uResolution;
  uniform float uDpr;
  uniform float uTime;
  uniform vec2  uMouse;           
  uniform float uMouseInfluence;  

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec2 gravityWarp(vec2 uv, vec2 center, float aspect, float radius, float strength) {
    vec2 uvA     = vec2(uv.x * aspect, uv.y);
    vec2 centerA = vec2(center.x * aspect, center.y);

    vec2  delta = uvA - centerA;
    float dist  = length(delta) + 1e-4;

    float falloff = smoothstep(radius, 0.0, dist);
    float pull = strength * falloff * falloff / dist;
    pull = min(pull, radius * 0.9);

    vec2 dir = delta / dist;
    vec2 warpedA = uvA - dir * pull;

    return vec2(warpedA.x / aspect, warpedA.y);
  }

  vec3 shadowMask(vec2 fragCoord, float cell) {
    float maskDark  = 0.55;
    float maskLight = 1.35;
    float x = mod(fragCoord.x / cell, 3.0);
    vec3 m = vec3(maskDark);
    if (x < 1.0)      m.r = maskLight;
    else if (x < 2.0) m.g = maskLight;
    else              m.b = maskLight;
    return m;
  }

  float gaus(float pos, float scale) {
    return exp2(scale * pos * pos);
  }

  float scanlineWeight(vec2 fragCoord, float lineHeight, float hardness) {
    float pos = fragCoord.y / lineHeight;
    float dist = fract(pos) - 0.5;
    return gaus(dist, hardness);
  }

  float gridPattern(vec2 fragCoordPx, float cellPx) {
    vec2 g = mod(fragCoordPx, cellPx);
    vec2 distToLine = min(g, cellPx - g);
    float d = min(distToLine.x, distToLine.y);
    return 1.0 - smoothstep(0.0, 2.0, d);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    float lensRadius   = 0.10;
    float lensStrength = 1.5 * uMouseInfluence;
    vec2 warpedUv = gravityWarp(uv, uMouse, aspect, lensRadius, lensStrength);

    vec2 toMouseA = vec2((uv.x - uMouse.x) * aspect, uv.y - uMouse.y);
    float distToMouse = length(toMouseA);
    float lensGlow = smoothstep(lensRadius, 0.0, distToMouse) * uMouseInfluence;

    vec3 baseColor = vec3(0.0588, 0.0902, 0.1647);

    float cellPx = 105.0 * uDpr;
    vec2 warpedFragCoord = warpedUv * uResolution;
    float grid = gridPattern(warpedFragCoord, cellPx);

 // Mantivemos o seu tom arroxeado, mas adicionamos um pouco mais de "luz" a ele
    vec3 lineColor = vec3(0.5, 0.75, 1.0); 
    
    // Subimos de 0.05 para 0.08 (um aumento sutil para não perder a elegância)
    float lineAlpha = 0.08; 

    vec3 color = baseColor;
    color = mix(color, lineColor, grid * lineAlpha);
    color += vec3(0.02, 0.03, 0.05) * lensGlow;

  vec2 fragCoord = uv * uResolution;
    
    // Pixels minúsculos (1.5) e textura bem delicada (0.20)
    vec3 mask = shadowMask(fragCoord, 2.0 * uDpr);
    color *= mix(vec3(1.0), mask, 1.0); 

    // Scanlines super finas (1.0), muito suaves (-2.0) e quase imperceptíveis (0.08)
    float scan = scanlineWeight(fragCoord, 1.0 * uDpr, 1.0);
    color *= mix(1.0, scan, 0.1);

    gl_FragColor = vec4(color, 1.0);
  }
`

/* ------------------------------------------------------------------ */
/*  Fullscreen shader mesh                                            */
/* ------------------------------------------------------------------ */

function ShaderPlane() {
  // A Ref conectada diretamente ao material instanciado
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5))
  const influence = useRef(0)
  const lastMoveTime = useRef(-10000)

  // Valores iniciais apenas para a construção do material
  const initialUniforms = useMemo(() => ({
    uResolution: { value: new THREE.Vector2(1, 1) },
    uDpr: { value: 1 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uMouseInfluence: { value: 0 },
  }), [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth
      const y = 1.0 - e.clientY / window.innerHeight
      targetMouse.current.set(x, y)
      lastMoveTime.current = performance.now()
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  useFrame((state, delta) => {
    // Se o material ainda não renderizou, não faz nada
    if (!materialRef.current) return

    // Agora sim! Pegamos os uniforms DIRETAMENTE da instância clonada do Three.js
    const uniforms = materialRef.current.uniforms
    
    // Trava para evitar pulos caso o usuário troque de aba no navegador
    const dt = Math.min(delta, 0.1)

    // 1. Atualizar Tela/Tempo
    const dpr = state.viewport.dpr || state.gl.getPixelRatio()
    uniforms.uResolution.value.set(state.size.width * dpr, state.size.height * dpr)
    uniforms.uDpr.value = dpr
    uniforms.uTime.value = state.clock.getElapsedTime()

    // 2. Interpolar suavemente o movimento do mouse
    smoothMouse.current.lerp(targetMouse.current, 1 - Math.pow(0.001, dt))
    uniforms.uMouse.value.copy(smoothMouse.current)

    // 3. Controlar o Fade In/Out se não houver movimento
    const idleTime = (performance.now() - lastMoveTime.current) / 1000
    const targetInfluence = idleTime < 2.5 ? 1 : 0
    const lerpRate = 1 - Math.pow(0.0001, dt)
    
    influence.current += (targetInfluence - influence.current) * lerpRate
    uniforms.uMouseInfluence.value = influence.current
  })

  return (
    <mesh frustumCulled={false}>
      {/* Geometria 2x2 com quad NDC preenche a tela perfeitamente */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={initialUniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  Public component                                                  */
/* ------------------------------------------------------------------ */

export function GridBackground() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 1] }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <ShaderPlane />
    </Canvas>
  )
}

export default GridBackground