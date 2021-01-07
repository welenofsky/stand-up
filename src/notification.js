export const isNotificationsSupported = () => "Notification" in window;
export const notificationPermissionGranted = () => Notification.permission === 'granted'
export const requestNotificationPermission = () => Notification.requestPermission()