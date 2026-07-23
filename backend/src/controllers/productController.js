import prisma from "../config/db.js";

// Helper to generate slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// Helper to serialize Prisma Decimal money fields as consistent strings and formats for frontend
const serializeProduct = (product) => {
  if (!product) return null;
  const serialized = { ...product };
  
  if (serialized.price) {
    serialized.price = serialized.price.toString();
  }
  if (serialized.compareAtPrice) {
    serialized.compareAtPrice = serialized.compareAtPrice.toString();
  }

  // Calculate rating and review statistics dynamically
  if (serialized.reviews) {
    const totalReviews = serialized.reviews.length;
    let avgRating = null;
    if (totalReviews > 0) {
      const sum = serialized.reviews.reduce((acc, r) => acc + r.rating, 0);
      avgRating = parseFloat((sum / totalReviews).toFixed(1));
    }
    serialized.rating = avgRating;
    serialized.reviewsCount = totalReviews;
    delete serialized.reviews;
  } else {
    serialized.rating = null;
    serialized.reviewsCount = 0;
  }

  // Sync aggregate stock, colors, and stockStatus from active variants
  if (serialized.variants) {
    const activeVariants = serialized.variants.filter(v => v.isActive);
    serialized.colors = activeVariants.map(v => v.color);
    
    // Calculate total stock from active variants
    const totalStock = activeVariants.reduce((sum, v) => sum + v.stock, 0);
    serialized.stock = totalStock;
    serialized.stockStatus = totalStock === 0 ? "out-of-stock" : totalStock <= 5 ? "low-stock" : "in-stock";
  } else {
    serialized.colors = [];
    serialized.stockStatus = "out-of-stock";
  }

  return serialized;
};

