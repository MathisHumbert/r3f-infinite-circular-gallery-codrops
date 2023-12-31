precision mediump float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;

void main(){
  vUv = uv;

  vec3 p = position;
  p.z += (sin(p.x * 4. + uTime) * 1.5 + cos(p.y * 2. + uTime) * 1.5) * (0.1 + min(uSpeed, 2.) * 0.25);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}