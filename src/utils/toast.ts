// src/utils/toast.ts
// Simple toast/notification utility for CMS actions

export function success(message: string) {
  // For now, use window.alert for success messages
  window.alert(message);
}

export function showError(message: string) {
  // For now, use window.alert for error messages
  window.alert(`Error: ${message}`);
}
