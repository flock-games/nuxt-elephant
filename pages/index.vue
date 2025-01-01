<script setup lang="ts">
import type { SanityDocument } from "@sanity/client";

const GAMES_QUERY = groq`*[
  _type == "game"
]{_id, name}`;

const { data: games } = await useSanityQuery<SanityDocument[]>(GAMES_QUERY);
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
  </main>
</template>
