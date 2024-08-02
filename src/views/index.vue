<template>
  <div></div>
</template>
<script setup>
import auth from "@/plugins/auth";
import { useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router = useRouter();
const { params, query } = route
const { path } = params


if (auth.hasRole("admin")) {
  router.replace({ path: "/servicer",query});
} else if (auth.hasRole("servicer")) {
  router.replace({ path: "/servicer/profile",query });
} else if (auth.hasRole("producter")) {
  router.replace({ path: "/producter/profile",query });
}
</script>