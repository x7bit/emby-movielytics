<script setup lang="ts">
import LastAddedMovies from "@/components/LastestMovies.vue";
import MovieCollection from "@/components/MovieCollection.vue";
import MovieStatistics from "@/components/MovieStatistics.vue";
</script>

<template>
  <div class="content-wrapper">
    <movie-statistics class="margin-bottom-2rem" />
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
