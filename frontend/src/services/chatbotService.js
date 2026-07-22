/**
 * Eyara Assistant Chatbot Service
 * 
 * Centralized rule-based parser that handles user messages on the frontend,
 * performing searches on the active product catalog and generating contextual answers.
 * 
 * ⚙️ STOCK & AVAILABILITY RULES:
 * - We prioritize in-stock or low-stock items in all recommendations.
 * - Out-of-stock items are pushed to the bottom of lists.
 */

// Sorter to prioritize in-stock items over out-of-stock items
const sortProductsByAvailability = (list) => {
  return [...list].sort((a, b) => {
    const aOut = a.stock === 0 || a.stockStatus === 'out-of-stock';
    const bOut = b.stock === 0 || b.stockStatus === 'out-of-stock';
    if (aOut && !bOut) return 1;
    if (!aOut && bOut) return -1;
    return 0;
  });
};

export const chatbotService = {
  generateResponse(messageText, allProducts = [], cartCount = 0, isLoggedIn = false) {
    const text = messageText.toLowerCase().trim();

    // 1. GREETINGS MATCH
    const greetingWords = ['hi', 'hello', 'hey', 'greetings', 'yo', 'sup', 'morning', 'afternoon'];
    if (greetingWords.some(word => text === word || text.startsWith(word + ' '))) {
      return {
        text: "Hi there! Welcome to Eyara Essence. 🌸 What can I help you find today? I can search products, recommend gifts, or answer care questions.",
        quickActions: ['Shop Products', 'Gifts Under ₹500', 'Bestsellers', 'Product Care']
      };
    }

    // 2. CART HELP MATCH
    if (text.includes('cart') || text.includes('basket') || text.includes('bag')) {
      if (cartCount === 0) {
        return {
          text: "Your shopping cart is currently empty. Would you like to explore our collections and find something cozy?",
          quickActions: ['Amigurumis', 'Keychains', 'Bestsellers'],
          actions: [{ label: "Browse Shop", path: "/shop" }]
        };
      }
      return {
        text: `You currently have ${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart. Ready to secure your handcrafted creations?`,
        actions: [{ label: "View Shopping Cart", path: "/cart" }]
      };
    }

    // 3. ORDER HELP / TRACKING MATCH
    if (text.includes('order') || text.includes('track') || text.includes('parcel') || text.includes('shipment')) {
      if (isLoggedIn) {
        return {
          text: "Let's check your order details! You can view shipping statuses, tracking IDs, and purchase history directly in your account dashboard.",
          actions: [{ label: "View My Orders", path: "/account" }]
        };
      } else {
        return {
          text: "To view your orders and check delivery status, please sign in to your Eyara account first.",
          actions: [{ label: "Login to View Orders", path: "/login?type=customer" }]
        };
      }
    }

    // 4. CUSTOM ORDERS / CUSTOMIZATION MATCH
    if (text.includes('custom') || text.includes('personalize') || text.includes('color') || text.includes('customize')) {
      return {
        text: "Custom color selections and sizing depend on the creation. Please drop us a message on our Contact page detailing your design ideas, colors, and timeline so we can accommodate your requests!",
        actions: [{ label: "Contact Us", path: "/contact" }]
      };
    }

    // 5. PRODUCT CARE MATCH
    if (text.includes('wash') || text.includes('clean') || text.includes('care') || text.includes('dirty') || text.includes('maintenance')) {
      return {
        text: "🧼 **Handmade Care Guide**:\n\n1. **Gentle Wash**: Always hand-wash gently in cold water using a mild wool/baby detergent.\n2. **No Wringing**: Press out excess water between clean towels—do not twist or wring.\n3. **Reshape & Dry**: Reshape the item while damp and lay it flat to dry completely in the shade.\n4. **Avoid Heat**: Never place crochet creations in hot dryers or expose them to high heat.",
        quickActions: ['Shop Products', 'Bestsellers']
      };
    }

    // 6. PRICE-BASED SHOPPING QUERY MATCH
    const priceRegex = /(?:under|below|less than|budget|₹|rs\.?)\s*(\d+)/i;
    const priceMatch = text.match(priceRegex);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1], 10);
      const filtered = allProducts.filter(p => p.price <= maxPrice);
      const sortedMatches = sortProductsByAvailability(filtered).slice(0, 3);

      if (sortedMatches.length === 0) {
        return {
          text: `I couldn't find any products in our catalog under ₹${maxPrice} right now. Our items are slowly hand-crocheted using premium wools. Would you like to check out some of our other popular creations?`,
          quickActions: ['Bestsellers', 'Keychains', 'Bookmarks']
        };
      }

      return {
        text: `Here are some of our beautiful handcrafted creations under ₹${maxPrice}:`,
        products: sortedMatches,
        quickActions: ['Keychains', 'Bookmarks', 'Gifts Under ₹500']
      };
    }

    // 7. GIFT RECOMMENDATIONS MATCH
    if (text.includes('gift') || text.includes('present') || text.includes('birthday') || text.includes('friend')) {
      const giftCategories = ['Keychains', 'Bookmarks', 'Bracelets', 'Amigurumis', 'Mini Card Holders'];
      
      // Filter candidates, sort them by rating (best first), then prioritize in-stock
      const candidates = allProducts.filter(p => giftCategories.includes(p.category));
      const sortedByRating = [...candidates].sort((a, b) => b.rating - a.rating);
      const sortedMatches = sortProductsByAvailability(sortedByRating).slice(0, 3);

      return {
        text: "🎁 **Gift Suggestions**:\n\nOur keychains, bookmarks, and amigurumis make incredibly popular gifts! They come pre-packaged in Kraft boxes. Here are a few cute recommendations:",
        products: sortedMatches,
        quickActions: ['Gifts Under ₹500', 'Bestsellers', 'Custom Orders']
      };
    }

    // 8. CATEGORY DIRECT MATCH
    const categoriesList = [
      { key: 'amigurumi', name: 'Amigurumis', route: '/shop?category=Amigurumis' },
      { key: 'keychain', name: 'Keychains', route: '/shop?category=Keychains' },
      { key: 'bookmark', name: 'Bookmarks', route: '/shop?category=Bookmarks' },
      { key: 'earphone', name: 'Earphone Cases', route: '/shop?category=Earphone%20Cases' },
      { key: 'card', name: 'Mini Card Holders', route: '/shop?category=Mini%20Card%20Holders' },
      { key: 'bracelet', name: 'Bracelets', route: '/shop?category=Bracelets' },
      { key: 'headband', name: 'Headbands', route: '/shop?category=Headbands' },
      { key: 'bandana', name: 'Bandanas', route: '/shop?category=Bandanas' },
      { key: 'hanger', name: 'Car Hangers', route: '/shop?category=Car%20Hangers' },
      { key: 'organizer', name: 'Small Organizers', route: '/shop?category=Small%20Organizers' }
    ];

    const matchedCategory = categoriesList.find(c => text.includes(c.key));
    if (matchedCategory) {
      const matches = allProducts.filter(p => p.category === matchedCategory.name);
      const sortedMatches = sortProductsByAvailability(matches).slice(0, 3);

      return {
        text: `Here are some of our beautiful, handmade ${matchedCategory.name}:`,
        products: sortedMatches,
        actions: [{ label: `View all ${matchedCategory.name}`, path: matchedCategory.route }],
        quickActions: ['Shop Products', 'Bestsellers', 'Product Care']
      };
    }

    // 9. GENERAL KEYWORD PRODUCT SEARCH
    const searchMatches = allProducts.filter(p => 
      text.includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().split(' ').some(word => word.length > 2 && text.includes(word)) ||
      p.category.toLowerCase().split(' ').some(word => word.length > 2 && text.includes(word))
    );
    
    const sortedSearchMatches = sortProductsByAvailability(searchMatches).slice(0, 3);

    if (sortedSearchMatches.length > 0) {
      return {
        text: "I found these matching handcrafted creations in our catalog:",
        products: sortedSearchMatches,
        quickActions: ['Bestsellers', 'Shop Products']
      };
    }

    // 10. UNKNOWN FALLBACK RESPONSES
    return {
      text: "I'm not sure I understand that query. 🧶 I am trained as a specialized Eyara Essence shopping companion. I can help search for products, filter by price, recommend gifts, explain care instructions, or direct you to contact support.",
      quickActions: ['Shop Products', 'Gifts Under ₹500', 'Bestsellers', 'Order Help', 'Product Care']
    };
  }
};
