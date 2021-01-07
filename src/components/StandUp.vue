<template>
  <h1>Stand Up!</h1>

  <p class="description">Promoting good health by reminding you every 30m to stand up!</p>
  
  <template v-if="status === 'paused'">
    <p class="sub-header">Start timer to get started.</p>

    <button @click.prevent="startTimer">Start Timer</button>
  </template>
  <template v-else>
    <p class="sub-header">Next Stand at: {{ getTimeString(nextStand) }}</p>

    <button @click.prevent="stopTimer">Stop Timer</button>
  </template>

  <p class="timer" v-show="timeString.length > 0">Current Time: {{ timeString }}</p>

</template>

<script setup>
  import { ref, onUnmounted, onMounted } from 'vue';
  import { isNotificationsSupported, notificationPermissionGranted } from '../notification.js';
  import { getTimeString, leftPad } from '../util.js';

  const status = ref('paused');
  const toggleStatus = () => {
    status.value = status.value === 'paused' ? 'started' : 'paused';
  }

  const nextStand = ref(0);
  const startTimer = () => {
    if (isNotificationsSupported() && !notificationPermissionGranted()) {
      Notification.requestPermission()
        .then((perm) =>{
          if (!notificationPermissionGranted()) {
            alert('Notifications Blocked! We will have to use a standard JS alert without notifications.');
          }
        })
    }

    const THIRTY_MIN_MILLISECONDS = (60*30)*1000;
    nextStand.value = new Date(Date.now() + THIRTY_MIN_MILLISECONDS);
    status.value = 'started';
  }

  const stopTimer = () => {
    nextStand.value = 0;
    status.value = 'paused';
  }

  const interval = ref(null);
  const timeString = ref('');
  const notificationText = 'Stand Up!';
  onMounted(() => {
    interval.value = setInterval(() => {
      timeString.value = getTimeString(new Date());
      if (nextStand.value && (getTimeString(nextStand.value) === timeString.value)) {
        if (notificationsEnabled.value) {
          new Notification(notificationText);
        } else {
          alert(notificationText);
        }
        stopTimer();
      }
    }, 1000)
  });
  onUnmounted(() => {
    if (typeof interval.value === 'function') {
      clearInterval(interval.value);
      interval.value = null;
    }
  });
</script>

<style scoped>
  h1 {
    margin-bottom: 0;
    line-height: 1.25;
  }
  p.sub-header {
    font-size: 20px;
    font-weight: 700;
  }
  p.timer {
    font-size: 14px;
  }
  p.description {
    margin-bottom: 40px;
  }
  button {
    background-color: rgb(13, 89, 255);
    border: none;
    border-radius: .5rem;
    color: seashell;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    padding: 11px 22px;
  }
</style>