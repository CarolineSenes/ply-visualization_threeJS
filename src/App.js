import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, TransformControls, useCursor } from '@react-three/drei'
import { useControls } from 'leva'
import create from 'zustand'

const useStore = create((set) => ({ target: null, setTarget: (target) => set({ target }) }))

/** Box */

function Box(props) {
  const { nodes } = useGLTF('model.gltf')
  console.log(nodes)

  const setTarget = useStore((state) => state.setTarget)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.bunny.geometry}
      {...props}
      onClick={(e) => {
        setTarget(e.object)
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}>
      {/* <boxGeometry /> */}
      <meshNormalMaterial />
    </mesh>
  )
}

useGLTF.preload('model.gltf')

/** APP */

export default function App() {
  const { target, setTarget } = useStore()
  const { mode } = useControls({ mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] } })
  return (
    <Canvas orthographic dpr={[1, 2]} onPointerMissed={() => setTarget(null)}>
      <Suspense fallback={null}>
        <Box position={[1, -0.5, 0]} />
        <Box position={[-1, -0.5, 0]} />
        {target && <TransformControls object={target} mode={mode} />}
        <OrbitControls makeDefault enableDamping={false} />
      </Suspense>
    </Canvas>
  )
}
