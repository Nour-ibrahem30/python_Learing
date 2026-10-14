import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get video URL with transformations
export const getVideoUrl = (publicId, options = {}) => {
  const defaultOptions = {
    resource_type: 'video',
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

// Get video thumbnail
export const getVideoThumbnail = (publicId, options = {}) => {
  const defaultOptions = {
    resource_type: 'video',
    format: 'jpg',
    transformation: [
      { width: 640, height: 360, crop: 'fill' },
      { quality: 'auto' },
    ],
    ...options,
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

export default cloudinary;
