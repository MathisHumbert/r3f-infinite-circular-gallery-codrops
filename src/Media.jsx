import React, { useEffect, useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

export default function Media({ geometry, image, text, index, length }) {
  const x = useRef(0);
  const widthTotal = useRef(0);
  const extra = useRef(0);
  const meshRef = useRef();
  const { viewport, size } = useThree();
  const texture = useTexture(image);

  if (index === 0) {
    console.log('render');
  }

  useEffect(() => {
    if (meshRef.current === undefined) return;

    meshRef.current.material.uniforms.uViewportSizes.value = {
      x: viewport.width,
      y: viewport.height,
    };

    const scale = size.height / 1500;

    console.log(viewport.width, viewport.height);

    meshRef.current.scale.x = (viewport.width * (700 * scale)) / size.width;
    meshRef.current.scale.y = (viewport.height * (900 * scale)) / size.height;

    meshRef.current.material.uniforms.uPlaneSizes.value = {
      x: meshRef.current.scale.x,
      y: meshRef.current.scale.y,
    };

    const padding = 2;
    const width = meshRef.current.scale.x + padding;

    widthTotal.current = width * length;
    x.current = width * index;
  }, [viewport, size]);

  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTexture: { value: texture },
        uPlaneSizes: { value: { x: 0, y: 0 } },
        uImageSizes: {
          value: {
            x: texture.source.data.width,
            y: texture.source.data.height,
          },
        },
        uViewportSizes: { value: { x: viewport.width, y: viewport.height } },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    };
  }, [texture]);

  useFrame(() => {
    meshRef.current.position.x = x.current;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <rawShaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
