<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import MovieGrid from "@/components/MovieGrid.vue";
import { Movie } from "@/entity/movie";
import { getSortIcon, sortMovies, store } from "@/store";
import { computed } from "vue";

const filteredMovies = computed(() => {
  let _movies = [...store.movies];
  if (store.search) {
    const term = store.search.toLowerCase();
    _movies = _movies.filter(
      movie =>
        movie.title.toLowerCase().includes(term) ||
        movie.originalTitle.toLowerCase().includes(term) ||
        movie.directors.join(" ").toLowerCase().includes(term) ||
        movie.actors.join(" ").toLowerCase().includes(term)
    );
  }
  if (store.decadeFilter) {
    _movies = _movies.filter(movie => Movie.decadeLabel(movie.year) === store.decadeFilter);
  }
  if (store.genreFilter) {
    _movies = _movies.filter(movie => movie.genres.map(genre => Movie.genreLabel(genre)).includes(store.genreFilter ?? ""));
  }
  return _movies;
});
</script>

<template>
  <div class="movie-controls">
    <base-input v-model="store.search" class="movie-search" :placeholder="$t('titleActorDirector')" clearable />
    <div class="movie-sort">
      <base-button class="movie-sort-btn" :icon-right="getSortIcon('title')" @click="sortMovies('title')">
        {{ $t("title") }}
      </base-button>
      <base-button class="movie-sort-btn" :icon-right="getSortIcon('year')" @click="sortMovies('year')">
        {{ $t("year") }}
      </base-button>
      <base-button class="movie-sort-btn" :icon-right="getSortIcon('critic')" @click="sortMovies('critic')">
        {{ $t("critic") }}
      </base-button>
      <base-button class="movie-sort-btn" :icon-right="getSortIcon('audience')" @click="sortMovies('audience')">
        {{ $t("audience") }}
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
