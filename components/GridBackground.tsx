"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ThemeName, THEMES } from './background/shaders/theme.config'

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

function ShaderPlane({theme}: {theme: ThemeName}) {


  const activeTheme = THEMES[theme] 
  const materialRef = useRef<THREE.ShaderMaterial>(null)
 
  const touchTexture = useMemo(() => new TouchTexture(), [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTouchTexture: { value: touchTexture.texture },
    uDpr: {value: 1},
    uGrainIntensity: {value: 0.05},
...activeTheme.uniforms,
  
  }), [touchTexture, activeTheme])


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

    // 2. Passa o tempo e a resolução da tela para o Shader
    matUniforms.uTime.value = state.clock.getElapsedTime()
    matUniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
  })

  return (
    <mesh>
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
  )
}

/* ------------------------------------------------------------------ */
/*  4. O Componente de Exportação                                     */
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
      <ShaderPlane theme={"dark"}/>
    </Canvas>
  )
}