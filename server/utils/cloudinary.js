const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Storage configuration for banners/hero images
 */
const bannerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rk-care/banners',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }]
  }
});

/**
 * Storage configuration for general clinical assets (doctors, posters, etc.)
 */
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rk-care/general',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }]
  }
});

/**
 * Storage configuration for exercises (often needs to preserve details)
 */
const exerciseStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rk-care/exercises',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    transformation: [{ width: 1000, crop: 'limit', quality: 'auto' }]
  }
});

module.exports = {
  cloudinary,
  bannerStorage,
  generalStorage,
  exerciseStorage
};
