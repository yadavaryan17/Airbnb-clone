const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APL_KEY,
    api_secret: process.env.CLOUD_APL_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust_DEV",
      allowerdFormats: ["png","jpg","jpeg"], // supports promises as well
    },
  });

  module.exports = {
    cloudinary,
    storage,
  }