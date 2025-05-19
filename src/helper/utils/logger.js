export const logEvent = (message, data = {}) => {
  console.log(`[LOG]: ${message}`, data);
};