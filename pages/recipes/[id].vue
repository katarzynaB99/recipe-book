<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';

definePageMeta({
  middleware: "auth",
});

const route = useRoute();

const token = useCookie("token");
const { data, refresh } = await useFetch(`/api/v1/recipes/${route.params.id}`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});

const toggleFavorite = async () => {
  try {
    const decodedToken = jwtDecode(token.value);
    const response = await fetch("/api/v1/favourites/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
      body: JSON.stringify({ recipeId: data.value.id, userId: decodedToken.id }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to toggle favorite");
    }

    await refresh(); // Refresh the list to show updated favorites
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};
</script>
<template>
  <div v-if="data" class="flex justify-between items-center">
    <!-- Heading and subtitle -->
    <div class="flex items-center">
      <h1>{{ data.title }}</h1>
      <Tag
        v-for="category in data.categories"
        :key="category"
        :value="category"
        class="ml-2 mt-4 mb-2 h-8"
      />
    </div>
    <div>
      <Button
        icon="pi pi-heart"
        :severity="data.isFavorite ? 'danger' : 'secondary'"
        @click="toggleFavorite()"
      />
    </div>
  </div>
  <Card v-if="data">
    <template #content>
      <dl>
        <dt><strong>Description</strong></dt>
        <dd class="mb-3">{{ data.description }}</dd>
        <dt><strong>Prep Time</strong></dt>
        <dd class="mb-3">{{ data.prep_time }} minutes</dd>
        <dt><strong>Cook Time</strong></dt>
        <dd class="mb-3">{{ data.cook_time }} minutes</dd>
        <dt><strong>Instructions</strong></dt>
        <dd class="mb-3">{{ data.instructions }}</dd>
      </dl>
    </template>
  </Card>
</template>
