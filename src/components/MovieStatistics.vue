<script setup lang="ts">
import BarChart from "@/components/base/BarChart.vue";
import BaseCollapsible from "@/components/base/BaseCollapsible.vue";
import { store } from "@/store";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const totalDurationLabel = computed(() => {
  const hours = Math.floor(store.totalDuration / 60);
  const minutes = store.totalDuration % 60;
  return `${hours} ${i18n.t("hours", hours)}, ${minutes} ${i18n.t("minutes", minutes)}`;
});

const handleDecadeBarClick = (label: string) => {
  store.decadeFilter = label === store.decadeFilter ? "" : label;
};

const handleGenreBarClick = (label: string) => {
  store.genreFilter = label === store.genreFilter ? "" : label;
};
</script>

<template>
  <base-collapsible :title="$t('statistics')" :default-expanded="false">
    <div class="statistics-basic-container">
      <div class="item">
        <span class="label">{{ $t("collectionSize") }}:</span>
        <span class="value">{{ store.totalMovies }} {{ $t("movies", store.totalMovies) }}</span>
      </div>
      <div class="item">
        <span class="label">{{ $t("totalDuration") }}:</span>
        <span class="value">{{ totalDurationLabel }}</span>
      </div>
    </div>
    <div class="statistics-chart-container">
      <bar-chart
        :title="$t('moviesByDecade')"
        :legend="$t('moviesLabel')"
        :labels="store.decades.labels"
        :data="store.decades.counts"
        @bar-click="handleDecadeBarClick"
      />
      <bar-chart
        :title="$t('moviesByGenre')"
        :legend="$t('moviesLabel')"
        :labels="store.genres.labels"
        :data="store.genres.counts"
        @bar-click="handleGenreBarClick"
      />
    </div>
  </base-collapsible>
</template>

<style scoped lang="scss">
.statistics-basic-container {
  padding: 0.5rem 0.5rem 0.5rem 0.6rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 1rem;
  border: 1px solid #3e4451;
  border-radius: 4px;

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
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
