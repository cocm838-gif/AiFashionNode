/**
 * @swagger
 * components:
 *   schemas:
 *     SendOTPRequest:
 *       type: object
 *       required:
 *         - phone
 *         - code
 *       properties:
 *         phone:
 *           type: string
 *           description: Phone number
 *           example: "1234567890"
 *         code:
 *           type: string
 *           description: Country code
 *           example: "+1"
 *     SignupSendOTPRequest:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - code
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "John Doe"
 *         phone:
 *           type: string
 *           description: Phone number
 *           example: "1234567890"
 *         code:
 *           type: string
 *           description: Country code
 *           example: "+1"
 *     
 *     VerifyOTPRequest:
 *       type: object
 *       required:
 *         - phone
 *         - code
 *         - otp
 *       properties:
 *         phone:
 *           type: string
 *           description: Phone number
 *           example: "1234567890"
 *         code:
 *           type: string
 *           description: Country code
 *           example: "+1"
 *         otp:
 *           type: string
 *           description: OTP code
 *           example: "123456"
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation successful"
 *         data:
 *           type: object
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Error message"
 *         message:
 *           type: string
 *           example: "Error message"
 *     
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Validation Error"
 *         message:
 *           type: string
 *           example: "Validation error message"
 *         details:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * /auth/send-otp/sign-up:
 *   post:
 *     summary: Send OTP for signup using Twilio Verify
 *     description: Sends a verification code to the specified phone number for signup if the phone is not already registered. Includes temporary MongoDB record creation with a 10-minute TTL.
 *     tags: [Authentication]
 *     security: []   # 🚀 This disables the global bearerAuth for this endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupSendOTPRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         success:
 *                           type: boolean
 *                           example: true
 *                         status:
 *                           type: string
 *                           example: "pending"
 *                         sid:
 *                           type: string
 *                           example: "VE1234567890abcdef"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/send-otp/sign-in:
 *   post:
 *     summary: Send OTP for signin using Twilio Verify
 *     description: Sends a verification code to the specified phone number for signin if the account exists.
 *     tags: [Authentication] 
 *     security: []   # 🚀 This disables the global bearerAuth for this endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOTPRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         success:
 *                           type: boolean
 *                           example: true
 *                         status:
 *                           type: string
 *                           example: "pending"
 *                         sid:
 *                           type: string
 *                           example: "VE1234567890abcdef"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: Phone number already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No account found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP code using Twilio Verify
 *     description: Verifies the OTP code sent to the phone number using Twilio Verify service
 *     tags: [Authentication]
 *     security: []   # 🚀 This disables the global bearerAuth for this endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: OTP verification successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Verified successfully"
 *                         isNew:
 *                           type: boolean
 *                           example: false
 *                         token:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
