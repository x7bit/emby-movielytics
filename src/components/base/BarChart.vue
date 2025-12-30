<script setup lang="ts">
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { onBeforeUnmount, onMounted, ref } from "vue";

Chart.register(BarController, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip);

const props = defineProps<{
  title: string;
  legend?: string;
  labels: string[];
  data: number[];
  selectedLabel?: string;
}>();

const emit = defineEmits<{
  barClick: [label: string];
}>();

const chartEl = ref<HTMLElement | null>(null);
const selectedLabel = ref<string | undefined>(undefined);

let chartInstance: Chart | null = null;

const getBackgroundColors = () => {
  return props.labels.map((label) =>
    label === selectedLabel.value ? "rgba(57, 186, 230, 1)" : "rgba(37, 74, 94, 1)"
  );
};

const handleBarClick = (_event: any, elements: any[]): void => {
  if (elements.length > 0) {
    const index = elements[0].index;
    const label = props.labels[index];
    if (label) {
      selectedLabel.value = label === selectedLabel.value ? undefined : label;
        if (chartInstance?.data.datasets[0]) {
          chartInstance.data.datasets[0].backgroundColor = getBackgroundColors();
          chartInstance.update();
        }
        emit("barClick", label);
    }
  }
};

const handleBarHover = (event: any, elements: any[]) => {
  event.native.target.style.cursor = elements.length > 0 ? "pointer" : "default";
};

onMounted(() => {
  if (!chartEl.value) return;

  chartInstance = new Chart(chartEl.value as HTMLCanvasElement, {
    type: "bar",
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.legend ?? props.title,
          data: props.data,
          backgroundColor: getBackgroundColors(),
          borderColor: "rgba(57, 186, 230, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      onClick: handleBarClick,
      onHover: handleBarHover,
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
    },
  });
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
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
