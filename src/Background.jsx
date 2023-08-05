import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background() {
  const donuts = useRef([]);
  const { viewport } = useThree();

  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: '#c4c3b6' });

  useEffect(() => {
    if (donuts.current.length === 0) return;

    donuts.current.forEach((donut) => {
      console.log(donut);
      // place donut
    });
  }, [viewport]);

  useFrame(() => {
    // animate donuts
  });

  return (
    <>
      {[...Array(100)].map((_, index) => (
        <mesh
          key={index}
          ref={(element) => (donuts.current[index] = element)}
          geometry={geometry}
          material={material}
        />
      ))}
    </>
  );
}