// @desc    Get all active products with filters, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      featured,
      bestseller,
      search,
      inStock,
      sort,
      page,
      limit
    } = req.query;

    const where = { isActive: true };

    // 1. Category filter
    if (category) {
      where.category = { slug: category };
    }

    // 2. Price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && minPrice !== "") {
        const minVal = parseFloat(minPrice);
        if (!isNaN(minVal)) {
          where.price.gte = minVal;
        }
      }
      if (maxPrice !== undefined && maxPrice !== "") {
        const maxVal = parseFloat(maxPrice);
        if (!isNaN(maxVal)) {
          where.price.lte = maxVal;
        }
      }
    }

    // 3. Status filters
    if (featured === "true") {
      where.isFeatured = true;
    }
    if (bestseller === "true") {
      where.isBestseller = true;
    }

    // 4. In stock filter (checks if at least one active variant is in stock)
    if (inStock === "true") {
      where.variants = {
        some: {
          stock: { gt: 0 },
          isActive: true
        }
      };
    }

    // 5. Search (matches name, description, SKU, and variant SKUs)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        {
          variants: {
            some: {
              sku: { contains: search, mode: "insensitive" }
            }
          }
        }
      ];
    }

    // 6. Sorting Whitelist
    let orderBy = { createdAt: "desc" };
    if (sort) {
      switch (sort) {
        case "price-asc":
          orderBy = { price: "asc" };
          break;
        case "price-desc":
          orderBy = { price: "desc" };
          break;
        case "name-asc":
          orderBy = { name: "asc" };
          break;
        case "newest":
        default:
          orderBy = { createdAt: "desc" };
          break;
      }
    }

    // 7. Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 12, 50);
    const skip = (pageNum - 1) * limitNum;

    // 8. Execute queries
    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          images: {
            orderBy: { sortOrder: "asc" }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          variants: {
            where: { isActive: true }
          },
          reviews: {
            where: { isApproved: true }
          }
        }
      })
    ]);

    const serializedProducts = products.map(serializeProduct);

    return res.status(200).json({
      success: true,
      data: serializedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product by slug or UUID ID
// @route   GET /api/products/:slugOrId
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const queryWhere = uuidRegex.test(slugOrId)
      ? { id: slugOrId, isActive: true }
      : { slug: slugOrId, isActive: true };

    const product = await prisma.product.findFirst({
      where: queryWhere,
      include: {
        images: {
          orderBy: { sortOrder: "asc" }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        variants: {
          where: { isActive: true }
        },
        reviews: {
          where: { isApproved: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeProduct(product)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for Admin dashboard (includes inactive details)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        {
          variants: {
            some: {
              sku: { contains: search, mode: "insensitive" }
            }
          }
        }
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 12, 50);
    const skip = (pageNum - 1) * limitNum;

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
        include: {
          images: {
            orderBy: { sortOrder: "asc" }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          variants: true,
          reviews: true
        }
      })
    ]);

    const serializedProducts = products.map(serializeProduct);

    return res.status(200).json({
      success: true,
      data: serializedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product with variants
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      sku,
      categoryId,
      isActive,
      isFeatured,
      isBestseller,
      details,
      careInstructions,
      variants
    } = req.body;

    // 1. Required field validations
    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, price, categoryId)"
      });
    }

    // 2. Price validation
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number"
      });
    }

    let numComparePrice = null;
    if (compareAtPrice !== undefined && compareAtPrice !== null && compareAtPrice !== "") {
      numComparePrice = parseFloat(compareAtPrice);
      if (isNaN(numComparePrice) || numComparePrice < 0) {
        return res.status(400).json({
          success: false,
          message: "compareAtPrice must be a positive number"
        });
      }
    }

    // 3. Category validation
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format"
      });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Referenced category does not exist"
      });
    }

    // 4. Variant compilation (Default variant if empty)
    let variantsList = [{ color: "Standard", stock: 0, isActive: true }];
    if (variants && Array.isArray(variants) && variants.length > 0) {
      variantsList = variants.map(v => {
        const stockInt = parseInt(v.stock);
        if (!v.color || isNaN(stockInt) || stockInt < 0 || v.stock % 1 !== 0) {
          throw new Error("Each variant must have a valid color name and non-negative integer stock");
        }
        return {
          color: v.color.trim(),
          stock: stockInt,
          sku: v.sku || null,
          isActive: v.isActive !== undefined ? !!v.isActive : true
        };
      });
    }

    // Calculate aggregated stock count
    const totalStock = variantsList.reduce((sum, v) => sum + v.stock, 0);

    const finalSlug = slug ? generateSlug(slug) : generateSlug(name);

    // 5. Create product and nested variants
    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        price: numPrice,
        compareAtPrice: numComparePrice,
        sku: sku || null,
        stock: totalStock, // aggregate stock
        categoryId,
        isActive: isActive !== undefined ? !!isActive : true,
        isFeatured: isFeatured !== undefined ? !!isFeatured : false,
        isBestseller: isBestseller !== undefined ? !!isBestseller : false,
        details: details || [],
        careInstructions: careInstructions || null,
        variants: {
          create: variantsList
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: true,
        variants: true
      }
    });

    return res.status(201).json({
      success: true,
      data: serializeProduct(product)
    });
  } catch (error) {
    if (error.message.includes("Each variant must")) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Product slug, SKU or variant SKU already exists"
      });
    }
    next(error);
  }
};

