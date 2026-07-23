import prisma from "../config/db.js";

// Helper to generate slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findFirst({
      where: { slug, isActive: true }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a category name"
      });
    }

    const finalSlug = slug ? generateSlug(slug) : generateSlug(name);

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description,
        isActive: true
      }
    });

    return res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    // Unique constraint violation
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists"
      });
    }
    next(error);
  }
};

// @desc    Update a category
// @route   PATCH /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, isActive } = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID format"
      });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Whitelist and build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be a boolean"
        });
      }
      updateData.isActive = isActive;
    }
    if (slug !== undefined) {
      updateData.slug = generateSlug(slug);
    } else if (name !== undefined && name !== existingCategory.name && !slug) {
      updateData.slug = generateSlug(name);
    }

    // Save changes
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    // Unique constraint violation
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists"
      });
    }
    next(error);
  }
};
