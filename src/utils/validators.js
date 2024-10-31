// validators.js

// 👉 Check if value is empty
export const isEmpty = (value) => {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
};

// 👉 Required Validator
export const requiredValidator = (value) => {
  return (!isEmpty(value) && !!String(value).trim().length) || 'This field is required';
};

// 👉 Email Validator
export const emailValidator = (value) => {
  if (isEmpty(value)) return true;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value)) || 'The Email field must be a valid email address';
};

// 👉 Password Validator
export const passwordValidator = (password) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
  return regExp.test(password) || 'Password must include uppercase, lowercase, number, and special character, with at least 8 characters';
};

// 👉 Confirm Password Validator
export const confirmPasswordValidator = (value, targetValue) => {
  return value === targetValue || 'The passwords do not match';
};

// 👉 Between Validator (for numbers)
export const betweenValidator = (value, min, max) => {
  const num = Number(value);
  return (!isNaN(num) && num >= min && num <= max) || `Enter a number between ${min} and ${max}`;
};

// 👉 Integer Validator
export const integerValidator = (value) => {
  return /^-?\d+$/.test(String(value)) || 'This field must be an integer';
};

// 👉 URL Validator
export const urlValidator = (value) => {
  if (isEmpty(value)) return true;
  const re = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}/;
  return re.test(String(value)) || 'URL is invalid';
};

// 👉 Alpha Validator (only letters)
export const alphaValidator = (value) => {
  return /^[A-Za-z]*$/.test(String(value)) || 'This field may only contain alphabetic characters';
};

// 👉 Length Validator
export const lengthValidator = (value, minLength) => {
  return (String(value).length >= minLength) || `This field must be at least ${minLength} characters long`;
};

// 👉 Regex Validator (custom patterns)
export const regexValidator = (value, regex) => {
  if (typeof regex === 'string') regex = new RegExp(regex);
  return regex.test(String(value)) || "Your input doesn't match the expected format";
};