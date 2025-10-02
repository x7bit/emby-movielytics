<script setup lang="ts">
import { computed, ref } from "vue";
import moviesJson from "../assets/movies.json";
import { Movie } from "../entity/movie";
import BaseButton from "./base/BaseButton.vue";
import BaseInput from "./base/BaseInput.vue";
import MovieGrid from "./MovieGrid.vue";

type SortType = "title" | "year" | "critic" | "audience";

const movies = ref<Movie[]>((moviesJson as Movie[]).sort(Movie.sortByTitle));
const search = ref("");
const sortType = ref<SortType>("title");
const sortAsc = ref(true);

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
</script>

<template>
  <div class="movie-controls">
    <base-input v-model="search" class="movie-search" placeholder="Título, actor o director" clearable />
    <div class="movie-sort">
      <base-button class="movie-sort-btn" :icon-right="getSortIcon('title')" @click="sortMovies('title')">
        Título
      </base-button>
      <base-button class="movie-sort-btn" :icon-right="getSortIcon('year')" @click="sortMovies('year')">
        Año
      </base-button>
      <base-button class="movie-sort-btn" :icon-right="getSortIcon('critic')" @click="sortMovies('critic')">
        Crítica
      </base-button>
      <base-button class="movie-sort-btn" :icon-right="getSortIcon('audience')" @click="sortMovies('audience')">
        Audiencia
      </base-button>
    </div>
  </div>

  <movie-grid :movies="filteredMovies" />
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

@media (max-width: 750px) {
  .movie-controls {
    .movie-search {
      flex: 1 1 auto;

      .movie-search input {
        flex: 1 1 auto;
      }
    }

    .movie-sort {
      flex: 1 1 auto;

      .movie-sort-btn {
        flex: 1 1 auto;
      }
    }
  }
}

@media (max-width: 500px) {
  .movie-controls {
    .movie-sort {
      .movie-sort-btn {
        flex: 1 1 calc(50% - 0.5rem);
      }
    }
  }
}

@media (max-width: 320px) {
  .movie-controls {
    .movie-sort {
      .movie-sort-btn {
        flex: 1 1 100%;
      }
    }
  }
}
</style>
