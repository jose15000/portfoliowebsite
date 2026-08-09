"use client"

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  1. A Classe TouchTexture (O segredo da distorção)                 */
/* ------------------------------------------------------------------ */
// Esta classe cria um mini-canvas invisível que desenha o rastro do mouse.
class TouchTexture {
  size: number
  maxAge: number
  radius: number
  speed: number
  trail: { x: number; y: number; age: number; force: number; vx: number; vy: number }[]
  last: { x: number; y: number } | null
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  texture: THREE.CanvasTexture

  constructor() {
    this.size = 50
    this.maxAge = 100
    this.radius = 0.03 * this.size
    this.speed = 1 / this.maxAge
    this.trail = []
    this.last = null
    
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.size
    this.canvas.height = this.size
    this.ctx = this.canvas.getContext('2d')!
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.minFilter = THREE.LinearFilter
    this.texture.magFilter = THREE.LinearFilter
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0
    let vx = 0
    let vy = 0
    const last = this.last

    if (last) {
      const dx = point.x - last.x
      const dy = point.y - last.y
      if (dx === 0 && dy === 0) return

      const dd = dx * dx + dy * dy
      const d = Math.sqrt(dd)
      vx = dx / d
      vy = dy / d
      force = Math.min(dd * 20000, 2.0)
    }

    this.last = { x: point.x, y: point.y }
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy })
  }

  update() {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.trail.forEach((point, i) => {
      point.age++
      if (point.age >= this.maxAge) {
        this.trail.splice(i, 1)
        return
      }

      const intensity = 1 - point.age / this.maxAge
      const radius = this.radius * intensity * (1 + point.force * 0.5)

      const gradient = this.ctx.createRadialGradient(
        point.x * this.size, point.y * this.size, 0,
        point.x * this.size, point.y * this.size, radius
      )

      // Desenha o rastro usando cores (Red e Green para velocidade, Blue para intensidade)
      const r = Math.max(0, Math.min(255, (point.vx + 1) * 127))
      const g = Math.max(0, Math.min(255, (point.vy + 1) * 127))
      const b = Math.max(0, Math.min(255, intensity * 100))

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      this.ctx.beginPath()
      this.ctx.fillStyle = gradient
      this.ctx.arc(point.x * this.size, point.y * this.size, radius, 0, Math.PI * 2)
      this.ctx.fill()
    })

    this.texture.needsUpdate = true
  }
}

/* ------------------------------------------------------------------ */
/*  2. Shaders do Gradiente Líquido                                   */
/* ------------------------------------------------------------------ */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDpr; // Retornamos o Pixel Ratio para o grid
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uGrainIntensity;
  uniform sampler2D uTouchTexture;

  // --- FUNÇÕES DE RUÍDO ---
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z); // <- A SUA CORREÇÃO AQUI!
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  // --- FUNÇÕES DO CRT E DO GRID ---
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
    
    // 1. TEXTURA DO MOUSE
    vec4 touch = texture2D(uTouchTexture, uv);
    
    // 2. CORREÇÃO DA DIREÇÃO DA ÁGUA
    vec2 mouseDistortion = (touch.rg - 0.5) * touch.b * 2.0;
    vec2 warpedUv = uv + vec2(-mouseDistortion.x, mouseDistortion.y) * 0.05;

    // 3. A SUA COR DE FUNDO ORIGINAL (Sólida e estática)
    vec3 bgColor = vec3(0.0588, 0.0902, 0.1647); 
    
    // O Blob Fino de Luz do mouse
    float thinBlob = pow(touch.b, 2.5);
    bgColor += vec3(0.0, 0.8, 1.0) * thinBlob * 1.5;

    // 4. O GRID DERRETENDO
    float cellPx = 105.0 * uDpr;
    vec2 warpedFragCoord = warpedUv * uResolution; 
    
    float grid = gridPattern(warpedFragCoord, cellPx);
    vec3 lineColor = vec3(0.5, 0.75, 1.0); 
    float lineAlpha = 0.15; 
    
    vec3 finalColor = mix(bgColor, lineColor, grid * lineAlpha);

    // 5. O VIDRO DO MONITOR (Estático)
    vec2 fragCoord = uv * uResolution; 
    
    vec3 mask = shadowMask(fragCoord, 1.0 * uDpr);
    finalColor *= mix(vec3(0.20), mask, 1.0); 

    float scan = scanlineWeight(fragCoord, 1.0 * uDpr, 0.08);
    finalColor *= mix(1.0, scan, 0.1);

    // Ruído de TV
    float grain = fract(sin(dot(uv.xy, vec2(12.9898,78.233)) + uTime) * 43758.5453) - 0.5;
    finalColor += grain * uGrainIntensity;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

/* ------------------------------------------------------------------ */
/*  3. O Componente WebGL que une tudo                                */
/* ------------------------------------------------------------------ */

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  // Instancia a classe TouchTexture apenas uma vez
  const touchTexture = useMemo(() => new TouchTexture(), [])

  // A paleta de cores (Ajuste para a sua identidade visual!)
  const uniforms = useMemo(() => ({
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(1, 1) },
  uDpr: { value: 1 }, // <--- ADICIONE ESTA LINHA
  uTouchTexture: { value: touchTexture.texture },
  // ... resto igual
    uGrainIntensity: { value: 0.05 }, // Intensidade do granulado
    
    // Cores base do seu gradiente
    uColor1: { value: new THREE.Color('#030A1C') }, // Fundo marinho escuro
    uColor2: { value: new THREE.Color('#0A1A3D') }, // Azul profundo
    uColor3: { value: new THREE.Color('#14407A') }, // Azul vibrante
    uColor4: { value: new THREE.Color('#00F0FF') }, // Destaque em Ciano/Teal
  }), [touchTexture])

  // Lida com o movimento do mouse
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Normaliza a coordenada do mouse para o espaço do shader (0.0 a 1.0)
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      touchTexture.addTouch({ x, y })
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [touchTexture])

  useFrame((state) => {
    // 1. Atualiza o mini-canvas interno com os novos rastros
    touchTexture.update()

    if (!materialRef.current) return
    const matUniforms = materialRef.current.uniforms

    // 2. Atualiza os dados do Shader
    matUniforms.uTime.value = state.clock.getElapsedTime()
    matUniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
  })

  return (
    <mesh>
      {/* Geometria 2x2 preenche a tela inteira com o hack de vertexShader */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/*  4. O Componente Exportado (Pronto para o page.tsx)                */
/* ------------------------------------------------------------------ */

export default function LiquidGradient() {
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