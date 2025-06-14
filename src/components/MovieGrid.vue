<script setup lang="ts">
import { computed, ref } from "vue";
import moviesJson from "../assets/movies.json";
import { Movie } from "../entity/movie";
import BaseButton from "./base/BaseButton.vue";
import BaseInput from "./base/BaseInput.vue";

type SortType = "title" | "year" | "critic" | "audience";

const movies = ref<Movie[]>((moviesJson as Movie[]).sort(Movie.sortByTitle));
const search = ref("");
const sortType = ref<SortType>("title");
const sortAsc = ref(true);
const expandedMovieId = ref<string | null>(null);
const synopsis = ref<boolean>(false);

const filteredMovies = computed(() => {
  if (!search.value) return movies.value;
  const term = search.value.toLowerCase();
  return movies.value.filter(movie => {
    return (
      movie.title.toLowerCase().includes(term) ||
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

const getSortIcon = (type: SortType): string | undefined => {
  if (sortType.value !== type) return undefined;
  return sortAsc.value ? "keyboard_arrow_up" : "keyboard_arrow_down";
};

const toggleExpand = (id: string) => {
  const newId = expandedMovieId.value === id ? null : id;
  expandedMovieId.value = newId;
  synopsis.value = false;
};

const toggleSynopsis = () => {
  synopsis.value = !synopsis.value;
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

  <transition-group name="fade" tag="div" class="movie-grid">
    <div v-for="movie in filteredMovies" :key="movie.id" class="movie-container" @click="toggleExpand(movie.id)">
      <div class="movie" :style="{ backgroundImage: `url('/thumbs/${movie.image}.jpg')` }">
        <div class="movie-inner" :class="{ active: expandedMovieId === movie.id }">
          <div class="data-container" v-if="expandedMovieId === movie.id && !synopsis">
            <div class="original-title">{{ movie.originalTitle }}</div>
            <div class="duration">{{ movie.duration }} min</div>
            <div class="director">{{ movie.directors.join(", ") }}</div>
            <div class="cast">{{ movie.actors.join(", ") }}</div>
            <div class="rating">Crítica: {{ Movie.ratingLabel(movie.criticRating) }}</div>
            <div class="rating">Audiencia: {{ Movie.ratingLabel(movie.audienceRating) }}</div>
            <div class="video">{{ movie.videoFormat }}</div>
            <div class="synopsis-link" @click.stop="toggleSynopsis">
              <span class="synopsis-text">Sinopsis</span>
              <span class="material-icons">open_in_new</span>
            </div>
          </div>
          <div class="synopsis-container" v-show="expandedMovieId === movie.id && synopsis">
            <div class="synopsis">{{ movie.overview }}</div>
          </div>
        </div>
      </div>
      <div class="title">{{ movie.title }}</div>
      <div class="subtitle">{{ movie.year }}</div>
    </div>
  </transition-group>

  <transition name="fade">
    <div v-if="filteredMovies.length === 0" class="no-results">Sin resultados...</div>
  </transition>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-move {
  transition: transform 0.3s ease;
}
</style>

<style scoped lang="scss">
.movie-controls {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;

  .movie-sort {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;

  .movie-container {
    text-align: center;

    .movie {
      position: relative;
      width: 100%;
      aspect-ratio: 2 / 3;
      background-size: cover;
      background-position: center;
      border-radius: 0.3rem;
      overflow: hidden;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
      cursor: pointer;

      .movie-inner {
        height: 100%;
        width: 100%;

        background-color: rgba(0, 0, 0, 0.75);
        opacity: 0;
        transition: opacity 0.3s ease-in-out;

        &.active {
          opacity: 1;
        }

        .data-container {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          gap: 0.4rem;

          .original-title {
            font-size: 0.9rem;
            font-weight: bold;
            color: #f2f1ed;
          }

          .duration,
          .rating {
            font-size: 0.75rem;
          }

          .director,
          .cast {
            font-size: 0.75rem;
            color: #f2f1ed;
            line-height: 0.8rem;
          }

          .video {
            font-size: 0.75rem;
            font-style: italic;
          }

          .synopsis-link {
            margin-top: 0.3rem;
            font-size: 1rem;
            font-style: italic;
            color: #93d0e4;
            display: inline-flex;
            align-items: center;
            gap: 0.2rem;

            .synopsis-text {
              text-decoration: underline;

              &:hover {
                text-decoration: none;
              }
            }

            .material-icons {
              font-size: 1rem;
            }
          }
        }

        .synopsis-container {
          padding: 0.2rem;

          .synopsis {
            font-size: 0.7rem;
          }
        }
      }
    }

    .title {
      margin-top: 0.1rem;
      line-height: 1.1rem;
      font-size: 0.9rem;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subtitle {
      margin-top: 0.1rem;
      font-size: 0.75rem;
      opacity: 0.7;
    }
  }
}

.no-results {
  text-align: center;
  color: #ccc;
  font-size: 1.8rem;
  padding: 2rem;
  grid-column: 1 / -1;
}
</style>
