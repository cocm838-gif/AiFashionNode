const { uploader } = require('../config/cloudinary');
const stream = require('stream');

async function uploadBufferToCloudinary(fileBuffer, folder, publicIdPrefix) {
  return new Promise((resolve, reject) => {
    const readableStream = new stream.PassThrough();
    readableStream.end(fileBuffer);

    const uploadOptions = {
      folder: folder || 'profiles',
      public_id: publicIdPrefix ? `${publicIdPrefix}_${Date.now()}` : undefined,
      resource_type: 'image',
      overwrite: true,
    };

    const cloudinaryStream = uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    readableStream.pipe(cloudinaryStream);
  });
}

module.exports = { uploadBufferToCloudinary };
