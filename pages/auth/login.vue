<!-- pages/login.vue -->
<script setup>
  const auth = useAuthStore();
  const form = reactive({
    username: "",
    password: "",
  });

  const login = async () => {
    try {
      const response = await auth.$fetch("/login", {
        method: "POST",
        body: form,
      });

      auth.setToken(response.token);
      navigateTo("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
</script>

<template>
  <form @submit.prevent="login">
    <input
      v-model="form.username"
      placeholder="Username"
    />
    <input
      v-model="form.password"
      type="password"
      placeholder="Password"
    />
    <button type="submit">Login</button>
  </form>
</template>
