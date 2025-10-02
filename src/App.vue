<script setup lang="ts">
import MovieCollection from "./components/MovieCollection.vue";
import LastAddedMovies from "./components/LastestMovies.vue";
</script>

<template>
  <div class="content-wrapper">
    <last-added-movies class="margin-bottom-2rem" />
    <movie-collection />
  </div>
</template>

<style scoped>
.content-wrapper {
  padding: 1rem;
  min-height: 100vh;
}
</style>
