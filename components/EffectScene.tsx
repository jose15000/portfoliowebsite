"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import { Group, Mesh, MeshStandardMaterial, Vector2 } from "three"
import { AsciiEffect } from "./AsciiEffect"

function UserModel(props: ComponentPropsWithoutRef<"group">) {
  const { scene } = useGLTF("/models/user-model.glb")

  const basicMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#917AFF",
        roughness: 0, // Lower = sharper highlights, more contrast
        metalness: 0,
        flatShading: false,
      }),
    []
  )

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh
      if ((mesh as any).isMesh) {
        const originalMat = (mesh as any).material
        // Dispose original material if it exists and is different
        if (originalMat && originalMat.dispose && originalMat !== basicMat) {
          try {
            originalMat.dispose()
          } catch (e) {
            // Ignore disposal errors (context might be lost)
          }
        }
        ; (mesh as any).material = basicMat
      }
    })

    return () => {
      // Cleanup: dispose material when component unmounts
      // Wrap in try-catch to handle context loss gracefully
      try {
        if (basicMat && typeof basicMat.dispose === "function") {
          basicMat.dispose()
        }
      } catch (e) {
        // Ignore disposal errors (context might be lost or already disposed)
      }
    }
  }, [scene, basicMat])

  return <primitive object={scene} {...props} />
}

useGLTF.preload("/models/user-model.glb")

const AUTO_ROTATE_SPEED = 0.5
const HOVER_SPIN_MULTIPLIER = 2
const TILT_FORWARD = 0.3
const TILT_LEFT = -0.08

const CAMERA_BASE_Z = 4.5
const CAMERA_ZOOMED_Z = CAMERA_BASE_Z / 1.1

function DraggableUserModel({ isHovered = false }: { isHovered?: boolean }) {
  const groupRef = useRef<Group>(null)
  const autoY = useRef(0)

  const spinSpeed = isHovered ? AUTO_ROTATE_SPEED * HOVER_SPIN_MULTIPLIER : AUTO_ROTATE_SPEED

  useFrame((_, delta) => {
    if (!groupRef.current) return

    autoY.current += delta * spinSpeed

    groupRef.current.rotation.x = TILT_FORWARD
    groupRef.current.rotation.y = autoY.current
    groupRef.current.rotation.z = TILT_LEFT
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <UserModel scale={3} />
    </group>
  )
}

function CameraHoverZoom({ isHovered = false }: { isHovered?: boolean }) {
  const { camera } = useThree()
  useFrame(() => {
    const targetZ = isHovered ? CAMERA_ZOOMED_Z : CAMERA_BASE_Z
    camera.position.z += (targetZ - camera.position.z) * 0.08
    camera.position.x += (0 - camera.position.x) * 0.08
    camera.position.y += (0 - camera.position.y) * 0.08
  })
  return null
}

/** Mounts EffectComposer only after the first frame so WebGL context exists (avoids postprocessing addPass reading null .alpha) */
function SceneWithDelayedComposer({
  resolution,
  mousePos,
  enableZoom = true,
  isHovered = false,
}: {
  resolution: Vector2
  mousePos: Vector2
  enableZoom?: boolean
  isHovered?: boolean
}) {
  const { gl } = useThree()
  const [composerReady, setComposerReady] = useState(false)
  const frameCount = useRef(0)

  useFrame(() => {
    frameCount.current++
    // Wait for at least 3 frames before mounting composer
    if (frameCount.current >= 3 && !composerReady) {
      // Use setTimeout to defer to next event loop after frames have rendered
      setTimeout(() => {
        try {
          const context = gl.getContext()
          if (context && !(context as WebGLRenderingContext).isContextLost?.()) {
            setComposerReady(true)
          }
        } catch (e) {
          // Ignore errors
        }
      }, 100)
    }
  })

  return (
    <>
      <Environment preset="studio" background={false} />
      <ambientLight intensity={0} />
      <CameraHoverZoom isHovered={false} />
      <Suspense fallback={null}>
        <DraggableUserModel isHovered={false} />
      </Suspense>
      <OrbitControls enableRotate={false} enableZoom={enableZoom} enablePan={false} />
      {composerReady && (
        <EffectComposer>
          <AsciiEffect
            style="standard"
            cellSize={8}
            invert={true}
            color={false}
            characterSet="terminal"
            volumeShading={true}
            tintColor="#917AFF"
            resolution={resolution}
            mousePos={mousePos}
            postfx={{
              contrastAdjust: 2.2,
              brightnessAdjust: 0.05,
            }}
          />
        </EffectComposer>
      )}
    </>
  )
}

interface EffectSceneProps {
  className?: string
  /** Allow zoom with scroll wheel (default true). Set false on hero to block zoom. */
  enableZoom?: boolean
  /** Explicit pixel size for the canvas container. When provided, overrides width/height behavior. */
  canvasSize?: number
}

export function EffectScene({ className, enableZoom = true, canvasSize }: EffectSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos] = useState(() => new Vector2(0, 0))
  const [resolution] = useState(() => new Vector2(1920, 1080))

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateResolution = () => {
      const rect = container.getBoundingClientRect()
      resolution.set(rect.width || 1920, rect.height || 1080)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (container) {
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = rect.height - (e.clientY - rect.top)
        mousePos.set(x, y)
      }
    }

    updateResolution()
    const ro = new ResizeObserver(updateResolution)
    ro.observe(container)
    container.addEventListener("mousemove", handleMouseMove)

    return () => {
      ro.disconnect()
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mousePos, resolution])

  return (
    <div
      ref={containerRef}
      data-model-canvas-container
      className={className || "w-full h-full min-h-[300px]"}
      onMouseEnter={() => setIsHovered(false)}
      onMouseLeave={() => setIsHovered(false)}
      style={canvasSize ? { width: canvasSize, height: canvasSize } : undefined}
    >
      <Canvas
        gl={{ alpha: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, CAMERA_BASE_Z], fov: 50 }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 0.6

          const handleContextLost = (event: Event) => {
            event.preventDefault()
            console.warn("WebGL context lost. Attempting to restore...")
          }

          const handleContextRestored = () => {
            console.log("WebGL context restored")
          }

          gl.domElement.addEventListener("webglcontextlost", handleContextLost)
          gl.domElement.addEventListener("webglcontextrestored", handleContextRestored)

          return () => {
            gl.domElement.removeEventListener("webglcontextlost", handleContextLost)
            gl.domElement.removeEventListener("webglcontextrestored", handleContextRestored)
          }
        }}
      >
        <SceneWithDelayedComposer
          resolution={resolution}
          mousePos={mousePos}
          enableZoom={enableZoom}
          isHovered={isHovered}
        />
      </Canvas>
    </div>
  )
}