# AiFassion API

A modern Express.js API with Prisma ORM, PostgreSQL, MongoDB (Mongoose), Twilio Verify integration, AWS S3 uploads, and Swagger documentation.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **Prisma ORM** - Type-safe database client (PostgreSQL)
- **Mongoose/MongoDB** - Use for products.
- **Twilio Verify** - Phone verification via Twilio Verify API
- **AWS S3 Uploads** - Profile image upload to S3 (2MB limit, images only)
- **Swagger/OpenAPI** - Interactive API documentation
- **JWT Authentication** - Secure token-based auth
- **Security Middleware** - Helmet, CORS, Rate Limiting
- **Validation** - express-validator schemas
- **Error Handling** - Centralized error handler
- **Graceful Shutdown** - Proper cleanup on server termination
- **Health Checks** - Simple health endpoint

## 📁 Project Structure

```
AiFassion/
├── app.js                   # Main application entry point
├── config/                  # Configuration files
│   ├── database.js          # Prisma client
│   ├── mongoose.js          # Mongoose connection (optional)
│   ├── s3.js                # AWS S3 client
│   ├── swagger.js           # Swagger setup
│   ├── twilio.js            # Twilio Verify configuration
│   └── index.js             # Config exports
├── middleware/              # Express middleware
│   ├── authentication.js    # JWT auth + role guard
│   ├── errorHandler.js      # Global error handling
│   ├── logging.js           # Request/error logging
│   ├── security.js          # Helmet, CORS, rate limits
│   ├── upload.js            # Multer (memory), 2MB, images only
│   ├── validation.js        # express-validator helpers
│   ├── validationSchemas.js # Request schemas
│   └── index.js             # Middleware exports
├── routes/
│   ├── authRouter.js        # /auth routes (OTP flows)
│   ├── userRouter.js        # /user routes (protected)
│   ├── productRouter.js     # /product routes (protected)
│   └── index.js             # Mounts routers, applies auth to /user
├── controllers/
│   ├── authController.js    # Auth + OTP controller
│   ├── productController.js # products + like + skip + updload
│   └── userController.js    # User profile + upload
├── models/
│   ├── index.js             # models exports
│   ├── products.js          # Mongo model for products data
│   ├── userInteraction.js   # Mongo model for user intraction data eg. likes or skips
│   └── tempUser.js          # Mongo model for temp signup data
├── utils/
│   ├── gracefulShutdown.js  # Graceful shutdown hooks
│   ├── response.js           # Response helpers
│   ├── messages.js          # Message constants
│   └── s3Upload.js          # Upload to S3 utility
├── docs/                    # Swagger docs
│   ├── auth.swagger.js
│   ├── system.swagger.js
│   ├── user.swagger.js
│   ├── product.swagger.js
│   └── swagger.json
├── prisma/
│   ├── schema.prisma        # DB schema
│   └── migrations/          # Migrations
└── package.json
```

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root and configure the variables below.

## 📝 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL (Prisma)
DATABASE_URL="postgresql://username:password@localhost:5432/aifassion"

# MongoDB (Mongoose) — optional but required for TempUser signup flow
MONGODB_URI="mongodb://localhost:27017/aifassion"

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_service_sid
TWILIO_TEST_MODE=true
STATIC_OTP=123456

# AWS S3
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-s3-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# CLOUDINARY without s3
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## 🗄️ Database

Apply database migrations:
```bash
npx prisma migrate dev
```

## 🏃‍♂️ Running the Application

- Development:
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

## 📚 API Documentation

- Swagger UI: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

## 🔐 Authentication & Roles

- JWT is required for `/user/*` routes.
- Role guard is enforced via `middleware/authentication.js`:
  - `/user/*` requires role `USER`.

## 📞 Auth Endpoints (OTP)

Base path: `/auth`

- `POST /auth/send-otp/sign-up` — Send OTP for signup (if phone not registered)
- `POST /auth/send-otp/sign-in` — Send OTP for signin (if phone exists)
- `POST /auth/verify-otp` — Verify OTP; creates user if new; returns JWT

Example — send signup OTP:
```bash
curl -X POST http://localhost:3000/auth/send-otp/sign-up \
  -H "Content-Type: application/json" \
  -d '{"phone": "1234567890", "code": "+1", "name": "Alex"}'
```

Example — verify OTP:
```bash
curl -X POST http://localhost:3000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "1234567890", "code": "+1", "otp": "123456"}'
```

Response:
```json
{
  "success": true,
  "message": "Verified successfully",
  "data": {
    "message": "Verified successfully",
    "isNew": false,
    "token": "<JWT>"
  }
}
```

## 👤 User Endpoints (Protected)

Base path: `/user` (requires `Authorization: Bearer <JWT>` and role `USER`)

- `GET /user/me` — Get current user profile
- `POST /user/upload-profile` — Upload profile image (multipart field `image`)

Upload example:
```bash
curl -X POST http://localhost:3000/user/upload-profile \
  -H "Authorization: Bearer <JWT>" \
  -F image=@"/path/to/profile.jpg"
```

Upload constraints:
- Only images are accepted (`image/*`)
- Max file size: 2 MB
- Stored in S3 at key format: `profiles/profile_<userId>_<timestamp>.<ext>`

## 🧪 Testing Mode (Twilio)

When `TWILIO_TEST_MODE=true`:
- Requests are logged instead of sent
- Static OTP (`STATIC_OTP`) is accepted

## 🧰 Notes

- MongoDB is used to store temporary signup data (`models/TempUser.js`) and requires `MONGODB_URI`. If you don't need signup temp storage, you can skip MongoDB.
- The server logs confirm MongoDB connection when `MONGODB_URI` is provided.

## 📄 License

ISC
