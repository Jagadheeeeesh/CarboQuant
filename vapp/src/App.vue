<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  name: 'app',
  components: {
    Header
  }
};
</script>

<style>
#app {
  font-family: 'Space Grotesk', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.main-content {
  flex: 1;
}

@import './assets/styles/global.css';
</style>