// @desc    Update product properties and sync variants list
// @route   PATCH /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      sku,
      categoryId,
      isActive,
      isFeatured,
      isBestseller,
      details,
      careInstructions,
      variants
    } = req.body;

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
      if (!slug) {
        updateData.slug = generateSlug(name);
      }
    }
    if (slug !== undefined) updateData.slug = generateSlug(slug);
    if (description !== undefined) updateData.description = description;

    if (price !== undefined) {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a positive number"
        });
      }
      updateData.price = numPrice;
    }

    if (compareAtPrice !== undefined) {
      if (compareAtPrice === null || compareAtPrice === "") {
        updateData.compareAtPrice = null;
      } else {
        const numComparePrice = parseFloat(compareAtPrice);
        if (isNaN(numComparePrice) || numComparePrice < 0) {
          return res.status(400).json({
            success: false,
            message: "compareAtPrice must be a positive number"
          });
        }
        updateData.compareAtPrice = numComparePrice;
      }
    }

    if (sku !== undefined) updateData.sku = sku;

    if (categoryId !== undefined) {
      if (!uuidRegex.test(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID format"
        });
      }
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Referenced category does not exist"
        });
      }
      updateData.categoryId = categoryId;
    }

    if (isActive !== undefined) updateData.isActive = !!isActive;
    if (isFeatured !== undefined) updateData.isFeatured = !!isFeatured;
    if (isBestseller !== undefined) updateData.isBestseller = !!isBestseller;
    if (details !== undefined) updateData.details = details;
    if (careInstructions !== undefined) updateData.careInstructions = careInstructions;

    // Synchronize variant child entities inside transactions if passed
    if (variants !== undefined && Array.isArray(variants)) {
      // 1. Delete omitted variants
      const inputIds = variants.filter(v => v.id).map(v => v.id);
      await prisma.productVariant.deleteMany({
        where: {
          productId: id,
          id: { notIn: inputIds }
        }
      });

      // 2. Create/Update remaining variants
      for (const v of variants) {
        const stockInt = parseInt(v.stock);
        if (!v.color || isNaN(stockInt) || stockInt < 0 || v.stock % 1 !== 0) {
          return res.status(400).json({
            success: false,
            message: "Each variant must contain a valid color name and non-negative integer stock value"
          });
        }

        if (v.id) {
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              color: v.color.trim(),
              stock: stockInt,
              sku: v.sku || null,
              isActive: v.isActive !== undefined ? !!v.isActive : true
            }
          });
        } else {
          await prisma.productVariant.create({
            data: {
              productId: id,
              color: v.color.trim(),
              stock: stockInt,
              sku: v.sku || null,
              isActive: v.isActive !== undefined ? !!v.isActive : true
            }
          });
        }
      }
    }

    // Load final variants to calculate the updated aggregate stock count
    const activeVariants = await prisma.productVariant.findMany({
      where: { productId: id, isActive: true }
    });
    updateData.stock = activeVariants.reduce((sum, v) => sum + v.stock, 0);

    // Save product update
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: true,
        variants: true
      }
    });

    return res.status(200).json({
      success: true,
      data: serializeProduct(updatedProduct)
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Product slug, SKU or variant SKU already exists"
      });
    }
    next(error);
  }
};

// @desc    Toggle product activation status
// @route   PATCH /api/products/:id/status
// @access  Private/Admin
export const updateProductStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    if (isActive === undefined || typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean"
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isActive },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: true,
        variants: true
      }
    });

    return res.status(200).json({
      success: true,
      data: serializeProduct(updatedProduct)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific variant stock level
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateProductStock = async (req, res, next) => {
  try {
    const { id } = req.params; // Product ID
    const { variantId, stock } = req.body;

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id) || !uuidRegex.test(variantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID or variant ID format"
      });
    }

    const numStock = parseInt(stock);
    if (stock === undefined || isNaN(numStock) || numStock < 0 || stock % 1 !== 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative integer"
      });
    }

    // Verify product variant exists and links to this product
    const variant = await prisma.productVariant.findFirst({
      where: { id: variantId, productId: id }
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found"
      });
    }

    // Update variant stock
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: numStock }
    });

    // Load active variants to recalculate the aggregate product stock
    const activeVariants = await prisma.productVariant.findMany({
      where: { productId: id, isActive: true }
    });
    const totalStock = activeVariants.reduce((sum, v) => sum + v.stock, 0);

    // Save aggregated count
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: totalStock },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: true,
        variants: true
      }
    });

    return res.status(200).json({
      success: true,
      data: serializeProduct(updatedProduct)
    });
  } catch (error) {
    next(error);
  }
};
