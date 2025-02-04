<script setup>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";

const token = useCookie("token");

const user = computed(() => {
  return token.value ? jwtDecode(token.value) : null;
});

const logout = () => {
  token.value = null;
  navigateTo("/sign-in");
};

const items = ref([
  { label: "Browse Recipes", icon: "pi pi-list", to: "/recipes" },
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
        <div v-if="user" class="inline-block">
          <div class="inline-block me-4">
            {{ user.username }}
          </div>
          <Button @click="logout" icon="pi pi-sign-out" size="small" severity="secondary" />
        </div>
      </template>
    </menubar>
  </div>
  <div class="p-6">
    <slot />
  </div>
</template>
