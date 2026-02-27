<template>
  <canvas ref="canvasRef" class="orbCanvas" aria-hidden="true"></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const canvasRef = ref(null);
let ctx;
let rafId = 0;
let resizeObserver;
let reduceMotionMq;
let points = [];
let width = 0;
let height = 0;
let dpr = 1;
let rotation = 0;

const POINT_COUNT = 170;
const RADIUS = 95;
const MIN_DESKTOP_WIDTH = 900;

function makeSpherePoints() {
  points = [];
  for (let i = 0; i < POINT_COUNT; i += 1) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    points.push({
      x: RADIUS * Math.sin(phi) * Math.cos(theta),
      y: RADIUS * Math.sin(phi) * Math.sin(theta),
      z: RADIUS * Math.cos(phi),
      seed: Math.random() * Math.PI * 2,
    });
  }
}

function isEnabled() {
  const reduced = Boolean(reduceMotionMq?.matches);
  return !reduced && window.innerWidth >= MIN_DESKTOP_WIDTH;
}

function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  width = Math.max(1, rect.width);
  height = Math.max(1, rect.height);
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw() {
  if (!ctx || !isEnabled()) return;

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim() || "#79c6a0";
  const accent2 = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-2")
    .trim() || "#7ca9f0";

  ctx.clearRect(0, 0, width, height);
  rotation += 0.008;

  const cx = width * 0.5;
  const cy = height * 0.5;
  const camera = 260;

  // Soft outer glow to anchor the 3D object.
  const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 160);
  glow.addColorStop(0, `${accent}44`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, 160, 0, Math.PI * 2);
  ctx.fill();

  for (const p of points) {
    const wobble = Math.sin(rotation * 0.9 + p.seed) * 1.8;

    const x1 = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
    const z1 = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
    const y1 = p.y * Math.cos(rotation * 0.6) - z1 * Math.sin(rotation * 0.6) + wobble;
    const z2 = p.y * Math.sin(rotation * 0.6) + z1 * Math.cos(rotation * 0.6);

    const scale = camera / (camera + z2 + 120);
    const x = cx + x1 * scale;
    const y = cy + y1 * scale;
    const size = Math.max(0.9, 2.8 * scale);

    const t = (z2 + RADIUS) / (2 * RADIUS);
    ctx.fillStyle = t > 0.55 ? `${accent}` : `${accent2}`;
    ctx.globalAlpha = 0.22 + t * 0.58;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  rafId = requestAnimationFrame(draw);
}

function start() {
  if (rafId) cancelAnimationFrame(rafId);
  if (!isEnabled()) {
    ctx?.clearRect(0, 0, width, height);
    return;
  }
  draw();
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  if (!ctx) return;

  reduceMotionMq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  makeSpherePoints();
  resizeCanvas();

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(canvas);

  window.addEventListener("resize", start, { passive: true });
  reduceMotionMq?.addEventListener?.("change", start);

  start();
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  window.removeEventListener("resize", start);
  reduceMotionMq?.removeEventListener?.("change", start);
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.orbCanvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
