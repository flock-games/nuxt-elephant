<script setup lang="ts">
import type { SanityDocument } from "@sanity/client";

const GAMES_QUERY = groq`*[
  _type == "game"
]{_id, name}`;

const USERS_QUERY = groq`*[
  _type == "user"
]| order(order asc){_id, name, order}`;

const GIFTS_QUERY = groq`*[
  _type == "gift"
]{_id, url, owner->{name}}`;

const { data: games } = await useSanityQuery<SanityDocument[]>(GAMES_QUERY);
const { data: users } = await useSanityQuery<SanityDocument[]>(USERS_QUERY);
const { data: gifts } = await useSanityQuery<SanityDocument[]>(GIFTS_QUERY);
console.log(gifts);
</script>

<template>
  <main class="container mx-auto min-h-screen max-w-3xl p-8">
    <h1 class="text-4xl font-bold mb-8">Games</h1>
    <ul>
      <li v-for="game in games" :key="game._id">
        <h2 class="text-xl font-semibold">
          <a :href="'/' + game._id">{{ game.name }}</a>
        </h2>
      </li>
    </ul>
    <!-- <ul class="flex flex-col gap-y-4">
      <li v-for="user in users" :key="user._id">
        <h2 class="text-xl font-semibold">{{ user.name }}</h2>
        <p>{{ new Date(user.order).toLocaleDateString() }}</p>
      </li>
    </ul>

    <h1 class="text-4xl font-bold mb-8">Gifts</h1>
    <ul class="flex flex-col gap-y-4">
      <li v-for="(gift, index) in gifts" :key="gift._id">
        <h2 class="text-xl font-semibold">
          <a :href="gift.url">{{ index }}</a>
        </h2>
        <p>{{ gift.owner?.name }}</p>
      </li>
    </ul> -->
  </main>
</template>
