<script setup lang="ts">
import type { SanityDocument } from "@sanity/client";

const { params } = useRoute();
const sanity = useSanity();

const GAME_QUERY = groq`*[
  _type == "game" && _id == $slug
][0]{_id, name}`;

const USERS_QUERY = groq`*[
  _type == "user" && game._ref == $slug
]| order(order asc){_id, _ref, name, order, broughtGift->}`;

const { data: game } = await useSanityQuery<SanityDocument>(GAME_QUERY, params);
const { data: users } = await useSanityQuery<SanityDocument[]>(
  USERS_QUERY,
  params
);

const MAX_STEALS = 3;

const gifts = ref(users.value?.map((user: any) => user.broughtGift));
console.log(gifts.value);

const isGameOver = computed(() => currentPlayer.value === undefined);

const currentPlayer = computed(() => {
  const playerList = users.value;
  if (!playerList) {
    console.error("No player list found");
    return null;
  }

  return playerList.find((player: any) => giftForUser(player) === undefined);
});

const assignGift = async (giftId: string, isSteal: boolean) => {
  if (!currentPlayer.value) {
    console.error("No current player found");
    return;
  }

  const updatedGift = await sanity.client
    .patch(giftId)
    .set({ "owner._ref": currentPlayer.value._id })
    .inc({ numTimesStolen: isSteal ? 1 : 0 })
    .commit();

  console.log(updatedGift);

  console.log(giftId);
  const giftIndex = gifts.value?.findIndex((gift: any) => gift._id === giftId);
  if (giftIndex) {
    console.log("DONE UPDATING");
    gifts.value![giftIndex] = updatedGift;
  }
};

const userFromId = (id: string) =>
  users.value?.find((user: any) => user._id === id);

const giftForUser = (user: any) =>
  gifts.value?.find((gift: any) => gift.owner?._ref === user._id);
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

      <h2 v-if="isGameOver" class="text-xl font-semibold">Game over!</h2>

      <div class="flex w-full">
        <ul
          class="flex-1 flex flex-col gap-y-4"
          :class="{ 'opacity-50': isGameOver }"
        >
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
            <OpenedGift
              v-if="gift.owner"
              @steal="(giftId) => assignGift(giftId, true)"
              :gift="gift"
              :steals-remaining="MAX_STEALS - gift.numTimesStolen"
              :owner-name="userFromId(gift.owner._ref)?.name"
              :is-game-over="isGameOver"
            />
            <UnopenedGift
              v-else
              @open="(giftId) => assignGift(giftId, false)"
              :gift="gift"
              :gift-number="index + 1"
            />
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <h1 class="text-4xl font-bold mb-8">No game found.</h1>
    </div>
  </main>
</template>
