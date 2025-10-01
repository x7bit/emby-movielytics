<script setup lang="ts">
import BaseCollapsible from "./base/BaseCollapsible.vue";
import LastestMovieGrid from "./LastestMovieGrid.vue";
</script>

<template>
  <base-collapsible title="Últimas películas añadidas" :default-expanded="false">
    <lastest-movie-grid />
  </base-collapsible>
</template>
