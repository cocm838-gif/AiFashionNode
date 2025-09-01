const { s3, PutObjectCommand } = require("../config/s3");
const path = require('path');

const uploadToS3 = async (file, userId) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const fileExtension = path.extname(file.originalname);
  
  const fileName = `profiles/profile_${userId}_${Date.now()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  // Use v3 send() instead of upload().promise()
  const command = new PutObjectCommand(params);
  await s3.send(command);

  // Construct file URL manually (v3 doesn’t return Location automatically)
  const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  return fileUrl;
};

module.exports = { uploadToS3 };
