<script setup lang="ts">
import type { SanityDocument } from "@sanity/client";

const { params } = useRoute();
const sanity = useSanity();

const GAME_QUERY = groq`*[
  _type == "game" && _id == $slug
][0]{_id, name, currentPlayer, nextUpIndex}`;
// const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]`;

const USERS_QUERY = groq`*[
  _type == "user" && game._ref == $slug
]| order(order asc){_id, name, order, broughtGift->}`;

const { data: game } = await useSanityQuery<SanityDocument>(GAME_QUERY, params);
const { data: users } = await useSanityQuery<SanityDocument[]>(
  USERS_QUERY,
  params
);

const MAX_STEALS = 30;

const gifts = ref(users.value?.map((user: any) => user.broughtGift));
const currentPlayer = computed(() => {
  if (game.value?.currentPlayer) return game.value?.currentPlayer;
  else {
    const playerList = users.value;
    if (!playerList) {
      console.error("No player list found");
      return null;
    }
    const nextUpIndex = game.value?.nextUpIndex;
    if (nextUpIndex === undefined || nextUpIndex >= playerList.length) {
      console.error("Invalid next up index", nextUpIndex, playerList.length);
      return null;
    }
    return playerList[nextUpIndex];
  }
});

const assignGift = async (giftId: string, isSteal: boolean) => {
  if (!currentPlayer.value) {
    console.error("No current player found");
    return;
  }

  const currentOwner = gifts.value?.find(
    (gift: any) => gift._id === giftId
  )?.owner;

  const updatedGift = await sanity.client
    .patch(giftId)
    .set({ owner: currentPlayer.value._id })
    .inc({ numTimesStolen: isSteal ? 1 : 0 })
    .commit();

  const giftIndex = gifts.value?.findIndex((gift: any) => gift._id === giftId);
  if (giftIndex) {
    gifts.value![giftIndex] = updatedGift;
  }

  goToNextUser();
  // if (currentOwner) {
  //   console.log("current owner", currentOwner);
  //   game.value!.currentPlayer = currentOwner;
  // } else {
  //   goToNextUser();
  // }
};

const goToNextUser = async () => {
  const res = await sanity.client
    .patch(game.value!._id)
    .inc({ nextUpIndex: 1 })
    .commit();
  game.value = res;
  console.log(res);
};

const userFromId = (id: string) =>
  users.value?.find((user: any) => user._id === id);

const giftForUser = (user: any) =>
  gifts.value?.find((gift: any) => gift.owner === user._id);
</script>

<template>
  <main
    class="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4"
  >
    <a href="/" class="hover:underline">&larr; Back to games</a>
    <div v-if="game?._id">
      <h1 v-if="game.name" class="text-4xl font-bold mb-8">
        {{ game.name }}
      </h1>
      <div class="flex w-full">
        <ul class="flex-1 flex flex-col gap-y-4">
          <li v-for="user in users" :key="user._id">
            <h2
              class="text-xl font-semibold"
              :class="{ 'text-green-500': user._id === currentPlayer?._id }"
            >
              {{ user.name }}<br />
              <em v-if="giftForUser(user)">{{ giftForUser(user).name }}</em>
            </h2>
          </li>
        </ul>
        <ul class="flex-1 flex flex-col gap-y-4">
          <li v-for="(gift, index) in gifts" :key="gift._id">
            <div v-if="gift.owner">
              {{ gift.name }}
              <br />
              {{ userFromId(gift.owner)?.name }}
              <br />
              <span v-if="gift.numTimesStolen < MAX_STEALS"
                >{{ MAX_STEALS - gift.numTimesStolen }} steals remaining</span
              >
              <span v-if="gift.numTimesStolen >= MAX_STEALS">LOCKED</span>

              <br />

              <button
                v-if="gift.numTimesStolen < MAX_STEALS"
                @click="() => assignGift(gift._id, true)"
                class="bg-red-500 text-white px-2 py-1 rounded"
              >
                Steal
              </button>
            </div>
            <div v-else>
              <h2 class="text-xl font-semibold">Gift {{ index + 1 }}</h2>
              <button
                @click="() => assignGift(gift._id, false)"
                class="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Open
              </button>
            </div>
          </li>
        </ul>
      </div>
      <!-- <div class="prose">
        <p v-if="game.publishedAt">
          Published: {{ new Date(game.publishedAt).toLocaleDateString() }}
        </p>
        <SanityContent v-if="game.body" :blocks="post.body" />
      </div> -->
    </div>
    <div v-else>
      <h1 class="text-4xl font-bold mb-8">No game found.</h1>
    </div>
  </main>
</template>
