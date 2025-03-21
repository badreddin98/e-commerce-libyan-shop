/**
 * Analyzes user's order history to extract preferences for recommendations
 * @param {Array} orderHistory - User's order history with populated product details
 * @returns {Object} User preferences including preferred categories and price ranges
 */
const analyzeUserPreferences = (orderHistory) => {
  const categoryFrequency = {};
  let totalSpent = 0;
  let itemCount = 0;

  // Analyze order history
  orderHistory.forEach(order => {
    order.orderItems.forEach(item => {
      if (item.product) {
        // Track category frequency
        const category = item.product.category;
        categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;

        // Track spending patterns
        totalSpent += item.product.price;
        itemCount++;
      }
    });
  });

  // Get top categories (up to 3)
  const categories = Object.entries(categoryFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);

  // Calculate price range preferences
  const avgSpentPerItem = itemCount > 0 ? totalSpent / itemCount : 0;
  const minPrice = Math.max(0, avgSpentPerItem * 0.5);
  const maxPrice = avgSpentPerItem * 1.5;

  // If no history, return default preferences
  if (categories.length === 0) {
    return {
      categories: ['Men', 'Women', 'Accessories'], // Default categories
      minPrice: 0,
      maxPrice: 1000
    };
  }

  return {
    categories,
    minPrice,
    maxPrice
  };
};

module.exports = {
  analyzeUserPreferences
};
