const { prisma } = require('../config');

/**
 * Fetch user information for products and attach userName and userImage
 * @param {Array} items - Array of products with userId
 * @returns {Array} Products with attached user information
 */
exports.attachUserInfoToProducts = async (items) => {
  // Get unique user IDs from products and filter out invalid UUIDs
  const userIds = [...new Set(items.map(item => item.userId))].filter(id => {
    // Basic UUID validation - should be 32 hex characters with optional hyphens
    const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  });

  let users = [];
  if (userIds.length > 0) {
    // Fetch all users in one query
    users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true }
    });
  }

  // Create a map for quick lookup
  const userMap = users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});

  // Attach user info to products
  return items.map(product => ({
    ...product,
    userName: userMap[product.userId]?.name || null,
    userImage: userMap[product.userId]?.image || null
  }));
};

