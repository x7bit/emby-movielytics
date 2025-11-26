<script setup lang="ts">
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { onBeforeUnmount, onMounted, ref } from "vue";

Chart.register(BarController, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip);

const props = defineProps<{
  title: string;
  legend?: string;
  labels: string[];
  data: number[];
}>();

const chartEl = ref<HTMLElement | null>(null);
const chartInstance = ref<Chart | null>(null);

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: props.title,
      color: "rgba(228, 226, 218, 1)",
      font: {
        size: 16,
      },
    },
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(21, 70, 97, 1)",
      titleColor: "rgba(255, 255, 255, 0.9)",
      bodyColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "rgba(3, 167, 222, 1)",
      borderWidth: 1,
      displayColors: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      border: {
        display: false,
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: false,
        color: "rgba(255, 255, 255, 0.7)",
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
          label: props.legend ?? props.title,
          data: props.data,
          backgroundColor: "rgba(37, 74, 94, 1)",
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
  padding: 0.1rem 0.5rem 0.5rem 0.5rem;
  flex: 1;
  height: 360px;
  min-width: 640px;
  border: 1px solid #3e4451;
  border-radius: 4px;
}
</style>
