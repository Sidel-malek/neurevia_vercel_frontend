"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Line, Stars } from "@react-three/drei"
import { useMemo } from "react"
import * as THREE from "three"

export default function NeuronScene() {
  const neurons = useMemo(() => {
    return Array.from({ length: 10 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
    }))
  }, [])

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={true} />

      <Stars />

      {neurons.map((neuron, i) => (
        <Sphere key={i} args={[0.2, 32, 32]} position={neuron.position}>
          <meshStandardMaterial color="#14b8a6" />
        </Sphere>
      ))}

      {/* Lines between neurons */}
      {neurons.map((a, i) =>
        neurons.map((b, j) =>
          i < j ? (
            <Line
              key={`${i}-${j}`}
              points={[a.position, b.position]}
              color="white"
              lineWidth={0.5}
              dashed={false}
            />
          ) : null
        )
      )}
    </Canvas>
  )
}