import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import NormalizeWheel from 'normalize-wheel';
import debounce from 'lodash/debounce';
import Media from './Media';
import useScrollStore from './store/scrollStore';
import { lerp } from './utils';
import images from './data/images';

const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 50);

export default function App() {
  const scroll = useRef({
    current: 0,
    target: 0,
    last: 0,
    position: 0,
    start: 0,
    speed: 0,
    ease: 0.05,
  });
  const isDown = useRef(false);
  const mediaWidth = useRef(0);
  const { viewport, size } = useThree();
  const setScroll = useScrollStore((state) => state.setScroll);
  const setDirection = useScrollStore((state) => state.setDirection);
  const setSpeed = useScrollStore((state) => state.setSpeed);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    window.addEventListener('wheel', onWheel);

    window.addEventListener('mousedown', onTouchDown);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchUp);

    window.addEventListener('touchstart', onTouchDown);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchUp);

    () => {
      window.removeEventListener('resize', onResize);

      window.removeEventListener('wheel', onWheel);

      window.removeEventListener('mousedown', onTouchDown);
      window.removeEventListener('mousemove', onTouchMove);
      window.removeEventListener('mouseup', onTouchUp);

      window.removeEventListener('touchstart', onTouchDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchUp);
    };
  }, []);

  useEffect(() => {
    const scale = size.height / 1500;
    const padding = 2;

    mediaWidth.current =
      (viewport.width * (700 * scale)) / size.width + padding;
  }, [viewport, size]);

  useFrame(() => {
    scroll.current.current = lerp(
      scroll.current.current,
      scroll.current.target,
      scroll.current.ease
    );

    if (scroll.current.current > scroll.current.last) {
      setDirection('right');
    } else {
      setDirection('left');
    }

    scroll.current.speed = scroll.current.current - scroll.current.last;
    scroll.current.last = scroll.current.current;

    setScroll(scroll.current.current);
    setSpeed(scroll.current.speed);
  });

  const onResize = (event) => {};

  const onWheel = (event) => {
    const normalized = NormalizeWheel(event);
    const speed = normalized.pixelY;

    scroll.current.target += speed * 0.01;

    onCheckDebounce();
  };

  const onTouchDown = (event) => {
    isDown.current = true;

    scroll.current.position = scroll.current.current;
    scroll.current.start = event.touches
      ? event.touches[0].clientX
      : event.clientX;
  };

  const onTouchMove = (event) => {
    if (!isDown.current) return;

    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const distance = (scroll.current.start - x) * 0.05;

    scroll.current.target = scroll.current.position + distance;
  };

  const onTouchUp = () => {
    isDown.current = false;

    onCheckDebounce();
  };

  const onCheck = () => {
    const mediaIndex = Math.round(
      Math.abs(scroll.current.target / (mediaWidth.current * 2))
    );
    const media = mediaWidth.current * (mediaIndex * 2);

    if (scroll.current.target < 0) {
      scroll.current.target = -media;
    } else {
      scroll.current.target = media;
    }
  };

  const onCheckDebounce = debounce(onCheck, 200);

  return (
    <>
      {images.map(({ image, text }, index) => (
        <Media
          key={index}
          geometry={planeGeometry}
          image={image}
          text={text}
          index={index}
          length={images.length}
        />
      ))}
    </>
  );
}
