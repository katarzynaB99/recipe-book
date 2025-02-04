<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

const { data, isFetching } = await useFetch("/api/v1/recipes");
</script>
<template>
  <div class="flex justify-between items-center">
    <h1>Recipes</h1>
    <NuxtLink to="/recipes/create">
      <Button>
        + Add
      </Button>
    </NuxtLink>
  </div>
  <div class="card">
    <DataTable
      :value="data"
      tableStyle="min-width: 50rem"
      :loading="isFetching"
    >
      <Column field="title" header="Title"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="category" header="Category">
        <template #body="bodyData">
          <Tag
            v-for="category in bodyData.data.categories"
            :key="category"
            :value="category"
          />
        </template>
      </Column>
      <Column field="author" header="Author"></Column>
    </DataTable>
  </div>
</template>
