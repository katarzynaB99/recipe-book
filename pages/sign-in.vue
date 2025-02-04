<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCookie } from "#app";

const username = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  try {
    const response = await fetch("/api/v1/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const { token } = await response.json();
    useCookie("token").value = token;
    router.push("/");
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <Card class="py-3">
        <template #content>
          <div class="mb-6">
            <FloatLabel variant="on">
              <InputText
                v-model="username"
                id="username"
                name="username"
                type="text"
                class="w-full"
              />
              <label for="username">Username</label>
            </FloatLabel>
          </div>
          <div class="mb-10">
            <FloatLabel variant="on">
              <InputText
                v-model="password"
                id="password"
                name="password"
                type="password"
                class="w-full"
              />
              <label for="password">Password</label>
            </FloatLabel>
          </div>
          <div>
            <Button type="submit" class="w-full">Sign In</Button>
          </div>
          <Divider />
          <div>
            <NuxtLink to="/register">
              <Button class="w-full" severity="secondary">Register</Button>
            </NuxtLink>
          </div>
        </template>
      </Card>
    </form>
  </div>
</template>
