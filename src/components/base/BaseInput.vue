<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
  clearable?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const clear = () => {
  emit("update:modelValue", "");
};
</script>

<template>
  <div class="base-input">
    <input :value="modelValue" :placeholder="placeholder" @input="updateValue" />
    <button v-if="clearable && modelValue" type="button" @click="clear" class="clear-btn" :aria-label="$t('clear')">✕</button>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 100%;

  input {
    padding: 0.5rem 2rem 0.5rem 0.6rem; // deja espacio para el botón
    background-color: #1f2430;
    color: #e6e1cf;
    border: 1px solid #3e4451;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;

    &:focus {
      outline: none;
      border-color: #39bae6;
    }

    &::placeholder {
      color: #999;
    }
  }

  .clear-btn {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    line-height: 1;

    &:hover {
      color: #fff;
    }
  }
}
</style>
