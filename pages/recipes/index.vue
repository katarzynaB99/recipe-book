<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';

definePageMeta({
  middleware: "auth",
});

const token = useCookie("token");

const { data, refresh } = await useFetch("/api/v1/recipes", {
  headers: {
    "Authorization": `Bearer ${token.value}`,
  },
});

const toggleFavorite = async (recipeId: number) => {
  try {
    const decodedToken = jwtDecode(token.value);
    const response = await fetch("/api/v1/favourites/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`,
      },
      body: JSON.stringify({ recipeId, userId: decodedToken.id }),
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
  <div class="flex justify-between items-center">
    <h1>Recipes</h1>
    <NuxtLink to="/recipes/create">
      <Button> + Add </Button>
    </NuxtLink>
  </div>
  <div class="card">
    <DataTable
      :value="data"
      tableStyle="min-width: 50rem"
    >
      <Column>
        <template #body="bodyData">
          <Button
            icon="pi pi-heart"
            :severity="bodyData.data.isFavorite ? 'danger' : 'secondary'"
            @click="toggleFavorite(bodyData.data.id)"
          />
        </template>
      </Column>
      <Column field="title" header="Title">
        <template #body="bodyData">
          <NuxtLink :to="`/recipes/${bodyData.data.id}`" class="text-blue-500">
            {{ bodyData.data.title }}
          </NuxtLink>
        </template>
      </Column>
      <Column field="description" header="Description"></Column>
      <Column field="category" header="Category">
        <template #body="bodyData">
          <Tag
            v-for="category in bodyData.data.categories"
            :key="category"
            :value="category"
            class="mr-2"
          />
        </template>
      </Column>
      <Column field="author" header="Author"></Column>
    </DataTable>
  </div>
</template>
