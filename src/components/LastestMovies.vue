<script setup lang="ts">
import BaseCollapsible from "@/components/base/BaseCollapsible.vue";
import LastestMovieGrid from "@/components/LastestMovieGrid.vue";
</script>

<template>
  <base-collapsible :title="$t('lastestMovies')" :default-expanded="false">
    <lastest-movie-grid />
  </base-collapsible>
</template>
