'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

function SupplyCrateModel() {
  const crateRef = useRef<THREE.Group>(null)
  const parachuteRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (crateRef.current) {
      // Gentle floating motion
      crateRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    
    if (parachuteRef.current) {
      // Parachute swaying motion
      parachuteRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group>
      {/* Parachute */}
      <group ref={parachuteRef} position={[0, 1.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.1, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        
        {/* Parachute strings */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1, 4]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        ))}
      </group>
      
      {/* Supply Crate */}
      <group ref={crateRef} position={[0, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#8B4513"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* Cyan glow lines */}
        <mesh position={[0, 0, 0.51]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Crate lid */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.1, 0.1, 1.1]} />
          <meshStandardMaterial
            color="#654321"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      </group>
    </group>
  )
}

interface SupplyCrateProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SupplyCrate({ className = '', size = 'md' }: SupplyCrateProps) {
  const sizeMap = {
    sm: 'h-20 w-20',
    md: 'h-32 w-32',
    lg: 'h-48 w-48'
  }

  return (
    <div className={`${sizeMap[size]} ${className} relative`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <SupplyCrateModel />
          </Float>
        </PresentationControls>
      </Canvas>
      
      {/* Cyan glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-green-500/30 rounded-full blur-xl animate-pulse" />
    </div>
  )
}
