// Function to detect data type from a value
export const detectDataType = (value) => {
  if (value === null || value === undefined) return 'string';
  
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') {
    // Check if it's a decimal
    return Number.isInteger(value) ? 'integer' : 'decimal';
  }
  if (typeof value === 'string') {
    // Check if it's a date
    if (isValidDate(value)) return 'datetime';
    // Check if it's a JSON string
    if (isValidJSON(value)) return 'json';
    return 'string';
  }
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'json';
  
  return 'string';
};

// Helper function to check if a string is a valid date
const isValidDate = (str) => {
  const date = new Date(str);
  return date instanceof Date && !isNaN(date) && str.length > 0;
};

// Helper function to check if a string is valid JSON
const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// Function to generate column configuration from data
export const generateColumnConfig = (data) => {
  if (!Array.isArray(data) || data.length === 0) return {};
  
  const config = {};
  const sampleRow = data[0];
  
  Object.keys(sampleRow).forEach(key => {
    // Skip internal fields that start with underscore
    if (key.startsWith('_')) return;
    
    config[key] = detectDataType(sampleRow[key]);
  });
  
  return config;
};

// Function to get all unique keys from an array of objects
export const getAllKeys = (data) => {
  if (!Array.isArray(data)) return [];
  
  const keys = new Set();
  data.forEach(item => {
    if (item && typeof item === 'object') {
      Object.keys(item).forEach(key => {
        if (!key.startsWith('_')) {
          keys.add(key);
        }
      });
    }
  });
  
  return Array.from(keys);
}; 