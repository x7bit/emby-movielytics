<script setup lang="ts">
import moviesJson from "@/assets/movies.json";
import BaseCollapsible from "@/components/base/BaseCollapsible.vue";
import { Movie } from "@/entity/movie";
import { computed, ref } from "vue";

const movies = ref<Movie[]>(moviesJson as Movie[]);

const totalMovies = computed(() => movies.value.length);
const totalDuration = computed(() => movies.value.reduce((sum, movie) => sum + movie.duration, 0));
const totalDurationHours = computed(() => Math.floor(totalDuration.value / 60));
const totalDurationMinutes = computed(() => totalDuration.value % 60);
</script>

<template>
  <base-collapsible :title="$t('statistics')" :default-expanded="false">
    <div class="statistics-basic-container">
      <div class="item">
        <span class="label">{{ $t("totalSize") }}:</span>
        <span class="value">{{ totalMovies }} {{ $t("movies", totalMovies) }}</span>
      </div>
      <div class="item">
        <span class="label">{{ $t("totalDuration") }}:</span>
        <span class="value">
          {{ totalDurationHours }} {{ $t("hours", totalDurationHours) }}, {{ totalDurationMinutes }}
          {{ $t("minutes", totalDurationMinutes) }}
        </span>
      </div>
    </div>
  </base-collapsible>
</template>

<style scoped lang="scss">
.statistics-basic-container {
  display: flex;
  justify-content: space-evenly;
  gap: 2rem;

  .item {
    font-size: 1rem;

    .label {
      font-weight: bold;
      margin-right: 0.5rem;
    }
  }
}
</style>
