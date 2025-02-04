<script setup lang="ts">
const username = ref("");
const password = ref("");
const repeatPassword = ref("");
const router = useRouter();

const register = async () => {
  if (password.value !== repeatPassword.value) {
    console.error("Passwords do not match");
    return;
  }

  try {
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Cannot register.");
    }

    router.push("/sign-in");
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

</script>
<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
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
          <div class="mb-6">
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
          <div class="mb-10">
            <FloatLabel variant="on">
              <InputText
                v-model="repeatPassword"
                id="repeat-password"
                name="repeat-password"
                type="password"
                class="w-full"
              />
              <label for="repeat-password">Repeat Password</label>
            </FloatLabel>
          </div>
          
          <div>
            <Button type="submit" class="w-full">Register</Button>
          </div>
          <Divider />
          <div>
            <NuxtLink to="/sign-in">
              <Button class="w-full" severity="secondary">Sign In</Button>
            </NuxtLink>
          </div>
        </template>
      </Card>
    </form>
  </div>
</template>