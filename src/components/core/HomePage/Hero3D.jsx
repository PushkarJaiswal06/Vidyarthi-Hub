import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function CustomHeroModel(props) {
  const { scene } = useGLTF('/assets/3d/hero-model.glb');
  return <primitive object={scene} {...props} />;
}

export default function Hero3D() {
  return (
    <div style={{ width: 500, height: 500 }}>
      <Canvas camera={{ position: [2, 2, 6], fov: 45, near: 0.1, far: 100 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 5, 5]} intensity={0.7} />
        <pointLight position={[0, 10, 0]} intensity={1} />
        <CustomHeroModel scale={1.2} position={[0, -0.5, 0]} />
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 2.2} />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/assets/3d/hero-model.glb'); 