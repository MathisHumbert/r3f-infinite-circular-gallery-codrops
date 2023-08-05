import React, { useEffect, useMemo, useRef } from 'react';
import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import useScrollStore from './store/scrollStore';
import { map } from './utils';

export default function GalleryItem({
  geometry,
  image,
  title,
  number,
  index,
  length,
}) {
  const x = useRef(0);
  const widthTotal = useRef(0);
  const extra = useRef(0);
  const isAfter = useRef(false);
  const isBefore = useRef(false);
  const groupRef = useRef();
  const mediaRef = useRef();
  const titleRef = useRef();
  const numberRef = useRef();

  const { viewport, size } = useThree();
  const texture = useTexture(image);
  const scroll = useScrollStore((state) => state.scroll);
  const direction = useScrollStore((state) => state.direction);
  const speed = useScrollStore((state) => state.speed);

  useEffect(() => {
    if (mediaRef.current === undefined) return;

    mediaRef.current.material.uniforms.uViewportSizes.value = {
      x: viewport.width,
      y: viewport.height,
    };

    const scale = size.height / 1500;

    mediaRef.current.scale.x = (viewport.width * (700 * scale)) / size.width;
    mediaRef.current.scale.y = (viewport.height * (900 * scale)) / size.height;

    mediaRef.current.material.uniforms.uPlaneSizes.value = {
      x: mediaRef.current.scale.x,
      y: mediaRef.current.scale.y,
    };

    titleRef.current.position.y = -mediaRef.current.scale.y * 0.5 - 1.25;
    numberRef.current.position.y = -mediaRef.current.scale.y * 0.5 - 0.5;

    const padding = 2;
    const width = mediaRef.current.scale.x + padding;

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
    mediaRef.current.material.uniforms.uTime.value += 0.04;
    mediaRef.current.material.uniforms.uSpeed.value = speed;

    groupRef.current.position.x = x.current - scroll * 0.5 - extra.current;
    groupRef.current.position.y =
      Math.cos((groupRef.current.position.x / widthTotal.current) * Math.PI) *
        75 -
      75;

    groupRef.current.rotation.z = map(
      groupRef.current.position.x,
      -widthTotal.current,
      widthTotal.current,
      Math.PI,
      -Math.PI
    );

    const planeOffset = mediaRef.current.scale.x / 2;

    isBefore.current =
      groupRef.current.position.x + planeOffset < -viewport.width;
    isAfter.current =
      groupRef.current.position.x - planeOffset > viewport.width;

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
    <group ref={groupRef}>
      {/* Media */}
      <mesh ref={mediaRef} geometry={geometry}>
        <rawShaderMaterial args={[shaderArgs]} />
      </mesh>
      {/* Number */}
      <Text
        ref={numberRef}
        font='forma.woff'
        fontSize={0.2}
        color='#545050'
        textAlign='center'
        letterSpacing={0.05}
      >
        {number + 1 < 10 ? `0${number + 1}` : number + 1}
      </Text>
      {/* Title */}
      <Text
        ref={titleRef}
        font='freight.woff'
        fontSize={0.75}
        color='#545050'
        textAlign='center'
      >
        {title}
      </Text>
    </group>
  );
}
