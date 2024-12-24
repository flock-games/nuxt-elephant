<script setup lang="ts">
import imageUrlBuilder from "@sanity/image-url";

const props = defineProps({
  gift: Object,
  stealsRemaining: Number,
  ownerName: String,
});

const emit = defineEmits({
  steal: (giftId: string) => ({ giftId }),
});

const sanity = useSanity();

const steal = () => {
  emit("steal", props.gift!._id);
};

const urlFor = (source: any) => {
  return builder.image(source);
};

const builder = imageUrlBuilder(sanity.client);
</script>

<template>
  <div>
    {{ gift!.name }}
    <br />
    <img :src="urlFor(gift!.image).width(200).url()" />
    <div v-if="ownerName">
      {{ ownerName }}
      <br />
    </div>
    <span v-if="stealsRemaining">{{ stealsRemaining }} steals remaining</span>
    <span v-else>LOCKED</span>
    <br />
    <button
      v-if="stealsRemaining"
      @click="steal"
      class="bg-red-500 text-white px-2 py-1 rounded"
    >
      Steal
    </button>
  </div>
</template>
