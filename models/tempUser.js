const mongoose = require('mongoose');

const TempUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    countryCode: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    // TTL anchor field: docs will auto-expire 10 minutes after creation
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // 10 minutes in seconds
    },
  },
  {
    versionKey: false,
    collection: 'tempUsers',
  }
);

TempUserSchema.index({ countryCode: 1, phone: 1 }, { unique: true });

module.exports = mongoose.models.TempUser || mongoose.model('TempUser', TempUserSchema);


