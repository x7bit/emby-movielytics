<script setup lang="ts">
import { computed, ref } from "vue";
import moviesJson from "../assets/movies.json";
import { Movie } from "../entity/movie";
import BaseButton from "./base/BaseButton.vue";
import BaseInput from "./base/BaseInput.vue";
import MovieComponent from "./Movie.vue";

type SortType = "title" | "year" | "critic" | "audience";

const movies = ref<Movie[]>((moviesJson as Movie[]).sort(Movie.sortByTitle));
const search = ref("");
const sortType = ref<SortType>("title");
const sortAsc = ref(true);
const expandedMovieId = ref<string | null>(null);

const filteredMovies = computed(() => {
  if (!search.value) return movies.value;
  const term = search.value.toLowerCase();
  return movies.value.filter(movie => {
    return (
      movie.title.toLowerCase().includes(term) ||
      movie.originalTitle.toLowerCase().includes(term) ||
      movie.directors.join(" ").toLowerCase().includes(term) ||
      movie.actors.join(" ").toLowerCase().includes(term)
    );
  });
});

const sortMovies = (type: SortType): void => {
  let asc = true;
  switch (type) {
    case "title":
      asc = type === sortType.value ? !sortAsc.value : true;
      movies.value.sort((a, b) => (asc ? Movie.sortByTitle(a, b) : Movie.sortByTitle(b, a)));
      break;
    case "year":
      asc = type === sortType.value ? !sortAsc.value : false;
      movies.value.sort((a, b) => (asc ? Movie.sortByYear(a, b) : Movie.sortByYear(b, a)));
      break;
    case "critic":
      asc = type === sortType.value ? !sortAsc.value : false;
      movies.value.sort((a, b) => (asc ? Movie.sortByCriticRating(a, b) : Movie.sortByCriticRating(b, a)));
      break;
    case "audience":
      asc = type === sortType.value ? !sortAsc.value : false;
      movies.value.sort((a, b) => (asc ? Movie.sortByAudienceRating(a, b) : Movie.sortByAudienceRating(b, a)));
      break;
  }
  sortType.value = type;
  sortAsc.value = asc;
};

const getSortIcon = (type: SortType): string => {
  if (sortType.value !== type) return "unfold_more";
  return sortAsc.value ? "keyboard_arrow_up" : "keyboard_arrow_down";
};

const toggleExpand = (id: string) => {
  const newId = expandedMovieId.value === id ? null : id;
  expandedMovieId.value = newId;
};
</script>

<template>
  <div class="movie-controls">
    <base-input v-model="search" placeholder="Título, actor o director" clearable />
    <div class="movie-sort">
      <base-button :icon-right="getSortIcon('title')" @click="sortMovies('title')">Título</base-button>
      <base-button :icon-right="getSortIcon('year')" @click="sortMovies('year')">Año</base-button>
      <base-button :icon-right="getSortIcon('critic')" @click="sortMovies('critic')">Crítica</base-button>
      <base-button :icon-right="getSortIcon('audience')" @click="sortMovies('audience')">Audiencia</base-button>
    </div>
  </div>

  <transition-group v-if="movies.length > 0" name="fade" tag="div" class="movie-grid">
    <movie-component
      v-for="movie in filteredMovies"
      :key="movie.id"
      :movie="movie"
      :is-expanded="expandedMovieId === movie.id"
      @toggle-expand="toggleExpand"
    />
  </transition-group>

  <transition name="fade">
    <div v-if="filteredMovies.length === 0" class="no-results">Sin resultados...</div>
  </transition>
</template>

<style scoped lang="scss">
.movie-controls {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;

  .movie-sort {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

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
