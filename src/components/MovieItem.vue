<script setup lang="ts">
import { Movie } from "@/entity/movie";
import { ref } from "vue";

interface Props {
  movie: Movie;
  isExpanded: boolean;
}

interface Emits {
  (e: "toggle-expand", id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const synopsis = ref<boolean>(false);

const toggleExpand = () => {
  synopsis.value = false;
  emit("toggle-expand", props.movie.id);
};

const toggleSynopsis = () => {
  synopsis.value = !synopsis.value;
};
</script>

<template>
  <div class="movie-container" @click="toggleExpand">
    <div class="movie" :style="{ backgroundImage: `url('/thumbs/${movie.image}.jpg')` }">
      <div class="movie-inner" :class="{ active: isExpanded }">
        <template v-if="isExpanded">
          <div class="data-container" v-show="!synopsis">
            <div class="original-title">{{ movie.originalTitle }}</div>
            <div class="duration">{{ movie.duration }} min</div>
            <div class="director">{{ movie.directors.join(", ") }}</div>
            <div class="cast">{{ movie.actors.join(", ") }}</div>
            <div class="rating">{{ $t("critic") }}: {{ Movie.ratingLabel(movie.criticRating) }}</div>
            <div class="rating">{{ $t("audience") }}: {{ Movie.ratingLabel(movie.audienceRating) }}</div>
            <div class="video">{{ movie.videoFormat }}</div>
            <div class="synopsis-link" @click.stop="toggleSynopsis">
              <span class="synopsis-text">{{ $t("synopsis") }}</span>
              <span class="material-icons">open_in_new</span>
            </div>
          </div>
          <div class="synopsis-container" v-show="synopsis">
            <div class="synopsis">{{ movie.overview }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class="title">{{ movie.title }}</div>
    <div class="subtitle">{{ movie.year }}</div>
  </div>
</template>

<style scoped lang="scss">
.movie-container {
  text-align: center;

  .movie {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    background-size: cover;
    background-position: center;
    border-radius: 0.3em;
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
        padding: 0.5em;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 0.4em;

        .original-title {
          font-size: 0.8em;
          line-height: 1.1em;
          font-weight: bold;
          color: #f2f1ed;
        }

        .duration,
        .rating {
          font-size: 0.7em;
        }

        .director,
        .cast {
          font-size: 0.7em;
          color: #f2f1ed;
          line-height: 0.9em;
        }

        .video {
          font-size: 0.7em;
          font-style: italic;
        }

        .synopsis-link {
          margin-top: 0.3em;
          font-size: 0.9em;
          font-style: italic;
          color: #93d0e4;
          display: inline-flex;
          align-items: center;
          gap: 0.2em;

          .synopsis-text {
            text-decoration: underline;

            &:hover {
              text-decoration: none;
            }
          }

          .material-icons {
            font-size: 0.9em;
          }
        }
      }

      .synopsis-container {
        padding: 0.2em;
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;

        .synopsis {
          padding-right: 0.25em;
          font-size: 0.7em;
          line-height: 1.1em;
          flex: 1 1 auto;
          box-sizing: border-box;
          overflow-y: auto;
          word-break: break-word;
          hyphens: auto;
        }
      }
    }
  }

  .title {
    margin-top: 0.1em;
    line-height: 1.1em;
    font-size: 0.8em;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .subtitle {
    margin-top: 0.1em;
    font-size: 0.7em;
    opacity: 0.7;
  }
}
</style>
