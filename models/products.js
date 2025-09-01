const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema(
    {
        userId: {
            type: String,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 150,
        },
        image: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        currency: {
            type: String,
            enum: ['INR', 'USD', 'EUR', 'GBP', 'JPY'],
            default: 'INR',
        },

    },
    {
        timestamps: true,
    }
);

// Prevent model overwrite in watch/hot-reload environments
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);


