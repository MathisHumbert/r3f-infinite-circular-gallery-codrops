import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

import App from './App.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Canvas camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 20] }}>
      <App />
    </Canvas>
  </React.StrictMode>
);
