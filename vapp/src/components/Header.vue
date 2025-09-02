<template>
  <header class="header">
    <nav class="nav-container">
      <div class="brand">
        <router-link to="/" class="brand-link">
          <i class="ri-leaf-line"></i>
          <span>CarboConnect</span>
        </router-link>
      </div>
      
      <div class="nav-menu">
        <router-link to="/regulator" class="nav-item">
          <i class="ri-shield-keyhole-line"></i>
          <span>Regulator</span>
        </router-link>
        <router-link to="/validator" class="nav-item">
          <i class="ri-checkbox-circle-line"></i>
          <span>Validator</span>
        </router-link>
        <router-link to="/generator" class="nav-item">
          <i class="ri-battery-charge-line"></i>
          <span>Generator</span>
        </router-link>
        <router-link to="/consumer" class="nav-item">
          <i class="ri-user-heart-line"></i>
          <span>Consumer</span>
        </router-link>
      </div>

      <div class="user-menu">
        <template v-if="user.loggedIn">
          <div class="user-profile">
            <span class="user-name">{{ user.data.displayName }}</span>
            <button @click="signOut" class="btn-logout">
              <i class="ri-logout-box-r-line"></i>
            </button>
          </div>
        </template>
        <router-link v-else to="login" class="btn-login">
          <i class="ri-login-circle-line"></i>
          <span>Login</span>
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";

export default {
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            path: "/"
          });
        });
    }
  }
};
</script>

<style scoped>
.header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--accent-primary);
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-link i {
  font-size: 1.75rem;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
}

.nav-item:hover {
  color: var(--accent-primary);
  background: var(--glass-bg);
}

.nav-item i {
  font-size: 1.25rem;
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
}

.user-name {
  color: var(--text-primary);
  font-weight: 500;
}

.btn-logout {
  background: none;
  border: none;
  color: var(--accent-error);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  transform: translateY(-1px);
  filter: brightness(1.2);
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  padding: 0.5rem 1.25rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: var(--glow-accent);
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .nav-container {
    padding: 0.75rem;
  }
}
</style>