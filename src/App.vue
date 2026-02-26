<template>
  <Navbar />
  <main class="container">
    <RouterView />
    <footer class="footer">© {{ new Date().getFullYear() }} Aaron Ho</footer>
  </main>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<style scoped>
.footer {
  margin-top: 54px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-weight: 700;
}
</style>