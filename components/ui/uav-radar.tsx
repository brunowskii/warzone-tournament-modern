<<<<<<< HEAD
'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function UAVRadarModel() {
  const radarRef = useRef<THREE.Group>(null)
  const sweepRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (radarRef.current) {
      // Gentle floating motion
      radarRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
    
    if (sweepRef.current) {
      // Sweeping radar motion
      sweepRef.current.rotation.z = state.clock.elapsedTime * 2
    }
  })

  return (
    <group ref={radarRef}>
      {/* Radar base */}
      <mesh castShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Radar dish */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.05, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Sweeping radar beam */}
      <mesh ref={sweepRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 1, 0.01, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Radar sweep plane */}
      <mesh ref={sweepRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 1, 0.01, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Center dot */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Radar rings */}
      {[0.3, 0.6, 0.9].map((radius, i) => (
        <mesh key={i} position={[0, 0.05, 0]}>
          <ringGeometry args={[radius, radius + 0.02, 16]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

interface UAVRadarProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function UAVRadar({ className = '', size = 'md' }: UAVRadarProps) {
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
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={0.8}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
          <UAVRadarModel />
        </Float>
      </Canvas>
      
      {/* Cyan glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-lg" />
    </div>
  )
}
=======
'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function UAVRadarModel() {
  const radarRef = useRef<THREE.Group>(null)
  const sweepRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (radarRef.current) {
      // Gentle floating motion
      radarRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
    
    if (sweepRef.current) {
      // Sweeping radar motion
      sweepRef.current.rotation.z = state.clock.elapsedTime * 2
    }
  })

  return (
    <group ref={radarRef}>
      {/* Radar base */}
      <mesh castShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Radar dish */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.05, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Sweeping radar beam */}
      <mesh ref={sweepRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 1, 0.01, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Radar sweep plane */}
      <mesh ref={sweepRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 1, 0.01, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.1}
        />
      </mesh>
      
      {/* Center dot */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Radar rings */}
      {[0.3, 0.6, 0.9].map((radius, i) => (
        <mesh key={i} position={[0, 0.05, 0]}>
          <ringGeometry args={[radius, radius + 0.02, 16]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

interface UAVRadarProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function UAVRadar({ className = '', size = 'md' }: UAVRadarProps) {
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
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={0.8}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
          <UAVRadarModel />
        </Float>
      </Canvas>
      
      {/* Cyan glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-lg" />
    </div>
  )
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d
