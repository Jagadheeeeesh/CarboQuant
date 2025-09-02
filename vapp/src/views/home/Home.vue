<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Welcome to<br />
          <span class="gradient-text">CarboConnect</span>
        </h1>
        <p class="hero-subtitle">
          The next generation platform for carbon credit trading,
          powered by blockchain technology
        </p>
        <div class="hero-actions">
          <router-link to="/login" class="btn-primary">
            Get Started
            <i class="ri-arrow-right-line"></i>
          </router-link>
          <a href="#learn-more" class="btn-secondary">
            Learn More
            <i class="ri-information-line"></i>
          </a>
        </div>
      </div>
    </div>

    <div id="learn-more" class="features-section">
      <h2 class="section-title">How It Works</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="ri-shield-check-line"></i>
          <h3>Secure Trading</h3>
          <p>Trade carbon credits with confidence using blockchain technology</p>
        </div>

        <div class="feature-card">
          <i class="ri-flow-chart"></i>
          <h3>Transparent Process</h3>
          <p>Track every transaction and verify credit authenticity</p>
        </div>

        <div class="feature-card">
          <i class="ri-line-chart-line"></i>
          <h3>Real-time Analytics</h3>
          <p>Monitor market trends and trading activities instantly</p>
        </div>

        <div class="feature-card">
          <i class="ri-global-line"></i>
          <h3>Global Impact</h3>
          <p>Contribute to worldwide carbon reduction efforts</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
.home {
  min-height: calc(100vh - 180px);
}

.hero-section {
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-family: 'Syne', sans-serif;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: var(--text-primary);
  padding: 1rem 2rem;
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-accent);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 1rem 2rem;
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

.features-section {
  padding: 6rem 2rem;
  background: var(--bg-secondary);
}

.section-title {
  text-align: center;
  margin-bottom: 4rem;
  font-size: 2.5rem;
  font-family: 'Syne', sans-serif;
}

.features-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--glow-accent);
}

.feature-card i {
  font-size: 2.5rem;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1.5rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .gradient-text {
    font-size: 3.5rem;
  }

  .features-section {
    padding: 4rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>