<script setup lang="ts">
import { ref } from "vue";

interface Props {
  title: string;
  defaultExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: true,
});

const isExpanded = ref(props.defaultExpanded);

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

const getIcon = (): string => {
  return isExpanded.value ? "keyboard_arrow_up" : "keyboard_arrow_down";
};
</script>

<template>
  <div class="base-collapsible">
    <button class="collapsible-header" @click="toggle">
      <span class="title">{{ title }}</span>
      <span class="material-icons icon">{{ getIcon() }}</span>
    </button>

    <transition name="collapse">
      <div v-show="isExpanded" class="collapsible-content">
        <div class="content-body">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.base-collapsible {
  border: 1px solid #3e4451;
  border-radius: 4px;
  background-color: #1f2430;
  overflow: hidden;

  .collapsible-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 0.8rem;
    font-size: 1rem;
    font-weight: 500;
    color: #e6e1cf;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    line-height: 1.5;

    &:hover {
      background-color: #2d3344;
      color: #ffffff;
    }

    &:active {
      background-color: #394050;
    }

    .title {
      flex: 1;
      text-align: left;
    }

    .icon {
      font-size: 1rem;
      line-height: 1;
      transition: transform 0.2s ease;
    }
  }

  .collapsible-content {
    border-top: 1px solid #3e4451;
    background-color: #1f2430;

    .content-body {
      padding: 0.8rem;
    }
  }
}

// Transiciones para el colapso
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px; // Ajusta según necesites
  opacity: 1;
}
</style>
