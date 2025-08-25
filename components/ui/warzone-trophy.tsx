<<<<<<< HEAD
'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

function TrophyModel({ ...props }) {
  const group = useRef<THREE.Group>(null)

  // Create metallic material with cyan glow
  const trophyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#00ffff',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#00ffff',
      emissiveIntensity: 0.2,
    })
  }, [])

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        material={trophyMaterial}
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[0.5, 0.3, 2, 8]} />
      </mesh>
    </group>
  )
}

// Fallback trophy if model is not available
function FallbackTrophy() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.5, 0.3, 2, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          metalness={0.9}
          roughness={0.1}
          emissive="#00ffff"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

interface WarzoneTrophyProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WarzoneTrophy({ className = '', size = 'md' }: WarzoneTrophyProps) {
  const sizeMap = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  }

  return (
    <div className={`${sizeMap[size]} ${className} relative`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <FallbackTrophy />
          </Float>
        </PresentationControls>
        
        <Environment preset="city" />
      </Canvas>
      
      {/* Glow effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-xl" />
    </div>
  )
}
=======
'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Float, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

function TrophyModel({ ...props }) {
  const group = useRef<THREE.Group>(null)

  // Create metallic material with cyan glow
  const trophyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#00ffff',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#00ffff',
      emissiveIntensity: 0.2,
    })
  }, [])

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        material={trophyMaterial}
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[0.5, 0.3, 2, 8]} />
      </mesh>
    </group>
  )
}

// Fallback trophy if model is not available
function FallbackTrophy() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.5, 0.3, 2, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          metalness={0.9}
          roughness={0.1}
          emissive="#00ffff"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

interface WarzoneTrophyProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function WarzoneTrophy({ className = '', size = 'md' }: WarzoneTrophyProps) {
  const sizeMap = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  }

  return (
    <div className={`${sizeMap[size]} ${className} relative`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <PresentationControls
          global
          rotation={[0.13, 0.1, 0]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <FallbackTrophy />
          </Float>
        </PresentationControls>
        
        <Environment preset="city" />
      </Canvas>
      
      {/* Glow effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-xl" />
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
