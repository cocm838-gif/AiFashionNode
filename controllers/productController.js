const moment = require('moment');
const response = require('../utils/response');
const helper = require('../utils/helper');
const { UserInteraction, Product } = require('../models/index');
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

exports.addProduct = async (req, res, next) => {
    try {
        const user = req.user;
        const { title, price, description, currency } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const uploadResult = await uploadBufferToCloudinary(
            req.file.buffer,
            'products',
            `product_${user.id}`
        );

        const imageUrl = uploadResult.secure_url;

        const product = await Product.create({
            userId: user.id,
            title,
            image: imageUrl,
            price,
            description,
            currency,
        });

        return response.successResponseWithData(res, product, 'Product created');
    } catch (error) {
        next(error);
    }
};

exports.likeProduct = async (req, res, next) => {
    try {
        const user = req.user;
        const { productId } = req.params;

        // Ensure product exists
        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if already liked or skiped anywhere 
        const alreadyLikedOrSkiped = await UserInteraction.exists({ userId: String(user.id), $or: [{ 'likes.productId': product._id }, { 'skips.productId': product._id }] });
        if (alreadyLikedOrSkiped) {
            return res.status(409).json({ error: 'Product already liked or skiped' });
        }

        const weekStart = moment().utc().startOf('week').toDate();
        const update = {
            $addToSet: { likes: { productId } },
            $pull: { skips: { productId } },
            $setOnInsert: { weekStart }
        };

        const interaction = await UserInteraction.findOneAndUpdate(
            { userId: String(user.id), weekStart },
            update,
            { upsert: true, new: true }
        );

        return res.status(200).json({ message: 'Product liked' });
    } catch (error) {
        next(error);
    }
};
exports.skipProduct = async (req, res, next) => {
    try {
        const user = req.user;
        const { productId } = req.params;

        // Ensure product exists
        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if already liked or skiped anywhere 
        const alreadyLikedOrSkiped = await UserInteraction.exists({ userId: String(user.id), $or: [{ 'likes.productId': product._id }, { 'skips.productId': product._id }] });
        if (alreadyLikedOrSkiped) {
            return res.status(409).json({ error: 'Product already liked or skiped' });
        }

        const weekStart = moment().utc().startOf('week').toDate();
        const update = {
            $addToSet: { skips: { productId } },
            $pull: { likes: { productId } },
            $setOnInsert: { weekStart }
        };

        const interaction = await UserInteraction.findOneAndUpdate(
            { userId: String(user.id), weekStart },
            update,
            { upsert: true, new: true }
        );

        return res.status(200).json({ message: 'Product skipped' });
    } catch (error) {
        next(error);
    }
};


// Suggestions in a single aggregation pipeline
exports.getSuggestions = async (req, res, next) => {
    try {
        const userId = String(req.user.id);

        const items = await UserInteraction.aggregate([
            {
                '$match': {
                    'userId': userId
                }
            }, {
                '$project': {
                    '_id': 0,
                    'all': {
                        '$setUnion': [
                            '$likes.productId', '$skips.productId'
                        ]
                    }
                }
            }, {
                '$unwind': {
                    'path': '$all',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$group': {
                    '_id': null,
                    'ids': {
                        '$addToSet': '$all'
                    }
                }
            }, {
                '$project': {
                    '_id': 0,
                    'ids': 1
                }
            }, {
                '$lookup': {
                    'from': 'products',
                    'let': {
                        'excludedIds': '$ids',
                        'userId': '$userId'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$ne': [
                                                '$userId', '$$userId'
                                            ]
                                        }, {
                                            '$not': {
                                                '$in': [
                                                    '$_id', '$$excludedIds'
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }, {
                            '$sample': {
                                'size': 10
                            }
                        }
                    ],
                    'as': 'products'
                }
            }, {
                '$unwind': '$products'
            }, {
                '$replaceRoot': {
                    'newRoot': '$products'
                }
            }
        ]);

        // Attach user info to products using helper function
        const productsWithUserInfo = await helper.attachUserInfoToProducts(items);

        return response.successResponseWithData(res, productsWithUserInfo, 'Suggestions data fetched');
    } catch (error) {
        next(error);
    }
};

exports.getLikes = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const pipeline = [
            {
                '$match': {
                    'userId': userId
                }
            }, {
                '$unwind': '$likes'
            }, {
                '$group': {
                    '_id': '$likes.productId',
                    'actedAt': {
                        '$max': '$likes.actedAt'
                    }
                }
            }, {
                '$sort': {
                    'actedAt': -1
                }
            }, {
                '$lookup': {
                    'from': 'products',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'products'
                }
            }, {
                '$unwind': '$products'
            }, {
                '$replaceRoot': {
                    'newRoot': '$products'
                }
            }, {
                '$facet': {
                    'items': [
                        {
                            '$skip': skip
                        }, {
                            '$limit': limit
                        }
                    ],
                    'total': [
                        {
                            '$count': 'count'
                        }
                    ]
                }
            }, {
                '$project': {
                    'items': 1,
                    'total': {
                        '$ifNull': [
                            {
                                '$arrayElemAt': [
                                    '$total.count', 0
                                ]
                            }, 0
                        ]
                    }
                }
            }
        ];
        const [{ items, total }] = await UserInteraction.aggregate(pipeline);

        // Attach user info to products using helper function
        const productsWithUserInfo = await helper.attachUserInfoToProducts(items);

        return response.successResponseWithData(res, { items: productsWithUserInfo, total, page, limit }, 'Likes data fetched');
    } catch (error) {
        next(error);
    }
};

exports.getSkips = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const pipeline = [
            {
                '$match': {
                    'userId': userId
                }
            }, {
                '$unwind': '$likes'
            }, {
                '$group': {
                    '_id': '$skips.productId',
                    'actedAt': {
                        '$max': '$skips.actedAt'
                    }
                }
            }, {
                '$sort': {
                    'actedAt': -1
                }
            }, {
                '$lookup': {
                    'from': 'products',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'products'
                }
            }, {
                '$unwind': '$products'
            }, {
                '$replaceRoot': {
                    'newRoot': '$products'
                }
            }, {
                '$facet': {
                    'items': [
                        {
                            '$skip': skip
                        }, {
                            '$limit': limit
                        }
                    ],
                    'total': [
                        {
                            '$count': 'count'
                        }
                    ]
                }
            }, {
                '$project': {
                    'items': 1,
                    'total': {
                        '$ifNull': [
                            {
                                '$arrayElemAt': [
                                    '$total.count', 0
                                ]
                            }, 0
                        ]
                    }
                }
            }
        ];
        const [{ items, total }] = await UserInteraction.aggregate(pipeline);
        // Attach user info to products using helper function
        const productsWithUserInfo = await helper.attachUserInfoToProducts(items);

        return response.successResponseWithData(res, { items: productsWithUserInfo, total, page, limit }, 'Skips data fetched');
    } catch (error) {
        next(error);
    }
};




