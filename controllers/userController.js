const { prisma } = require('../config');
const helper = require('../utils/response');
// const { uploadToS3 } = require("../utils/s3Upload");
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

exports.myProfile =
    async (req, res, next) => {
        try {
            const user = req.user;
            return helper.successResponseWithData(res, user, 'Geting user details');
        } catch (error) {
            console.log('error', error);
            next(error);
        }
    }

exports.uploadProfileImage =
    async (req, res, next) => {
        try {
            const user = req.user;
        
            if (!req.file) {
              return res.status(400).json({ error: "No file uploaded" });
            }
        
            // const fileUrl = await uploadToS3(req.file, user.id);

            const result = await uploadBufferToCloudinary(req.file.buffer, 'profiles', `profile_${user.id}`);
            const fileUrl = result.secure_url;
        
            // Save image URL in DB
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: { image: fileUrl },
            });
        
            return helper.successResponseWithData(
              res,
              updatedUser,
              "Profile image uploaded successfully"
            );
          } catch (error) {
            console.error("Upload error:", error);
            next(error);
          }
    }

exports.updateProfile =
    async (req, res, next) => {
        try {
            const user = req.user;
            const { name, bio, isPrivatePost } = req.body;

            const dataToUpdate = {};
            if (typeof name !== 'undefined') dataToUpdate.name = name;
            if (typeof bio !== 'undefined') dataToUpdate.bio = bio;
            if (typeof isPrivatePost !== 'undefined') dataToUpdate.isPrivatePost = Boolean(isPrivatePost);

            if (Object.keys(dataToUpdate).length === 0) {
                return res.status(400).json({ error: 'No valid fields provided to update' });
            }
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: dataToUpdate,
            });

            return helper.successResponseWithData(
                res,
                updatedUser,
                'Profile updated successfully'
            );
        } catch (error) {
            console.error('Update profile error:', error);
            next(error);
        }
    }
