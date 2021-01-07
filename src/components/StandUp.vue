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

  <p class="timer">Current Time: {{ timeString }}</p>

</template>

<script setup>
  import { ref, onUnmounted, onMounted } from 'vue';
  import {
    isNotificationsSupported,
    notificationPermissionGranted,
    requestNotificationPermission
  } from '../notification.js'
  const status = ref('paused');
  const toggleStatus = () => {
    status.value = status.value === 'paused' ? 'started' : 'paused';
  }

  const nextStand = ref(0);
  const notificationsEnabled = ref(false);
  const startTimer = () => {
    if (isNotificationsSupported() && !notificationPermissionGranted()) {
      requestNotificationPermission()
        .then((perm) =>{
          notificationsEnabled.value = perm === 'granted';
          if (!notificationsEnabled.value) {
            alert('Notifications Blocked! We will have to use a standard JS alert without notifications.');
          }
        })
    }

    const THIRTY_MIN_MILLISECONDS = (60*30)*1000;
    nextStand.value = new Date(Date.now() + THIRTY_MIN_MILLISECONDS);
    status.value = 'started';
  }

  const stopTimer = () => {
    nextStand.value = null;
    status.value = 'paused';
  }

  const interval = ref(null);
  const timeString = ref('');
  const leftPad = (str, size, padStr = ' ') => {
    if (typeof str !== 'string') {
      str = str.toString();
    }
    if (typeof padStr !== 'string') {
      padStr = padStr.toString();
    }
    const diff = size - str.length;
    if (diff && padStr.length > 0) {
      return `${padStr.repeat(Math.max(0, Math.ceil(diff / padStr.length)))}${str}`
    }
    return str;
  }
  const getTimeString = (date) => `${date.getHours()}:${leftPad(date.getMinutes(), 2, 0)}:${leftPad(date.getSeconds(), 2, 0)}`;
  onMounted(() => {
    interval.value = setInterval(() => {
      timeString.value = getTimeString(new Date());
      if (nextStand.value && (getTimeString(nextStand.value) === timeString.value)) {
        const notificationText = 'Stand Up!';
        if (notificationsEnabled.value) {
          new Notification(notificationsEnabled);
        } else {
          alert(notificationsEnabled);
        }
        status.value = 'paused';
        nextStand.value = 0;
      }
    }, 1000)
  })
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