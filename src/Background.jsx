import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { random } from './utils/index';
import useScrollStore from './store/scrollStore';

export default function Background() {
  const donuts = useRef([]);
  const { viewport } = useThree();
  const scroll = useScrollStore((state) => state.scroll);
  const direction = useScrollStore((state) => state.direction);

  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: '#c4c3b6' });

  useEffect(() => {
    donuts.current.forEach((donut) => {
      const scale = random(0.75, 1);

      donut.scale.x = 1.6 * scale;
      donut.scale.y = 0.9 * scale;

      donut.speed = random(0.75, 1);
      donut.extra = 0;

      donut.x = donut.position.x = random(
        -viewport.width * 0.5,
        viewport.width * 0.5
      );
      donut.y = donut.position.y = random(
        -viewport.height * 0.5,
        viewport.height * 0.5
      );
      donut.position.z -= 2;
    });
  }, []);

  useEffect(() => {
    donuts.current.forEach((donut) => {
      donut.x = donut.position.x = random(
        -viewport.width * 0.5,
        viewport.width * 0.5
      );
      donut.y = donut.position.y = random(
        -viewport.height * 0.5,
        viewport.height * 0.5
      );
    });
  }, [viewport]);

  useFrame(() => {
    donuts.current.forEach((donut) => {
      donut.position.x = donut.x - scroll * donut.speed - donut.extra;

      const viewportOffset = viewport.width * 0.5;
      const widthTotal = viewport.width + donut.scale.x;

      donut.isBefore = donut.position.x < -viewportOffset;
      donut.isAfter = donut.position.x > viewportOffset;

      if (direction === 'right' && donut.isBefore) {
        donut.extra -= widthTotal;

        donut.isBefore = false;
        donut.isAfter = false;
      }

      if (direction === 'left' && donut.isAfter) {
        donut.extra += widthTotal;

        donut.isBefore = false;
        donut.isAfter = false;
      }

      donut.position.y += 0.05 * donut.speed;

      if (donut.position.y > viewport.height * 0.5 + donut.scale.y) {
        donut.position.y -= viewport.height + donut.scale.y + 2;
      }
    });
  });

  return (
    <>
      {[...Array(50)].map((_, index) => (
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
