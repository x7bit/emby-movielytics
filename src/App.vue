<script setup lang="ts">
import MovieGrid from "./components/MovieGrid.vue";
</script>

<template>
  <div class="content-wrapper">
    <movie-grid />
  </div>
</template>

<style scoped>
.content-wrapper {
  padding: 1rem;
  min-height: 100vh;
}
</style>
