<script setup>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import { ref } from "vue";

const user = { name: "John Doe" };

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    to: "/",
  },
  {
    label: "Browse Recipes",
    icon: "pi pi-list",
    to: "/recipes",
  },
  {
    label: "Favourites",
    icon: "pi pi-heart",
    to: "/favourites",
  },
]);
</script>

<template>
  <div>
    <menubar :model="items">
      <template #item="{ item, props }">
        <NuxtLink :to="item.to">
          <Button
            :icon="item.icon"
            size="small"
            variant="outlined"
            severity="secondary"
            :label="item.label"
          />
        </NuxtLink>
      </template>
      <template #end>
        <div class="inline-block me-4">
          {{ user.name }}
        </div>
        <!-- log out button -->
        <Button
          icon="pi pi-sign-out"
          severity="secondary"
          size="small"
          variant="outlined"
        />
      </template>
    </menubar>
  </div>
  <div class="p-6">
    <slot />
  </div>
</template>
