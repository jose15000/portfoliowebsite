"use client"

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { ThemeName, THEMES } from './background/shaders/theme.config'
import { AquaGamePhysics } from './AquaGame'
import { useFBO } from '@react-three/drei'
import { createPortal } from '@react-three/fiber'


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

/* ------------------------------------------------------------------ */
/*  4. O Componente de Exportação                                     */
/* ------------------------------------------------------------------ */
// <-- Importe isso lá no topo!

function ShaderPlane({ theme = "aqua" }: { theme?: ThemeName }) {
  const bgTexture = useTexture('/images/meu-fundo.png')
  const activeTheme = THEMES[theme] || THEMES['aqua'] 
  const materialRef = useRef<THREE.ShaderMaterial>(null)
 const { viewport } = useThree()
  const touchTexture = useMemo(() => new TouchTexture(), [])

  // 1. CRIAMOS UMA CENA INVISÍVEL (Onde a física pode rodar sem quebrar)
  
  const [virtualScene] = useState(() => new THREE.Scene())

  // 2. CRIAMOS A "CÂMERA DE SEGURANÇA" QUE VAI FILMAR A CENA
  const renderTarget = useFBO()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTouchTexture: { value: touchTexture.texture },
    uDpr: { value: 1 },
    uGrainIntensity: { value: 0.05 },
    
    // Passamos o vídeo ao vivo da nossa câmera pro Shader!
    uBackgroundImage: { value: renderTarget.texture },
    ...activeTheme.uniforms,
  }), [touchTexture, activeTheme, renderTarget])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      touchTexture.addTouch({ x, y })
    }
    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [touchTexture])

  useFrame((state) => {
    touchTexture.update()

    // 3. A MÁGICA ACONTECE AQUI NO LOOP DE RENDERIZAÇÃO:
    // a) Mandamos o Three.js olhar pra nossa cena invisível e gravar no FBO
    state.gl.setRenderTarget(renderTarget)
    state.gl.render(virtualScene, state.camera)
    // b) Devolvemos o controle pra tela principal
    state.gl.setRenderTarget(null)

    if (!materialRef.current) return
    const matUniforms = materialRef.current.uniforms
    matUniforms.uTime.value = state.clock.getElapsedTime()
    matUniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
  })

  return (
    <>
      {createPortal(
        <group>
          {/* A Sua Imagem de Fundo Estática (Aumentei o tamanho pra garantir que cubra a tela toda) */}
          <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} /> 
            <meshBasicMaterial map={bgTexture} side={THREE.DoubleSide} />
          </mesh>

          {/* Os peixes caindo na frente da imagem */}
          {theme === 'aqua' && <AquaGamePhysics />}
        </group>,
        virtualScene
      )}

      {/* A TELA FINAL COM O SHADER DE CRT E DISTORÇÃO */}
      <mesh  >
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          key={theme}
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={activeTheme.fragment}
          uniforms={uniforms}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </>
  )
}
/* ------------------------------------------------------------------ */
/*  4. O Componente de Exportação                                     */
/* ------------------------------------------------------------------ */
export default function LiquidGradient({ theme = "aqua" }: { theme?: ThemeName }) {
  return (
    <Canvas
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    >
      <Suspense fallback={null}>
        <ShaderPlane theme={theme} />
      </Suspense>
    </Canvas>
  )
}
