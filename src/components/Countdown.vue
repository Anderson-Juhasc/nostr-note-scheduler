<template>
  <div class="countdown">
    <div v-if="progressPercentage > 0" class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
    </div>
    <div class="countdown-text">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    createDate: {
      type: String,
      required: true, // Expecting an ISO date string like "2024-12-06T23:59:59"
    },
    targetDate: {
      type: String,
      required: true, // Expecting an ISO date string like "2024-12-06T23:59:59"
    },
  },
  data() {
    return {
      timeLeft: 0,
      totalDuration: 0,
      interval: null,
    };
  },
  computed: {
    progressPercentage() {
      if (this.totalDuration === 0) return 0;
      const percentage = (this.timeLeft / this.totalDuration) * 100;
      return Math.min(Math.max(percentage, 0), 100);
    },
    formattedTime() {
      if (this.timeLeft <= 0) return "Published!";
      const days = Math.floor(this.timeLeft / (24 * 60 * 60));
      const hours = Math.floor((this.timeLeft % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((this.timeLeft % (60 * 60)) / 60);
      const seconds = Math.floor(this.timeLeft % 60);
      return `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
    },
  },
  methods: {
    updateCountdown() {
      const now = new Date();
      const target = new Date(this.targetDate);
      const duration = Math.max((target - new Date(this.createDate)) / 1000, 0); // Total duration in seconds
      this.totalDuration = duration; // Store total duration for progress calculation
      this.timeLeft = Math.max((target - now) / 1000, 0); // Time left in seconds
      if (this.timeLeft <= 0 && this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
  },
  mounted() {
    const now = new Date(this.createDate);
    const target = new Date(this.targetDate);
    this.totalDuration = (target - now) / 1000; // Total duration in seconds

    // Start the countdown
    this.updateCountdown();
    this.interval = setInterval(this.updateCountdown, 1000);
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  },
};
</script>

<style scoped>
.countdown {
  text-align: center;
}

.progress-bar-container {
  width: 100%;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
  height: 8px;
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background-color: #4caf50;
  transition: width 0.5s ease-in-out;
}

.countdown-text {
  font-size: 0.85rem;
  color: #555;
}
</style>

