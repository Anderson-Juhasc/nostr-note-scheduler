// isAndroidBrowser.js

export function isAndroidBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Android/i.test(userAgent) && /Chrome/i.test(userAgent);}

