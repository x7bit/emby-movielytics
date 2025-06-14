<script setup lang="ts">
defineProps<{
  iconRight?: string;
}>();
</script>

<template>
  <button class="base-button">
    <slot></slot>
    <span v-if="iconRight" class="material-icons icon-right">{{ iconRight }}</span>
  </button>
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  font-weight: 500;
  color: #e6e1cf;
  background-color: #1f2430;
  border: 1px solid #3e4451;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.5;

  &:hover {
    background-color: #2d3344;
    border-color: #39bae6;
    color: #ffffff;
  }

  &:active {
    background-color: #394050;
  }

  .icon-right {
    font-size: 1rem;
    line-height: 1;
  }
}
</style>
