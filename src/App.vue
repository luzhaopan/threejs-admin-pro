

<template>
  <div class="main-container">
    <header>
      <div class="wrapper">
        <nav class="nav_item">
          <RouterLink v-for="item in router" :to="item.path" :key="item.path">
            {{ item.name }}
          </RouterLink>
        </nav>
      </div>
    </header>
    <div style="flex: 1">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, RouterLink, RouterView } from 'vue-router' //1.引入路由
const router = useRouter().getRoutes() //2.实例化路由
</script>
<style scoped>
.main-container {
  display: flex;
}

header {
  flex: 0 0 200px;
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
  }
}
</style>
