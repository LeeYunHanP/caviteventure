import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Vector3, Group } from 'three';

const MODEL_PATH = '/shrine.glb';

const Model: React.FC = () => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  // Rotate the model slowly over time
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2; // Adjust speed as needed
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={new Vector3(1, 1, 1)}
        position={new Vector3(0, -1, 0)}
      />
    </group>
  );
};

const ThreeModel: React.FC = () => {
  return (
    <Canvas
      style={{ height: '100vh', width: '60%' }}
      camera={{ position: [10, 10, 45], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={3} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls minDistance={10} maxDistance={100} />
    </Canvas>
  );
};

export default ThreeModel;
