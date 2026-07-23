import prisma from "../config/db.js";

// Helper to generate slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// Helper to serialize Prisma Decimal money fields as consistent strings
const serializeProduct = (product) => {
  if (!product) return null;
  const serialized = { ...product };
  if (serialized.price) {
    serialized.price = serialized.price.toString();
  }
  if (serialized.compareAtPrice) {
    serialized.compareAtPrice = serialized.compareAtPrice.toString();
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

    // Build public where query (always restrict to isActive = true)
    const where = { isActive: true };

    // 1. Category filter (by slug)
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

    // 3. Status filters (featured / bestseller)
    if (featured === "true") {
      where.isFeatured = true;
    }
    if (bestseller === "true") {
      where.isBestseller = true;
    }

    // 4. In stock filter
    if (inStock === "true") {
      where.stock = { gt: 0 };
    }

    // 5. Search filter (case-insensitive name/description/sku)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } }
      ];
    }

    // 6. Sorting Whitelist
    let orderBy = { createdAt: "desc" }; // default 'newest'
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
    const limitNum = Math.min(parseInt(limit) || 12, 50); // Hard cap limit to 50
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
          }
        }
      })
    ]);

    // 9. Format response (serialize Decimals to strings)
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

// @desc    Get a single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: { slug, isActive: true },
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

// @desc    Get all products for Admin dashboard (includes inactive)
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
        { sku: { contains: search, mode: "insensitive" } }
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

// @desc    Create a new product
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
      stock,
      sku,
      categoryId,
      isActive,
      isFeatured,
      isBestseller
    } = req.body;

    // 1. Required field validations
    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, price, categoryId)"
      });
    }

    // 2. Numeric field validations
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

    let numStock = 0;
    if (stock !== undefined) {
      numStock = parseInt(stock);
      if (isNaN(numStock) || numStock < 0 || stock % 1 !== 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative integer"
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

    const finalSlug = slug ? generateSlug(slug) : generateSlug(name);

    // 4. Create Product using Whitelisted data
    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        price: numPrice,
        compareAtPrice: numComparePrice,
        stock: numStock,
        sku: sku || null,
        categoryId,
        isActive: isActive !== undefined ? !!isActive : true,
        isFeatured: isActive !== undefined ? !!isFeatured : false,
        isBestseller: isActive !== undefined ? !!isBestseller : false
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: true
      }
    });

    return res.status(201).json({
      success: true,
      data: serializeProduct(product)
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Product slug or SKU already exists"
      });
    }
    next(error);
  }
};

// @desc    Update an existing product
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
      stock,
      sku,
      categoryId,
      isActive,
      isFeatured,
      isBestseller
    } = req.body;

    // 1. UUID validation
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    // 2. Validate product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 3. Build Whitelisted Update Object
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
      if (!slug) {
        updateData.slug = generateSlug(name);
      }
    }
    if (slug !== undefined) {
      updateData.slug = generateSlug(slug);
    }
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

    if (stock !== undefined) {
      const numStock = parseInt(stock);
      if (isNaN(numStock) || numStock < 0 || stock % 1 !== 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative integer"
        });
      }
      updateData.stock = numStock;
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

    // 4. Update in Database
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
        images: true
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
        message: "Product slug or SKU already exists"
      });
    }
    next(error);
  }
};

// @desc    Deactivate/Activate a product status
// @route   PATCH /api/products/:id/status
// @access  Private/Admin
export const updateProductStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // 1. UUID validation
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    // 2. Validate input is boolean
    if (isActive === undefined || typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean"
      });
    }

    // 3. Verify product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 4. Update status
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
        images: true
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

// @desc    Update product inventory stock level
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    // 1. UUID validation
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    // 2. Validate input is integer >= 0
    const numStock = parseInt(stock);
    if (stock === undefined || isNaN(numStock) || numStock < 0 || stock % 1 !== 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative integer"
      });
    }

    // 3. Verify product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 4. Update stock
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: numStock },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: true
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
