<script setup lang="ts">
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from "chart.js";
import { onBeforeUnmount, onMounted, ref } from "vue";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps<{
  title: string;
  labels: string[];
  data: number[];
}>();

const chartEl = ref<HTMLElement | null>(null);
const chartInstance = ref<Chart | null>(null);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      ticks: {
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
      },
    },
  },
};

onMounted(() => {
  if (!chartEl.value) return;

  chartInstance.value = new Chart(chartEl.value as HTMLCanvasElement, {
    type: "bar",
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.title,
          data: props.data,
          backgroundColor: "rgba(57, 186, 230, 0.25)",
          borderColor: "rgba(57, 186, 230, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: options,
  });
});

onBeforeUnmount(() => {
  chartInstance.value?.destroy();
});
</script>

<template>
  <div class="chart-wrapper">
    <canvas ref="chartEl" />
  </div>
</template>

<style scoped lang="scss">
.chart-wrapper {
  flex: 1;
  height: 360px;
  min-width: 640px;
}
</style>
