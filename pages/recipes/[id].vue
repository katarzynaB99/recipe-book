<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const { data, isFetching } = await useFetch(
  `/api/v1/recipes/${route.params.id}`
);
</script>
<template>
  <div class="flex justify-between items-center">
    <!-- Heading and subtitle -->
    <div class="flex items-center">
      <h1>{{ data.title }}</h1>
      <Tag
        v-for="category in data.categories"
        :key="category.id"
        :value="category.name"
        class="ml-2 mt-4 mb-2 h-8"
      />
    </div>
    <div>
      <Button icon="pi pi-heart" severity="secondary" />
    </div>
  </div>
  <Card>
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
