<script lang="ts" setup>
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import Card from "primevue/card";
import MultiSelect from "primevue/multiselect";
import { ref, watch } from "vue";
import { jwtDecode } from 'jwt-decode';

definePageMeta({
  middleware: 'auth'
});

const router = useRouter();
const route = useRoute();

const token = useCookie('token');

const { data: recipe } = useFetch(`/api/v1/recipes/${route.params.id}`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
  onResponse: ({ response }) => {
    if (response._data) {
      title.value = response._data.title;
      description.value = response._data.description;
      instructions.value = response._data.instructions;
      prepTime.value = response._data.prep_time;
      cookTime.value = response._data.cook_time;
      selectedCategories.value = response._data.categories.map(cat => cat.id);
    }
  },
});

const { data: categories } = useFetch("/api/v1/categories", {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});

const title = ref("");
const description = ref("");
const instructions = ref("");
const prepTime = ref("");
const cookTime = ref("");
const selectedCategories = ref([]);

const submitForm = async () => {
  const decodedToken = jwtDecode(token.value);

  const recipeData = {
    title: title.value,
    description: description.value,
    instructions: instructions.value,
    prep_time: prepTime.value,
    cook_time: cookTime.value,
    categories: selectedCategories.value,
    user_id: decodedToken.id
  };

  try {
    const response = await fetch(`/api/v1/recipes/${route.params.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.value}`
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error("Failed to create recipe");
    }

    console.info("Recipe updated");

    // Redirect to the recipes list page
    router.push("/recipes");
  } catch (error) {
    console.error("Error creating recipe:", error);
  }
};
</script>

<template>
  <div class="flex justify-between items-center">
    <h1>Edit Recipe</h1>
  </div>
  <form id="create-recipe-form" @submit.prevent="submitForm">
    <Card>
      <template #content>
        <!-- Title -->
        <div class="mb-4">
          <FloatLabel variant="on">
            <InputText
              v-model="title"
              id="recipe-title"
              name="title"
              type="text"
              class="w-full"
            />
            <label for="recipe-title">Title</label>
          </FloatLabel>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <FloatLabel variant="on">
            <InputText
              v-model="description"
              id="recipe-description"
              name="description"
              type="text"
              class="w-full"
            />
            <label for="recipe-description">Description</label>
          </FloatLabel>
        </div>

        <!-- Instructions -->
        <div class="mb-4">
          <FloatLabel variant="on">
            <Textarea
              v-model="instructions"
              id="recipe-instructions"
              name="instructions"
              class="w-full"
              rows="5"
            />
            <label for="recipe-instructions">Instructions</label>
          </FloatLabel>
        </div>

        <!-- Prep time -->
        <div class="mb-4">
          <FloatLabel variant="on">
            <InputText
              v-model="prepTime"
              id="recipe-prep-time"
              name="prep_time"
              type="number"
              class="w-full"
            />
            <label for="recipe-prep-time">Prep time</label>
          </FloatLabel>
        </div>

        <!-- Cook time -->
        <div class="mb-4">
          <FloatLabel variant="on">
            <InputText
              v-model="cookTime"
              id="recipe-cook-time"
              name="cook_time"
              type="number"
              class="w-full"
            />
            <label for="recipe-cook-time">Cook time</label>
          </FloatLabel>
        </div>

        <!-- Categories -->
        <div class="mb-8">
          <FloatLabel variant="on">
            <MultiSelect
              v-model="selectedCategories"
              id="recipe-categories"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              filter
              class="w-full"
            />
            <label for="recipe-categories">Categories</label>
          </FloatLabel>
        </div>

        <Button type="submit" label="Save" />
      </template>
    </Card>
  </form>
</template>

<style></style>
