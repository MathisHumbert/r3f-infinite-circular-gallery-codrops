import React, { useEffect, useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import useScrollStore from './store/scrollStore';
import { map } from './utils';

export default function Media({ geometry, image, text, index, length }) {
  const x = useRef(0);
  const widthTotal = useRef(0);
  const extra = useRef(0);
  const isAfter = useRef(false);
  const isBefore = useRef(false);
  const meshRef = useRef();
  const { viewport, size } = useThree();
  const texture = useTexture(image);
  const scroll = useScrollStore((state) => state.scroll);
  const direction = useScrollStore((state) => state.direction);
  const speed = useScrollStore((state) => state.speed);

  useEffect(() => {
    if (meshRef.current === undefined) return;

    meshRef.current.material.uniforms.uViewportSizes.value = {
      x: viewport.width,
      y: viewport.height,
    };

    const scale = size.height / 1500;

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
        uTime: { value: 0 },
        uSpeed: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    };
  }, [texture]);

  useFrame(() => {
    meshRef.current.material.uniforms.uTime.value += 0.04;
    meshRef.current.material.uniforms.uSpeed.value = speed;

    meshRef.current.position.x = x.current - scroll * 0.5 - extra.current;
    meshRef.current.position.y =
      Math.cos((meshRef.current.position.x / widthTotal.current) * Math.PI) *
        75 -
      75;

    meshRef.current.rotation.z = map(
      meshRef.current.position.x,
      -widthTotal.current,
      widthTotal.current,
      Math.PI,
      -Math.PI
    );

    const planeOffset = meshRef.current.scale.x / 2;

    isBefore.current =
      meshRef.current.position.x + planeOffset < -viewport.width;
    isAfter.current = meshRef.current.position.x - planeOffset > viewport.width;

    if (direction === 'right' && isBefore.current) {
      extra.current -= widthTotal.current;

      isAfter.current = false;
      isBefore.current = false;
    }

    if (direction === 'left' && isAfter.current) {
      extra.current += widthTotal.current;

      isAfter.current = false;
      isBefore.current = false;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <rawShaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
