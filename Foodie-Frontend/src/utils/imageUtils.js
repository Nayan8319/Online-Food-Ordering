// utils/imageUtils.js

export const BASE_URL = "http://localhost:5110"; // You can make this dynamic with environment variables

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http") || imageUrl.startsWith("data:image")) {
    return imageUrl;
  }
  return `${BASE_URL}${imageUrl}`;
};
