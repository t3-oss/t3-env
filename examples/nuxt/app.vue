<script setup lang="ts">
import { env } from "~~/env";
</script>
<template>
  <div>Client says {{ env.NUXT_PUBLIC_GREETING }}!</div>
  <a href="/api/hello">See what the server has to say!</a>
</template>
