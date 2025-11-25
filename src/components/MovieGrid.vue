<script setup lang="ts">
import MovieItem from "@/components/MovieItem.vue";
import { Movie } from "@/entity/movie";
import { ref } from "vue";

interface Props {
  movies: Movie[];
}

defineProps<Props>();
const expandedMovieId = ref<string | null>(null);

const toggleExpand = (id: string) => {
  const newId = expandedMovieId.value === id ? null : id;
  expandedMovieId.value = newId;
};
</script>

<template>
  <transition-group v-if="movies.length > 0" name="fade" tag="div" class="movie-grid">
    <movie-item
      v-for="movie in movies"
      :key="movie.id"
      :movie="movie"
      :is-expanded="expandedMovieId === movie.id"
      @toggle-expand="toggleExpand"
    />
  </transition-group>

  <transition name="fade">
    <div v-if="movies.length === 0" class="no-results">{{ $t("noResults") }}</div>
  </transition>
</template>

<style scoped lang="scss">
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  font-size: clamp(1.1rem, 2.2vw, 1.2rem);
}

.no-results {
  text-align: center;
  color: #ccc;
  font-size: 1.8rem;
  padding: 2rem;
}

@media (max-width: 303px) {
  .movie-grid {
    font-size: clamp(1.1rem, 9vw, 1.3rem);
  }
}

@media (max-width: 363px) and (min-width: 303px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    font-size: clamp(0.7rem, 4vw, 0.9rem);
  }
}

@media (max-width: 464px) and (min-width: 363px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    font-size: clamp(0.9rem, 4vw, 1.1rem);
  }
}
</style>
