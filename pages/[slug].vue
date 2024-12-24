<script setup lang="ts">
import type { SanityDocument } from "@sanity/client";

const GAME_QUERY = groq`*[
  _type == "game" && _id == $slug
][0]{_id, name}`;
// const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]`;
const { params } = useRoute();

const { data: game } = await useSanityQuery<SanityDocument>(GAME_QUERY, params);
console.log(game);
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
