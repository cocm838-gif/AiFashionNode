const { prisma, twilioService } = require('../config');
const jwt = require('jsonwebtoken');
const helper = require('../utils/response');
const messages = require('../utils/messages');
const TempUser = require('../models/tempUser');

// Send OTP for SIGNUP: ensure phone not registered yet
exports.sendSignupOtp =
    async (req, res, next) => {
        try {
            const { phone, code, name } = req.body;

            const existing = await prisma.user.findUnique({
                where: { countryCode: code, phone },
            });

            if (existing) {
                return helper.errorResponse(res, 'Account already exists. Please sign in.', 400);
            }

            // Create/refresh temp user in MongoDB (10-min TTL)
            await TempUser.findOneAndUpdate(
                { countryCode: code, phone },
                {
                    name,
                    countryCode: code,
                    phone,
                    createdAt: new Date()
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            const verification = await twilioService.sendVerification(phone, code);
            return helper.successResponseWithData(res, verification, 'OTP sent for signup');
        } catch (error) {
            console.log('error', error);
            next(error);
            // return helper.errorResponse(res, messages.CATCH_BLOCK, 500);
        }
    }

// Send OTP for SIGNIN: ensure phone exists
exports.sendSigninOtp =
    async (req, res) => {
        try {
            const { phone, code } = req.body;

            const user = await prisma.user.findUnique({
                where: { countryCode: code, phone },
            });

            if (!user) {
                return helper.errorResponse(res, 'No account found. Please sign up.', 404);
            }

            const verification = await twilioService.sendVerification(phone, code);
            return helper.successResponseWithData(res, verification, 'OTP sent for signin');
        } catch (error) {
            console.log('error', error);
            return helper.errorResponse(res, messages.CATCH_BLOCK, 500);
        }
    }

// Verify OTP → find or create user → issue JWT
exports.verifyOtpTwilio =
    async (req, res) => {
        try {
            const { phone, code, otp } = req.body;

            const verificationCheck = await twilioService.verifyCode(phone, otp, code);

            if (!verificationCheck || verificationCheck.success !== true) {
                return helper.errorResponse(res, 'Invalid OTP', 401);
            }

            // Find by composite unique (countryCode, phone) or emulate via AND filter
            let user = await prisma.user.findFirst({ where: { countryCode: code, phone } });
            let isNew = false;

            if (!user) {
                const findUserName = await TempUser.findOne({ countryCode: code, phone }, { name: 1 }).lean();

                // Create new user for signup path
                user = await prisma.user.create({ data: { countryCode: code, phone, name: findUserName ? findUserName.name : '' } });
                isNew = true;

                // Best-effort cleanup of temp record in MongoDB
                try {
                    await TempUser.deleteOne({ countryCode: code, phone });
                } catch (cleanupError) {
                    console.warn('TempUser cleanup failed:', cleanupError);
                }
            }

            const jwtSecret = process.env.JWT_SECRET || 'change_me_in_env';
            const token = jwt.sign(
                { userId: user.id },
                jwtSecret,
                { expiresIn: '7d' }
            );

            return helper.successResponseWithData(res, {
                message: 'Verified successfully',
                isNew,
                token
            });
        } catch (error) {
            console.log('error', error);
            return helper.errorResponse(res, messages.CATCH_BLOCK, 500);
        }
    }
