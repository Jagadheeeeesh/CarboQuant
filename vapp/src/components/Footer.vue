<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <i class="ri-leaf-line"></i>
        <div class="brand-text">
          <h3>CarbonEco</h3>
          <p>Building a Sustainable Future</p>
        </div>
      </div>
      
      <div class="footer-stats">
        <div class="stat-item">
          <span class="stat-value">2.5M+</span>
          <span class="stat-label">Credits Traded</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">500+</span>
          <span class="stat-label">Active Users</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">12K+</span>
          <span class="stat-label">CO₂ Reduced</span>
        </div>
      </div>
      
      <div class="footer-links">
        <a href="#" class="social-link">
          <i class="ri-twitter-fill"></i>
        </a>
        <a href="#" class="social-link">
          <i class="ri-github-fill"></i>
        </a>
        <a href="#" class="social-link">
          <i class="ri-discord-fill"></i>
        </a>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2025 CarbonEco. All rights reserved.</p>
      <div class="tech-stack">
        <span>Powered by</span>
        <i class="ri-ethereum-line"></i>
        <i class="ri-vuejs-line"></i>
      </div>
    </div>
  </footer>
</template>

<script>

</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-light);
  padding: 4rem 2rem 2rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  margin-bottom: 4rem;
}

.footer-brand {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.footer-brand i {
  font-size: 2.5rem;
  color: var(--accent-primary);
}

.brand-text h3 {
  margin: 0;
  font-family: 'Syne', sans-serif;
  color: var(--text-primary);
}

.brand-text p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-stats {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-primary);
  text-shadow: 0 0 20px rgba(0, 245, 212, 0.4);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.social-link:hover {
  color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--glow-accent);
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.tech-stack {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tech-stack i {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .footer-brand {
    justify-content: center;
  }

  .footer-links {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>