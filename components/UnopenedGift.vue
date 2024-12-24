<script setup lang="ts">
const props = defineProps({
  gift: Object,
  giftNumber: Number,
});

const emit = defineEmits({
  open: (giftId: string) => ({ giftId }),
});

const open = () => {
  emit("open", props.gift!._id);
};
</script>
<template>
  <div class="flex flex-col items-center gap-y-4 mb-8">
    <h2 class="text-xl font-semibold">Gift {{ giftNumber }}</h2>
    <img src="~/assets/gift.png" alt="Discover Nuxt 3" />

    <button @click="open" class="bg-blue-500 text-white px-2 py-1 rounded">
      Open
    </button>
  </div>
</template>
