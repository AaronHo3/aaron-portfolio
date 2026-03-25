<template>
  <div ref="containerRef" class="shaderContainer" aria-hidden="true" />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as THREE from "three";

const containerRef = ref(null);
let renderer, scene, camera, mesh, uniforms, animationId;

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform float time;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.002;

    vec3 color = vec3(0.0);
    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        color[j] += lineWidth * float(i * i)
          / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
          - length(uv) + mod(uv.x + uv.y, 0.2));
      }
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

function onWindowResize() {
  if (!containerRef.value || !renderer) return;
  const w = containerRef.value.clientWidth;
  const h = containerRef.value.clientHeight;
  renderer.setSize(w, h);
  uniforms.resolution.value.x = renderer.domElement.width;
  uniforms.resolution.value.y = renderer.domElement.height;
}

function animate() {
  animationId = requestAnimationFrame(animate);
  uniforms.time.value += 0.05;
  renderer.render(scene, camera);
}

onMounted(() => {
  if (!containerRef.value) return;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reducedMotion) return;

  camera = new THREE.Camera();
  camera.position.z = 1;
  scene = new THREE.Scene();

  const geometry = new THREE.PlaneGeometry(2, 2);
  uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  containerRef.value.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);
  animate();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onWindowResize);
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer && containerRef.value) {
    containerRef.value.removeChild(renderer.domElement);
    renderer.dispose();
  }
});
</script>

<style scoped>
.shaderContainer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  opacity: 0.35;
  mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, black 30%, transparent 75%);
}

.shaderContainer :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
