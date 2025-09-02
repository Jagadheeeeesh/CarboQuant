<template>
  <div id="wrapper" :style="{backgroundImage: `url(${image})`}">    <div id="title">
      <h1 class="gradient-title">Welcome Consumer</h1>
    </div>
    <div id="buttons">
      <router-link to="/consumer/consumer-profile">
        <button>Consumer Profile</button>
      </router-link>
      <router-link to="/consumer/consumer-market">
        <button>Consumer Market</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import con from "@/assets/consumer.jpg";

export default {
  data() {
    return {
      image: con
    };
  }
};
</script>

<style scoped>
#wrapper {
  height: calc(100vh - 100px - 80px);
  background-size: cover;
}

#title {
  display: flex;
  align-items: center;
  padding-left: 40px;
  height: 10%;
}

.gradient-title {
  margin: 0;
  font-size: 3.5rem;
  font-family: 'Syne', sans-serif;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

#buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80%;
}

button {
  padding: 150px 100px;
  margin: 40px;
  font-size: 25px;
  color: #006400;  /* Changed to dark green color */
  font-weight: bold;
  border-radius: var(--border-radius-md);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

button:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--glow-accent);
}

button a {
  text-decoration: none;
  color: var(--text-primary);
}
</style>