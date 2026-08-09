"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";


 // 1. Shader Atualizado (Dobra as Bordas 2D)
const TubeMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uTextureSize: new THREE.Vector2(1, 1),
    uQuadSize: new THREE.Vector2(1, 1),
    uCurveIntensity: 0, 
  },
  // VERTEX SHADER - A Mágica acontece aqui
  `
    varying vec2 vUv;
    varying vec2 vUvCover;

    uniform vec2 uTextureSize;
    uniform vec2 uQuadSize;
    uniform float uCurveIntensity;

    void main() {
      vUv = uv;

      // Object-fit: cover
      float texR = uTextureSize.x / uTextureSize.y;
      float quadR = uQuadSize.x / uQuadSize.y;
      vec2 s = vec2(1.0);
      if (quadR > texR) { s.y = texR / quadR; } else { s.x = quadR / texR; }
      vUvCover = vUv * s + (1.0 - s) * 0.5;

      vec3 pos = position;

      // Transformamos o UV (0 a 1) em Coordenadas Normalizadas (-1 a 1)
      // Centro = 0, Bordas = 1 ou -1
      float normX = (uv.x - 0.5) * 2.0;
      float normY = (uv.y - 0.5) * 2.0;

      // Força máxima da curva em pixels
      float bendForce = uCurveIntensity * 60.0; 

      // 1. ENTORTE AS BORDAS SUPERIOR E INFERIOR (Arco no eixo Y)
      // Usamos a posição X para mover o vértice para cima/baixo.
      // O meio não se move (0*0 = 0), mas as pontas sobem/descem (1*1 = 1).
      pos.y -= (normX * normX) * bendForce;

      // 2. ENTORTE AS BORDAS LATERAIS (Arco no eixo X)
      // Puxamos as quinas laterais para dentro. Multiplicamos por normX para 
      // garantir que a borda esquerda dobre para a direita, e vice-versa.
      pos.x += (normY * normY) * normX * abs(bendForce) * 0.4;

      // 3. PROFUNDIDADE 3D
      // Continuamos empurrando as pontas de cima e baixo para trás no eixo Z 
      // para dar a sensação de volume e não ficar chapado.
      pos.z -= (normY * normY) * abs(bendForce);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // FRAGMENT SHADER
  `
    precision highp float;
    uniform sampler2D uTexture;
    varying vec2 vUvCover;

    void main() {
      gl_FragColor = texture2D(uTexture, vUvCover);
    }
  `
);
extend({ TubeMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    tubeMaterial: any;
  }
}

// 2. Malha 3D com lógica de Scroll e Câmera Fixa
function TubeMesh({ src, containerRef, range = 600, segments = 64 }: any) {
  const texture = useTexture(src) as THREE.Texture;
  const materialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, camera } = useThree();

  useFrame(() => {
    if (!containerRef.current || !materialRef.current || !meshRef.current || !texture.image) return;

    // CONFIGURAÇÃO DA CÂMERA (Fixa para 1 pixel WebGL = 1 pixel CSS)
    // Usamos um distance fixo para estabilizar a perspectiva.
    const distance = 800; 
    const fovRad = 2 * Math.atan(size.height / 2 / distance);
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.radToDeg(fovRad);
    camera.position.z = distance;
    camera.updateProjectionMatrix();

    // LÓGICA DE SCROLL (Simplified)
    const rect = containerRef.current.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;

    // Progresso vai de -1 (topo da tela) a 1 (base da tela), 0 no centro.
    const progress = THREE.MathUtils.clamp((itemCenter - viewportCenter) / range, -1, 1);

    // Suavização (ease) para a curva não ser linear
    const easedProgress = Math.sign(progress) * Math.pow(Math.abs(progress), 1.2);

    // Atualiza Uniforms do Material
    materialRef.current.uCurveIntensity = easedProgress;
    
    const imageElement = texture.image as HTMLImageElement;
    materialRef.current.uTextureSize.set(imageElement.width, imageElement.height);
    materialRef.current.uQuadSize.set(size.width, size.height);

    // TRUQUE VISUAL 2: Rotação sutil do objeto inteiro
    // Isso ajuda a dar profundidade e tira a impressão de que a imagem está "chapada" deitando.
    meshRef.current.rotation.x = easedProgress * 0.1; // Gira bem pouquinho no eixo X
  });

  return (
    <mesh ref={meshRef}>
      {/* Aumentei os segmentos para 64 para a curva ficar lisa */}
      <planeGeometry args={[size.width, size.height, 1, segments]} />
      <tubeMaterial ref={materialRef} uTexture={texture} transparent={true} />
    </mesh>
  );
}

// 3. Container HTML (Sem alterações aqui)
export default function TubeImage({ src, alt = "", className = "", ...props }: any) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} role="img" aria-label={alt}>
      <div className="absolute inset-0 pointer-events-none">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <TubeMesh src={src} containerRef={containerRef} {...props} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}