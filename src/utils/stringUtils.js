// Function to capitalize the first letter of a string
import { v4 as uuidv4 } from 'uuid';
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to format path name (convert kebab-case or snake_case to Title Case)
export const formatPathName = (path) => {
  if (!path) return '';
  
  // Replace hyphens and underscores with spaces, then capitalize each word
  return path
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
};

// Function to convert camelCase to Title Case
export const camelCaseToTitleCase = (str) => {
  if (!str) return '';
  
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Function to convert snake_case to Title Case
export const snakeCaseToTitleCase = (str) => {
  if (!str) return '';
  
  return str
    .split('_')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
};

// Function to convert kebab-case to Title Case
export const kebabCaseToTitleCase = (str) => {
  if (!str) return '';
  
  return str
    .split('-')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}; 

export const generateUUID = () => {
  return uuidv4();
};
