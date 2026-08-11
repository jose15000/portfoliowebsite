"use client"

import { useEffect, useRef, useState } from 'react'
import { Physics, RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier'
import { useTexture} from '@react-three/drei'
import * as THREE from 'three'
import { backgroundComponents } from '@/utils/backgroundComponents'
import { useFrame } from '@react-three/fiber'


function FishCutout({ textureUrl, startPosition, id, onRemove}: { id: string, textureUrl: string, startPosition: [number, number, number], onRemove: (idToRemove: string) => void}) {
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

    const driftX = Math.sin(t) * 0.002 

    // y: 0 para parar de lutar contra a gravidade!
    rigidBodyRef.current.applyImpulse({ x: driftX, y: 0, z: 0 }, true)
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
      restitution={0.4} // Quica um pouco menos para parecer que está na água
      friction={0.2}
      enabledTranslations={[true, true, false]} 
      enabledRotations={[false, false, true]}
      linearDamping={2.5}  // <-- O SEGREDO: O atrito da água freando a queda
      angularDamping={2.0} // <-- Freia o giro para não parecer um pião
    >
      <CuboidCollider args={[0.4, 0.4, 0.05]} /> 

      <group onClick={handlePuff}>
        {/* MALHA PRINCIPAL */}
        <mesh>
          <planeGeometry args={[0.8, 0.8]} />
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

  // 1. A FUNÇÃO QUE DESTRÓI O PEIXE
  const handleRemoveFish = (idToRemove: string) => {
    setFishes((prev) => prev.filter((fish) => fish.id !== idToRemove))
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const spawnFish = () => {
      const amountToSpawn = Math.floor(Math.random() * 3) + 1
      
      const newFishes = Array.from({ length: amountToSpawn }).map(() => {
        const randomIndex = Math.floor(Math.random() * backgroundComponents.length)
        return {
          id: Math.random().toString(36).substring(2, 9), 
          x: (Math.random() - 0.5) * 16,                  
          z: Math.random() * 0.1,           
          pictureUrl: backgroundComponents[randomIndex]          
        }
      })

      // 2. AGORA SÓ ADICIONAMOS OS PEIXES NOVOS (Sem slice!)
      setFishes((prev) => [...prev, ...newFishes])

      const nextSpawnTime = Math.random() * 3000 + 1000
      timeout = setTimeout(spawnFish, nextSpawnTime)
    }
    
    timeout = setTimeout(spawnFish, 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Physics gravity={[0, -4, 0]}> 
      
      {/* 3. APENAS PAREDES LATERAIS (Apagamos o chão para eles caírem livremente) */}
      <RigidBody type="fixed" position={[-12, 0, 0]}>
        <CuboidCollider args={[1, 20, 5]} />
      </RigidBody>
      <RigidBody type="fixed" position={[12, 0, 0]}>
        <CuboidCollider args={[1, 20, 5]} />
      </RigidBody>

      {fishes.map((fish) => (
        <FishCutout 
          key={fish.id} 
          id={fish.id} // <-- Passando o ID para o peixe se conhecer!
          textureUrl={fish.pictureUrl}
          startPosition={[fish.x, 8, fish.z]} 
          onRemove={handleRemoveFish} // <-- Passando o botão de autodestruição!
        />
      ))}
      
    </Physics>
  )
}