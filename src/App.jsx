import { useEffect } from 'react';
import * as THREE from 'three';

import Media from './Media';
import images from './data/images';

const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 50);

function App() {
  const onResize = (e) => {};

  const onWheel = (e) => {};

  const onTouchDown = (e) => {};

  const onTouchMove = (e) => {};

  const onTouchUp = (e) => {};

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

export default App;
