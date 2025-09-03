<template>
  <div class="notification-center">
    <button class="notification-trigger" @click="toggleNotifications">
      <i class="ri-notification-line"></i>
      <span class="notification-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
    </button>
    
    <div class="notification-panel" v-if="showNotifications" @click.stop>
      <div class="notification-header">
        <h3>Notifications</h3>
        <div class="notification-actions">
          <button @click="markAllRead" v-if="unreadCount > 0" class="mark-read-btn">
            Mark All Read
          </button>
          <button @click="toggleNotifications" class="close-btn">×</button>
        </div>
      </div>
      
      <div class="notification-list" v-if="notifications.length > 0">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ 'unread': !notification.read, 'read': notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
          </div>
          <div class="notification-status" v-if="!notification.read">
            <span class="unread-dot"></span>
          </div>
        </div>
      </div>
      
      <div class="no-notifications" v-else>
        <i class="ri-notification-off-line"></i>
        <p>No notifications yet</p>
      </div>
    </div>
    
    <div class="notification-overlay" v-if="showNotifications" @click="toggleNotifications"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NotificationCenter',
  data() {
    return {
      showNotifications: false,
      notificationUnsubscribe: null
    };
  },
  computed: {
    ...mapGetters(['notifications', 'unreadNotifications', 'user']),
    unreadCount() {
      return this.unreadNotifications.length;
    }
  },
  mounted() {
    if (this.user.loggedIn && this.user.data) {
      this.subscribeToNotifications();
    }
    
    // Listen for clicks outside to close panel
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    if (this.notificationUnsubscribe) {
      this.notificationUnsubscribe();
    }
    document.removeEventListener('click', this.handleClickOutside);
  },
  watch: {
    'user.loggedIn'(newVal) {
      if (newVal && this.user.data) {
        this.subscribeToNotifications();
      } else if (this.notificationUnsubscribe) {
        this.notificationUnsubscribe();
      }
    }
  },
  methods: {
    subscribeToNotifications() {
      if (!this.user.data?.uid) return;
      
      this.notificationUnsubscribe = this.$firebaseService.onNotifications(
        this.user.data.uid,
        (notifications) => {
          this.$store.dispatch('updateNotifications', notifications);
        }
      );
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    markAsRead(notificationId) {
      this.$store.dispatch('markNotificationRead', notificationId);
    },
    markAllRead() {
      this.notifications.forEach(notification => {
        if (!notification.read) {
          this.$store.dispatch('markNotificationRead', notification.id);
        }
      });
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showNotifications = false;
      }
    },
    getNotificationIcon(type) {
      const icons = {
        'info': 'ri-information-line',
        'success': 'ri-checkbox-circle-line',
        'warning': 'ri-alert-line',
        'error': 'ri-error-warning-line',
        'trade': 'ri-exchange-line',
        'price': 'ri-line-chart-line',
        'credit': 'ri-leaf-line'
      };
      return icons[type] || 'ri-notification-line';
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.notification-center {
  position: relative;
}

.notification-trigger {
  position: relative;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.notification-trigger:hover {
  background: var(--bg-secondary);
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--error-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
}

.notification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  max-height: 500px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.notification-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.mark-read-btn {
  background: none;
  border: none;
  color: var(--accent-primary);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.3s ease;
}

.mark-read-btn:hover {
  background: var(--bg-secondary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.5rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--glass-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: var(--bg-secondary);
}

.notification-item.unread {
  background: rgba(var(--accent-primary-rgb), 0.05);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
}

.notification-content {
  flex: 1;
}

.notification-message {
  color: var(--text-primary);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.notification-time {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.notification-status {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-primary);
}

.no-notifications {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.no-notifications i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-notifications p {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .notification-panel {
    width: 90vw;
    right: -10px;
    max-width: 350px;
  }
}
</style>