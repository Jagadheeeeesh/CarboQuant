<template>
  <div class="generator-dashboard">
    <div class="dashboard-header" :style="{backgroundImage: `url(${image})`}">
      <div class="header-overlay">
        <div class="header-content">
          <h1 class="gradient-title">Welcome Generator</h1>
          <p class="subtitle">Generate and sell carbon credits from your sustainability projects</p>
          <div class="user-stats" v-if="user.loggedIn">
            <div class="stat-item">
              <i class="ri-leaf-line"></i>
              <span>{{ userCredits }} CCT</span>
            </div>
            <div class="stat-item">
              <i class="ri-plant-line"></i>
              <span>{{ generatedCredits }} Generated</span>
            </div>
            <div class="stat-item">
              <i class="ri-exchange-line"></i>
              <span>{{ userTrades.length }} Trades</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <div class="content-grid">
        <div class="main-content">
          <!-- Navigation Cards -->
          <div class="nav-cards">
            <router-link to="/generator/generator-profile" class="nav-card">
              <div class="card-icon">
                <i class="ri-user-line"></i>
              </div>
              <div class="card-content">
                <h3>Generator Profile</h3>
                <p>View and manage your generator profile</p>
              </div>
              <div class="card-arrow">
                <i class="ri-arrow-right-line"></i>
              </div>
            </router-link>

            <router-link to="/generator/generator-market" class="nav-card">
              <div class="card-icon">
                <i class="ri-store-line"></i>
              </div>
              <div class="card-content">
                <h3>Generator Market</h3>
                <p>List and sell your carbon credits</p>
              </div>
              <div class="card-arrow">
                <i class="ri-arrow-right-line"></i>
              </div>
            </router-link>
          </div>

          <!-- Credit Generation Panel -->
          <div class="generation-panel">
            <div class="panel-header">
              <h3><i class="ri-plant-line"></i> Credit Generation</h3>
              <div class="generation-status">
                <span class="status-dot active"></span>
                Active Projects: {{ activeProjects }}
              </div>
            </div>
            <div class="panel-content">
              <div class="generation-stats">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="ri-leaf-line"></i>
                  </div>
                  <div class="stat-details">
                    <div class="stat-value">{{ monthlyGeneration }}</div>
                    <div class="stat-label">This Month</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="ri-calendar-line"></i>
                  </div>
                  <div class="stat-details">
                    <div class="stat-value">{{ yearlyGeneration }}</div>
                    <div class="stat-label">This Year</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="ri-money-dollar-circle-line"></i>
                  </div>
                  <div class="stat-details">
                    <div class="stat-value">${{ estimatedValue.toFixed(0) }}</div>
                    <div class="stat-label">Est. Value</div>
                  </div>
                </div>
              </div>
              
              <div class="quick-actions">
                <button @click="generateCredits" class="action-btn primary">
                  <i class="ri-add-line"></i>
                  Generate Credits
                </button>
                <button @click="verifyProject" class="action-btn secondary">
                  <i class="ri-shield-check-line"></i>
                  Request Verification
                </button>
              </div>
            </div>
          </div>

          <!-- Trading Interface -->
          <TradingInterface />
          
          <!-- Input Value Form -->
          <InputValueForm />
        </div>

        <div class="sidebar-content">
          <!-- Live Market Data -->
          <LiveMarketData />
          
          <!-- Live Price Tracker -->
          <LivePriceTracker />
          
          <!-- Project Status -->
          <div class="project-status">
            <h4>Active Projects</h4>
            <div class="project-list">
              <div v-for="project in projects" :key="project.id" class="project-item">
                <div class="project-info">
                  <div class="project-name">{{ project.name }}</div>
                  <div class="project-type">{{ project.type }}</div>
                </div>
                <div class="project-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{width: project.progress + '%'}"></div>
                  </div>
                  <span class="progress-text">{{ project.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import con from "@/assets/generator.jpg";
import LiveMarketData from "../../components/LiveMarketData.vue";
import LivePriceTracker from "../../components/LivePriceTracker.vue";
import TradingInterface from "../../components/TradingInterface.vue";
import InputValueForm from "../../components/InputValueForm.vue";

export default {
  name: 'Generator',
  components: {
    LiveMarketData,
    LivePriceTracker,
    TradingInterface,
    InputValueForm
  },
  data() {
    return {
      image: con,
      userTrades: [],
      generatedCredits: 2450,
      activeProjects: 3,
      monthlyGeneration: 156,
      yearlyGeneration: 1850,
      projects: [
        {
          id: 1,
          name: "Solar Farm Alpha",
          type: "Renewable Energy",
          progress: 78
        },
        {
          id: 2,
          name: "Forest Restoration",
          type: "Reforestation",
          progress: 45
        },
        {
          id: 3,
          name: "Wind Energy Project",
          type: "Renewable Energy",
          progress: 92
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['user', 'userCredits', 'prices']),
    estimatedValue() {
      const currentPrice = this.prices.carbon?.price || 85.50;
      return this.monthlyGeneration * currentPrice;
    }
  },
  async mounted() {
    if (this.user.loggedIn) {
      await this.loadUserData();
    }
  },
  methods: {
    async loadUserData() {
      try {
        // Load user trades
        this.userTrades = await this.$firebaseService.getUserTrades(this.user.data.uid);
        
        // Load user credits
        const credits = await this.$firebaseService.getUserCredits(this.user.data.uid);
        this.$store.dispatch('updateUserCredits', credits);
        
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },
    async generateCredits() {
      if (!this.user.loggedIn) {
        this.$toasted.show('Please login to generate credits', {
          type: 'error',
          duration: 3000
        });
        return;
      }

      try {
        const amount = Math.floor(Math.random() * 50) + 25; // 25-75 credits
        
        await this.$firebaseService.allocateCredits(
          this.user.data.uid,
          amount,
          'system-generator'
        );

        // Send notification
        await this.$firebaseService.sendNotification(
          this.user.data.uid,
          `Successfully generated ${amount} carbon credits from your projects!`,
          'success'
        );

        this.$toasted.show(`Generated ${amount} carbon credits!`, {
          type: 'success',
          duration: 3000
        });

        // Update local stats
        this.monthlyGeneration += amount;
        this.generatedCredits += amount;

        // Reload user data
        await this.loadUserData();

      } catch (error) {
        console.error('Error generating credits:', error);
        this.$toasted.show('Error generating credits', {
          type: 'error',
          duration: 3000
        });
      }
    },
    async verifyProject() {
      if (!this.user.loggedIn) {
        this.$toasted.show('Please login to request verification', {
          type: 'error',
          duration: 3000
        });
        return;
      }

      try {
        // Send notification
        await this.$firebaseService.sendNotification(
          this.user.data.uid,
          'Verification request submitted. A validator will review your project soon.',
          'info'
        );

        this.$toasted.show('Verification request submitted!', {
          type: 'success',
          duration: 3000
        });

      } catch (error) {
        console.error('Error requesting verification:', error);
        this.$toasted.show('Error submitting verification request', {
          type: 'error',
          duration: 3000
        });
      }
    }
  }
};
</script>

<style scoped>
.generator-dashboard {
  min-height: calc(100vh - 180px);
}

.dashboard-header {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 100, 0, 0.3));
  display: flex;
  align-items: center;
}

.header-content {
  padding: 0 2rem;
  color: white;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.gradient-title {
  margin: 0 0 1rem 0;
  font-size: 3.5rem;
  font-family: 'Syne', sans-serif;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-sm);
  backdrop-filter: blur(10px);
  font-weight: 600;
}

.stat-item i {
  font-size: 1.25rem;
  color: var(--accent-primary);
}

.dashboard-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.nav-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--glow-accent);
  border-color: var(--accent-primary);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.card-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.card-arrow {
  color: var(--accent-primary);
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.nav-card:hover .card-arrow {
  transform: translateX(4px);
}

.generation-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  margin-bottom: 2rem;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--glass-border);
}

.panel-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
}

.generation-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
}

.status-dot.active {
  background: var(--accent-primary);
  animation: pulse 2s infinite;
}

.panel-content {
  padding: 1.5rem;
}

.generation-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.quick-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: var(--accent-primary);
  color: white;
}

.action-btn.primary:hover {
  background: var(--accent-secondary);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
}

.action-btn.secondary:hover {
  background: var(--bg-tertiary);
  transform: translateY(-1px);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-status {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
}

.project-status h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
}

.project-info {
  margin-bottom: 0.5rem;
}

.project-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.project-type {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--glass-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-primary);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 35px;
  text-align: right;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-cards {
    grid-template-columns: 1fr;
  }
  
  .generation-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    height: 250px;
  }
  
  .gradient-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .user-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>