const mongoose = require('mongoose');

const { Schema } = mongoose;

const interactionProductSubSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    actedAt: { type: Date, default: Date.now },
  }
);

const userInteractionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    weekStart: { type: Date, required: true, index: true }, // Sunday 00:00 of the week
    likes: { type: [interactionProductSubSchema], default: [] },
    skips: { type: [interactionProductSubSchema], default: [] },
  },
  {
    timestamps: true,
    collection: 'userInteractions'
  }
);

// Useful indexes for fast lookups and sorting
userInteractionSchema.index({ userId: 1, weekStart: 1 }, { unique: true });
userInteractionSchema.index({ userId: 1, weekStart: 1, 'likes.productId': 1 });
userInteractionSchema.index({ userId: 1, weekStart: 1, 'skips.productId': 1 });

module.exports = mongoose.model('UserInteraction', userInteractionSchema);


