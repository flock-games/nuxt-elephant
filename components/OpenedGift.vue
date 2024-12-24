<script setup lang="ts">
import imageUrlBuilder from "@sanity/image-url";

const props = defineProps({
  gift: Object,
  stealsRemaining: Number,
  ownerName: String,
  isGameOver: Boolean,
});

const emit = defineEmits({
  steal: (giftId: string) => ({ giftId }),
});

const sanity = useSanity();

const canSteal = computed(() => {
  return (
    !props.isGameOver && props.stealsRemaining && props.stealsRemaining > 0
  );
});

const steal = () => {
  emit("steal", props.gift!._id);
};

const urlFor = (source: any) => {
  return builder.image(source);
};

const builder = imageUrlBuilder(sanity.client);
</script>

<template>
  <div
    class="flex flex-col items-center gap-y-2 mb-8"
    :class="{ 'opacity-75': !canSteal }"
  >
    {{ gift!.name }}
    <br />
    <img :src="urlFor(gift!.image).width(200).url()" />
    <div v-if="ownerName">
      {{ ownerName }}
    </div>

    <button
      v-if="canSteal"
      @click="steal"
      class="bg-red-500 text-white px-2 py-1 rounded"
    >
      Steal
    </button>
    <em v-if="canSteal" class="text-sm"
      >{{ stealsRemaining }} steals remaining</em
    >
    <span v-else>LOCKED</span>
  </div>
</template>
