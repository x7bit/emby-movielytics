<script setup lang="ts">
import MovieItem from "@/components/MovieItem.vue";
import { store } from "@/store";
import { ref } from "vue";

const expandedMovieId = ref<string | null>(null);

const toggleExpand = (id: string) => {
  const newId = expandedMovieId.value === id ? null : id;
  expandedMovieId.value = newId;
};
</script>

<template>
  <transition-group v-if="store.latestMovies.length > 0" name="fade" tag="div" class="latest-grid">
    <movie-item
      v-for="movie in store.latestMovies"
      class="latest-item"
      :key="movie.id"
      :movie="movie"
      :is-expanded="expandedMovieId === movie.id"
      @toggle-expand="toggleExpand"
    />
  </transition-group>

  <transition name="fade">
    <div v-if="store.latestMovies.length === 0" class="no-results">{{ $t("noMovies") }}</div>
  </transition>
</template>

<style scoped lang="scss">
.latest-grid {
  padding-bottom: 1rem;
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 1.1rem;

  .latest-item {
    flex: 1 1 200px;
    min-width: 200px;
    max-width: 1fr;
    display: flex;
    flex-direction: column;
  }
}

.no-results {
  text-align: center;
  color: #ccc;
  font-size: 1.8rem;
  padding: 2rem;
}

@media (max-width: 363px) {
  .latest-grid {
    font-size: 0.7rem;

    .latest-item {
      flex: 1 1 120px;
      min-width: 120px;
    }
  }
}

@media (max-width: 464px) and (min-width: 363px) {
  .latest-grid {
    font-size: 0.9rem;

    .latest-item {
      flex: 1 1 150px;
      min-width: 150px;
    }
  }
}
</style>
