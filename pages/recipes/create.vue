<script lang="ts" setup>
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import Card from "primevue/card";
import MultiSelect from "primevue/multiselect";
import { ref } from "vue";
import { jwtDecode } from 'jwt-decode';

definePageMeta({
  middleware: 'auth'
});

const router = useRouter();

const { data: categories } = useFetch("/api/v1/categories");

const title = ref("");
const description = ref("");
const instructions = ref("");
const prepTime = ref(0);
const cookTime = ref(0);
const selectedCategories = ref([]);

const submitForm = async () => {
  const token = useCookie('token').value;
  const decodedToken = jwtDecode(token);

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
    const response = await fetch("/api/v1/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error("Failed to create recipe");
    }

    const result = await response.json();
    console.log("Recipe created:", result);

    // Redirect to the recipes list page
    router.push("/recipes");
  } catch (error) {
    console.error("Error creating recipe:", error);
  }
};
</script>

<template>
  <div class="flex justify-between items-center">
    <h1>New Recipe</h1>
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

        <Button type="submit" label="Create" />
      </template>
    </Card>
  </form>
</template>

<style></style>
