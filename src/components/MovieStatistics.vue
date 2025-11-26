<script setup lang="ts">
import moviesJson from "@/assets/movies.json";
import BarChart from "@/components/base/BarChart.vue";
import BaseCollapsible from "@/components/base/BaseCollapsible.vue";
import { Movie } from "@/entity/movie";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const movies = ref<Movie[]>(moviesJson as Movie[]);

const totalMovies = computed(() => movies.value.length);
const totalDuration = computed(() => movies.value.reduce((sum, movie) => sum + movie.duration, 0));

const totalDurationLabel = computed(() => {
  const hours = Math.floor(totalDuration.value / 60);
  const minutes = totalDuration.value % 60;
  return `${hours} ${i18n.t("hours", hours)}, ${minutes} ${i18n.t("minutes", minutes)}`;
});

const decadeMap = computed(() => {
  const map = new Map<string, number>();
  movies.value.forEach(movie => {
    const decade = `${Math.floor(movie.year / 10) * 10}s`;
    map.set(decade, (map.get(decade) ?? 0) + 1);
  });
  return map;
});

const decadeLabels = computed(() => {
  const decades = Array.from(decadeMap.value.keys()).map(label => parseInt(label));
  const minDecade = Math.min(...decades);
  const maxDecade = Math.max(...decades);
  const range: string[] = [];
  for (let decade = minDecade; decade <= maxDecade; decade += 10) {
    range.push(`${decade}s`);
  }
  return range;
});

const decadeCount = computed(() => {
  return decadeLabels.value.map(decade => decadeMap.value.get(decade) ?? 0);
});

const genreMap = computed(() => {
  const map = new Map<string, number>();
  movies.value.forEach(movie => {
    movie.genres.forEach(genreRaw => {
      const genre = Movie.genreLabel(genreRaw);
      map.set(genre, (map.get(genre) ?? 0) + 1);
    });
  });
  return map;
});

const genreLabels = computed(() => {
  const genres = Array.from(genreMap.value.keys());
  return genres.filter(genre => (genreMap.value.get(genre) ?? 0) >= 10).sort();
});

const genreCount = computed(() => {
  return genreLabels.value.map(genre => genreMap.value.get(genre) ?? 0);
});
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
        <span class="value">{{ totalDurationLabel }}</span>
      </div>
    </div>
    <div class="statistics-chart-container">
      <bar-chart :title="$t('moviesByDecade')" :labels="decadeLabels" :data="decadeCount" />
      <bar-chart :title="$t('moviesByGenre')" :labels="genreLabels" :data="genreCount" />
    </div>
  </base-collapsible>
</template>

<style scoped lang="scss">
.statistics-basic-container {
  padding-bottom: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 2rem;
  border-bottom: 1px solid #3e4451;

  .item {
    font-size: 1rem;
    text-align: center;

    .label {
      font-weight: bold;
      margin-right: 0.5rem;
    }
  }
}

.statistics-chart-container {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
