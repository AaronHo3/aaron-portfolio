<template>
  <component :is="as" class="textShimmer" :class="className" :style="shimmerStyle">
    <slot />
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  as: { type: String, default: "span" },
  className: { type: String, default: "" },
  duration: { type: Number, default: 2 },
  spread: { type: Number, default: 2 },
  text: { type: String, default: "" },
});

const dynamicSpread = computed(() => {
  const len = props.text?.length || 10;
  return len * props.spread;
});

const shimmerStyle = computed(() => ({
  "--shimmer-spread": `${dynamicSpread.value}px`,
  "--shimmer-duration": `${props.duration}s`,
}));
</script>

<style scoped>
.textShimmer {
  display: inline-block;
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image:
    linear-gradient(
      90deg,
      transparent calc(50% - var(--shimmer-spread)),
      var(--shimmer-highlight, #ffffff),
      transparent calc(50% + var(--shimmer-spread))
    ),
    linear-gradient(var(--shimmer-base, #71717a), var(--shimmer-base, #71717a));
  background-repeat: no-repeat, padding-box;
  animation: shimmerSlide var(--shimmer-duration) linear infinite;
}

@keyframes shimmerSlide {
  from {
    background-position: 100% center;
  }
  to {
    background-position: 0% center;
  }
}
</style>
