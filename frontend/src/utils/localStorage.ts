/**
 * @function getItem
 * @description Safely retrieves and parses a JSON item from localStorage.
 * @param {string} key The key of the item to retrieve.
 * @returns {T | null} The parsed item, or null if not found or on error.
 */
export const getItem = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return null;
  }
};

/**
 * @function setItem
 * @description Safely stringifies and sets an item in localStorage.
 * @param {string} key The key of the item to set.
 * @param {T} value The value to set.
 */
export const setItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};
