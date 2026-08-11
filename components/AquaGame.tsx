"use client"

import { useEffect, useRef, useState } from 'react'
import { Physics, RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier'
import { useTexture} from '@react-three/drei'
import * as THREE from 'three'
import { backgroundComponents } from '@/utils/backgroundComponents'
import { useFrame } from '@react-three/fiber'


function FishCutout({ textureUrl, startPosition}: { textureUrl: string, startPosition: [number, number, number]}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const texture = useTexture(textureUrl)
  texture.colorSpace = THREE.SRGBColorSpace

  // Criamos uma "identidade" matemática para cada peixe, 
  // assim eles não boiam todos sincronizados como robôs
  const randomFactor = useRef(Math.random() * 100)
  const randomSpin = useRef((Math.random() - 0.5) * 0.5)

  // 1. GIRO INICIAL: Assim que o peixe nasce, damos um "peteleco" para ele já começar rodando
  useEffect(() => {
    if (rigidBodyRef.current) {
      rigidBodyRef.current.applyTorqueImpulse({ x: 0, y: 0, z: randomSpin.current }, true)
    }
  }, [])

  // 2. CORRENTEZA: O loop contínuo que faz ele boiar
  useFrame((state) => {
    if (!rigidBodyRef.current) return
    const t = state.clock.getElapsedTime() + randomFactor.current

    // Forças 10x menores para não anularem a gravidade!
    const driftX = Math.sin(t) * 0.005 
    const floatY = Math.cos(t * 0.5) * 0.001 

    rigidBodyRef.current.applyImpulse({ x: driftX, y: floatY, z: 0 }, true)
  })

  const handlePuff = (e: any) => {
    e.stopPropagation()
    if (rigidBodyRef.current) {
      rigidBodyRef.current.applyImpulse({ x: (Math.random() - 0.5) * 5, y: 20, z: 0 }, true)
      rigidBodyRef.current.applyTorqueImpulse({ x: 0, y: 0, z: (Math.random() - 0.5) * 2 }, true)
    }
  }

  return (
    <RigidBody 
      ref={rigidBodyRef}
      position={startPosition}
      colliders={false} 
      restitution={0.6}
      friction={0.2}
      enabledTranslations={[true, true, false]} 
      enabledRotations={[false, false, true]}
      linearDamping={1.2}  
      angularDamping={1.5} // <-- Freia o giro aos poucos para não parecerem hélices de helicóptero
    >
      <CuboidCollider args={[0.75, 0.75, 0.05]} /> 

      <group onClick={handlePuff}>
        {/* MALHA PRINCIPAL */}
        <mesh>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial map={texture} transparent alphaTest={0.1} side={THREE.DoubleSide} />
        </mesh>

        {/* SOMBRA */}
        <mesh position={[0.1, -0.1, -0.1]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial map={texture} transparent alphaTest={0.1} color="#000000" opacity={0.5} />
        </mesh>
      </group>
    </RigidBody>
  )
}

// 2. O AQUÁRIO
export function AquaGamePhysics() {
  const [fishes, setFishes] = useState<{ id: string; x: number; z: number; pictureUrl: string }[]>([])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const spawnFish = () => {
      const amountToSpawn = Math.floor(Math.random() * 3) + 1
      const randomIndex = Math.floor(Math.random() * backgroundComponents.length)

      const newFishes = Array.from({ length: amountToSpawn }).map(() => ({
        id: Math.random().toString(36).substring(2, 9), 
        x: (Math.random() - 0.5) * 20,                  
        z: Math.random() * 0.1,           
        pictureUrl: backgroundComponents[randomIndex]          
      }))

      setFishes((prevFishes) => {
        const combined = [...prevFishes, ...newFishes]

        return combined.slice(-20)
      })

      const nextSpawnTime = Math.random() * 3000 + 1000
      timeout = setTimeout(spawnFish, nextSpawnTime)
    }
    timeout = setTimeout(spawnFish, 2000)

    // Limpa o cronômetro se o usuário sair da página
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Physics gravity={[0, -0.4, 0]}> 
      
      {/* PAREDES E CHÃO */}
      <RigidBody type="fixed" position={[0, -12, 0]}>
        <CuboidCollider args={[20, 1, 5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[-15, 0, 0]}>
        <CuboidCollider args={[1, 20, 5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[15, 0, 0]}>
        <CuboidCollider args={[1, 20, 5]} />
      </RigidBody>

      {fishes.map((fish) => (
        <FishCutout 
          key={fish.id} 
          textureUrl={fish.pictureUrl}
          startPosition={[fish.x, 15, fish.z]} 
        />
      ))}
      
    </Physics>
  )
}